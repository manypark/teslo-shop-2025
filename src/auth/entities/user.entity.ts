import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    idUser:string;

    @Column('text',{ unique:true })
    email:string;

    @Column('text', { unique:true })
    password:string;

    @Column('text', { unique:true })
    fullName:string;

    @Column('bool', { default : true })
    isActive:boolean;

    @Column('text', { array:true, default: ['user'] })
    roles:string[];

}
