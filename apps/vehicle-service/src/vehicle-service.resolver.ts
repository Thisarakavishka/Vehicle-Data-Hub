import { CreateVehicleInput } from './dto/create-vehicle.input';
import { InitialVehiclePage } from './dto/initial-vehicles.page';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleService } from './vehicle-service.service';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => Vehicle)
export class VehicleServiceResolver {
  constructor(private readonly vehicleService: VehicleService) { }

  //health Check endpoint -  Vehicle-service
  @Query(() => String, { name: 'vehicleServiceHealthCheck' })
  vehicleServiceHealthCheck(): string {
    return "Vehicle Service Health Check: OK";
  }

  //Create vehicle endpoint -  Vehicle-service
  @Mutation(() => Vehicle)
  createVehicle(@Args('createVehicle') createVehicleInput: CreateVehicleInput) {
    return this.vehicleService.create(createVehicleInput);
  }

  //Pagination endpoint -  Vehicle-service
  @Query(() => [Vehicle], { name: 'vehicles' })
  findAll(
    @Args('page', { type: () => Number, nullable: true }) page: number = 1,
    @Args('limit', { type: () => Number, nullable: true }) limit: number = 100,
  ) {
    return this.vehicleService.findAll({ page, limit });
  }

  //Select only one vehicle endpoint -  Vehicle-service
  @Query(() => Vehicle, { name: 'vehicle' })
  findOne(@Args('id', { type: () => Number }) id: number) {
    return this.vehicleService.findOne(id);
  }

  //Update vehicle endpoint -  Vehicle-service
  @Mutation(() => Vehicle)
  updateVehicle(@Args('updateVehicle') updateVehicleInput: UpdateVehicleInput) {
    return this.vehicleService.update(updateVehicleInput.id, updateVehicleInput);
  }

  //Remove/Delete vehicle endpoint -  Vehicle-service
  @Mutation(() => Boolean)
  removeVehicle(@Args('id', { type: () => Int }) id: number) {
    return this.vehicleService.remove(id);
  }

  //Wild Cart serach endpoint -  Vehicle-service
  @Query(() => [Vehicle], { name: 'searchVehicles' })
  search(@Args('modal', { type: () => String }) modal: string) {
    return this.vehicleService.search(modal);
  }

  //After Insertion, get 100 vehicles & page count  endpoint -  Vehicle-service
  @Query(() => InitialVehiclePage, { name: 'initialFetch' })
  async initialFetch(): Promise<InitialVehiclePage> {
    console.log("Hit on Initial Vehicle Page")
    const { vehicles, pageCount } = await this.vehicleService.initialFetchAndPageCount();
    return { vehicles, pageCount };
  }
  
}
