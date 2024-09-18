import { Field, ObjectType } from "@nestjs/graphql";
import { Vehicle } from "../entities/vehicle.entity";

@ObjectType()
export class InitialVehiclePage {

    @Field(() => [Vehicle])
    vehicles: Vehicle[];

    @Field()
    pageCount: number;
}