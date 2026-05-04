import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, Length, MinLength } from "class-validator"

export class CreateBookDto {

    @ApiProperty({example:"978-3-16-148410-0", description:"Book's ISBN, 13 digits, including hyphens"})
    @Length(17,17)
    @IsString()
    isbn!:string

    @ApiProperty({example:"El principito", description:"Book's name"})
    @IsString()
    book_name!:string

    @ApiProperty({example:"Guillermo", description:"Book's author"})
    @IsString()
    author_name!:string

    @ApiProperty({example:"2nd edition", description:"Book's edition"})
    @IsString()
    edition!:string

    @ApiProperty({example:3, description:"Copy of the book"})
    @IsNumber()
    library_copy_n!:number

    @ApiProperty({example:299, description:"Book's price"})
    @IsNumber()
    price!:number

}
