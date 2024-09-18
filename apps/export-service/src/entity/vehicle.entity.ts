import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('vehicle')
export class Vehicle {

  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  carMake: string;

  @Column()
  @Field()
  carModel: string;

  @Column()
  @Field()
  vin: string;

  @Column()
  @Field()
  manufacturedDate: Date;

  @Column()
  @Field()
  ageOfVehicle: number;
}
