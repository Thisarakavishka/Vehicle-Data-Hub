import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { Vehicle } from './entities/vehicle.entity';
import { Like, Repository } from 'typeorm';
import { UpdateVehicleInput } from './dto/update-vehicle.input';

@Injectable()
export class VehicleService {

  constructor(@InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,) { }

  async create(createVehicleInput: CreateVehicleInput): Promise<Vehicle> {
    const { manufacturedDate } = createVehicleInput;
    const ageOfVehicle = new Date().getFullYear() - new Date(manufacturedDate).getFullYear();
    const vehicle = this.vehicleRepository.create({ ...createVehicleInput, ageOfVehicle });
    return this.vehicleRepository.save(vehicle);
  }

  async findAll({ page, limit }: { page: number, limit: number }): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      order: { manufacturedDate: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findOne(id: number): Promise<Vehicle> {
    return this.vehicleRepository.findOneBy({ id });
  }

  async update(id: number, updateVehicleInput: UpdateVehicleInput): Promise<Vehicle> {
    if (updateVehicleInput.manufacturedDate) {
      const { manufacturedDate } = updateVehicleInput;
      const ageOfVehicle = new Date().getFullYear() - new Date(manufacturedDate).getFullYear();
      await this.vehicleRepository.update(id, { ...updateVehicleInput, ageOfVehicle })
    } else {
      await this.vehicleRepository.update(id, updateVehicleInput);
    }
    return this.vehicleRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<boolean> {
    await this.vehicleRepository.delete(id);
    return true;
  }

  async search(model: string): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { carModel: Like(`${model}%`) },
    });
  }

  async initialFetchAndPageCount(): Promise<{ vehicles: Vehicle[]; pageCount: number; }> {
    const vehicles = await this.vehicleRepository.find({
      order: { id: 'ASC' },
      take: 100,
    });

    const totalRows = await this.vehicleRepository.count(); // 
    const pageCount = Math.ceil(totalRows / 100);

    console.log(vehicles)
    console.log(pageCount);

    return { vehicles, pageCount }
  }


}
