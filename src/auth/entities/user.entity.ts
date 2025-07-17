import { Product } from "src/productos";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    idUser:string;

    @Column('text',{ unique:true })
    email:string;

    @Column('text', { unique:true, select:false })
    password:string;

    @Column('text', { unique:true })
    fullName:string;

    @Column('bool', { default : true })
    isActive:boolean;

    @Column('text', { array:true, default: ['user'] })
    roles:string[];

    @OneToMany(
        () => Product,
        (product) => product.user,
    )
    product:Product;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }
    
    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.email = this.email.toLowerCase().trim();
    }


}
