import { ApiProperty } from "@nestjs/swagger";
import { Method } from "src/enum/method";
import { Member } from "src/member/entities/member.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment {

    @ApiProperty({ type: () => Member })
    @ManyToOne(() => Member, member => member.payments)
    member!: Member

    @ApiProperty({example:2, description:"Payment ID"})
    @PrimaryGeneratedColumn()
    payment_id!:number

    @ApiProperty({example:"Payment for red book on may 27", description:"The description of the payment"})
    @Column()
    description!:string

    @ApiProperty({example:200, description:"Total amount of payment"})
    @Column()
    amount!:number

    @ApiProperty({example:"CREDIT_CARD", enum:Method, description:"payment method"})
    @Column({type:'enum', enum:Method})
    method!:Method

    @ApiProperty({ example:'2000-03-24', description:"Date of payment, format:YYYY-MM-DD" })
    @Column({type:Date})
    date!:Date

}
