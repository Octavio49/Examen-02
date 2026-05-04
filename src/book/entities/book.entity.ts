import { ApiProperty } from "@nestjs/swagger";
import { BookLoan } from "src/book-loan/entities/book-loan.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Book {

    @ManyToMany(() => BookLoan, bookLoan => bookLoan.books)
    bookLoans!: BookLoan[]

    @ApiProperty({example:3, description:"Book's ID"})
    @PrimaryGeneratedColumn()
    book_id!:number

    @ApiProperty({example:"978-3-16-148410-0", description:"Book's ISBN, 13 digits, including hyphens"})
    @Column({unique:true})
    isbn!:string

    @ApiProperty({example:"El principito", description:"Book's name"})
    @Column()
    book_name!:string

    @ApiProperty({example:"Guillermo", description:"Book's author"})
    @Column()
    author_name!:string

    @ApiProperty({example:"2nd edition", description:"Book's edition"})
    @Column()
    edition!:string

    @ApiProperty({example:3, description:"Copy of the book"})
    @Column()
    library_copy_n!:number

    @ApiProperty({example:299, description:"Book's price"})
    @Column()
    price!:number
}
