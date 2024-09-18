import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { VehicleEntity } from './entity/vehicle.entity';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as XLSX from 'xlsx';
import { NotificationGateway } from 'apps/notification-service/src/notification-service.gateway';

@Injectable()
@Processor('file-upload-queue')
export class ProcessService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationGateway: NotificationGateway,
  ) { }

  private readonly NOTIFICATION_BATCH = 100;

  @Process('process-data')
  async handleJob(job: Job) {
    try {
      console.log(job.data);
      const filePath = job.data.filePath;
      const fileExtension = path.extname(filePath).toLowerCase();
      let rows: any[] = [];

      // Parse the file based on its extension
      if (fileExtension === '.csv') {
        rows = await this.parseCSVFile(filePath);
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        rows = await this.parseExcelFile(filePath);
      } else {
        console.error('Unsupported file type', fileExtension);
        return;
      }

      console.log("All are done");
      await this.sendFirst100RowsAndCount();

    } catch (error) {
      console.error('Error processing job:', error);
    }
  }

  private async parseCSVFile(filePath: string): Promise<any[]> {
    const results: any[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          row.age_of_vehicle = new Date().getFullYear() - new Date(row.manufactured_date).getFullYear();
          results.push(row);
        })
        .on('end', async () => {
          if (results.length > 0) {
            await this.insertDataIntoDatabase(results); // Insert all data at once
          }
          resolve(results);
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          reject(error);
        });
    });
  }

  private async parseExcelFile(filePath: string): Promise<any[]> {
    const results: any[] = [];
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      jsonData.forEach((row: any) => {
        row.age_of_vehicle = new Date().getFullYear() - new Date(row.manufactured_date).getFullYear();
      });

      await this.insertDataIntoDatabase(jsonData); // Insert all data at once
      results.push(...jsonData);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
    return results;
  }

  private async insertDataIntoDatabase(data: any[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const batchInsertData = data.map(row => {
        const vehicleEntity = new VehicleEntity();
        vehicleEntity.firstName = row.first_name;
        vehicleEntity.lastName = row.last_name;
        vehicleEntity.email = row.email;
        vehicleEntity.carMake = row.car_make;
        vehicleEntity.carModel = row.car_model;
        vehicleEntity.vin = row.vin;
        vehicleEntity.manufacturedDate = new Date(row.manufactured_date);
        vehicleEntity.ageOfVehicle = row.age_of_vehicle;
        return vehicleEntity;
      });

      try {
        await manager.save(VehicleEntity, batchInsertData); // Insert all data in one go
        console.log(`Inserted ${batchInsertData.length} records into the database`);
      } catch (error) {
        console.error('Error inserting batch into database:', error);
        throw error;
      }
    });
  }

  private async sendFirst100RowsAndCount(): Promise<void> {
    console.log("Fetching first 100 rows");

    //get first 100 rows to display frontend
    const first100Rows = await this.dataSource
      .getRepository(VehicleEntity)
      .createQueryBuilder('vehicle')
      .orderBy('vehicle.id', 'ASC')
      .take(this.NOTIFICATION_BATCH)
      .getMany();

      //get count of data
    const totalRows = await this.dataSource.getRepository(VehicleEntity).count();

    //calculate page count to set pagination buttons
    const pageCount = Math.ceil(totalRows / 100);

    console.log('First 100 Rows:', first100Rows);
    console.log('Total Rows:', totalRows);
    console.log('Page Count:', pageCount);

    try {
      //use notification-service to send data to frontend
      this.notificationGateway.sendNotification({
        first100Rows,
        totalRows,
        pageCount,
      });
      console.log("sent data to notification");
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
