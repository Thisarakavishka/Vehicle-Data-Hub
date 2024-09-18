import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('vehicle')
export class VehicleEntity{
    
    @PrimaryGeneratedColumn()
    id:string;

    @Column()
    firstName:string;
    
    @Column()
    lastName:string;
    
    @Column()
    email:string;

    @Column()
    carMake:string;

    @Column()
    carModel:string;

    @Column()
    vin:string;

    @Column({type:'date'})
    manufacturedDate:Date;

    @Column()
    ageOfVehicle:string;
}