import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entity/vehicle.entity';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';
import * as fs from 'fs';
import { RequestExport } from './dto/request-export.dto';
import { createObjectCsvWriter } from 'csv-writer';

@Injectable()
export class ExportService {

  constructor(@InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,) { }

  async exportVehicleData(requestExport: RequestExport): Promise<{ message: string, path: string }> {
    const query = this.vehicleRepository.createQueryBuilder('vehicle');

    //filter by vehcile make -  export-service
    if (requestExport.vehicle) {
      query.andWhere('vehicle.carMake = :make', { make: requestExport.vehicle });
    }

    //filter by vehcile model -  export-service
    if (requestExport.model) {
      query.andWhere('vehicle.carModel = :model', { model: requestExport.model });
    }

    //filter by vehcile age -  export-service
    if (requestExport.age) {
      const targetYear = new Date().getFullYear() - requestExport.age;
      query.andWhere('YEAR(vehicle.manufacturedDate) <= :age', { age: targetYear });
    }

    //get vehicles according to query
    const vehicles = await query.getMany();

    if (!vehicles || vehicles.length === 0) {
      return { message: 'No vehicles found with the given details', path: '' };
    }

    //create new export directory for save export files
    const exportsDir = './exports';
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
    }

    //format date using dayjs
    const formattedVehicles = vehicles.map(vehicle => ({
      ...vehicle,
      manufacturedDate: dayjs(vehicle.manufacturedDate).format('YYYY-MM-DD'),
    }));

    const filePath = `${exportsDir}/vehicles_export_${Date.now()}.csv`;
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'firstName', title: 'First Name' },
        { id: 'lastName', title: 'Last Name' },
        { id: 'email', title: 'Email' },
        { id: 'carMake', title: 'Car Make' },
        { id: 'carModel', title: 'Car Model' },
        { id: 'vin', title: 'VIN' },
        { id: 'manufacturedDate', title: 'Manufactured Date' },
      ],
    });

    //write values using csvWriter
    await csvWriter.writeRecords(formattedVehicles);

    return {
      message: 'Vehicles exported successfully',
      path: filePath,
    };
  }

}
