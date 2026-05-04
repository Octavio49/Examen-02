import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsDate, IsDateString, IsNumber } from "class-validator"

export class CreateBookLoanDto {

    @ApiProperty({ example: [1, 2, 3] })
    @IsArray()
    @IsNumber({}, { each: true })
    bookIds!: number[]

    @ApiProperty({example:"2000-03-24", description:"Issue date, format:YYYY-MM-DD"})
    @IsDateString()
    issue_date!:Date

    @ApiProperty({example:'2000-05-24', description:"Due date, format:YYYY-MM-DD"})
    @IsDateString()
    due_date!:Date

    @ApiProperty({example:'2000-04-24', description:"Return date, format:YYYY-MM-DD"})
    @IsDateString()
    return_date!:Date


}
