import { ApiProperty } from "@nestjs/swagger";
import { Book } from "src/book/entities/book.entity";
import { Member } from "src/member/entities/member.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BookLoan {

    @ApiProperty({ type: () => Member })
    @ManyToOne(() => Member, member => member.bookLoans)
    member!: Member

    @ApiProperty({ type: () => Book, isArray: true })
    @ManyToMany(() => Book)
    @JoinTable()
    books!: Book[]

    @ApiProperty({example:2, description:"Book loan ID"})
    @PrimaryGeneratedColumn()
    loan_id!:number

    @ApiProperty({example:"2000-03-24", description:"Issue date, format:YYYY-MM-DD"})
    @Column({type:Date})
    issue_date!:Date

    @ApiProperty({example:'2000-05-24', description:"Due date, format:YYYY-MM-DD"})
    @Column({type:Date})
    due_date!:Date

    @ApiProperty({example:'2000-04-24', description:"Return date, format:YYYY-MM-DD"})
    @Column({type:Date})
    return_date!:Date
}
