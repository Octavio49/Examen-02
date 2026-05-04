
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { BookLoan } from "src/book-loan/entities/book-loan.entity";
import { Role } from "src/enum/role";
import { Payment } from "src/payment/entities/payment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Member {

    @OneToMany(() => Payment, payment => payment.member)
    payments!: Payment[]

    @OneToMany(() => BookLoan, bookLoan => bookLoan.member)
    bookLoans!: BookLoan[]

    @ApiProperty({ example: 3, description:"Member's ID" })
    @PrimaryGeneratedColumn()
    membership_id!:number

    @ApiProperty({ example: 'USER', enum: Role, description:"Member's role" })
    @Column({type: 'enum', enum: Role, default: Role.USER})
    role!:Role

    @ApiProperty({example:'Octavio De Avila', description:"Member's full name"})
    @Column()
    fullName!:string

    @ApiProperty({ example: 'OctavioD12i', description:"Member's username" })
    @Column({unique:true})
    username!:string
    
    @Exclude()
    @ApiHideProperty()
    @Column()
    password!:string

    @ApiProperty({ example:'2000-03-24', description:"Member's date of birth, format:YYYY-MM-DD" })
    @Column({type:'date', nullable:true})
    DOB!:Date

    @ApiProperty({ example:'Las Villas #12', description:"Member's address"})
    @Column({nullable:true})
    address!:string

    //Tomando en cuenta los requerimientos proporcionados, el registro y login se maneja con username
    //por lo tanto, email es un atributo mas
    @ApiProperty({ example:'Octavio@gmail.com', description:"Member's email"})
    @Column({nullable:true})
    email!:string

    @ApiProperty({ example:'4928745144', description:"Member's number"})
    @Column({nullable:true})
    contact_no!:string
}
