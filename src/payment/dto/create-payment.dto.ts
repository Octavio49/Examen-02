import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEnum, IsNumber, IsString } from "class-validator";
import { Method } from "src/enum/method";

export class CreatePaymentDto {

    @ApiProperty({example:"Payment for red book on may 27", description:"The description of the payment"})
    @IsString()
    description!:string

    @ApiProperty({example:200, description:"Total amount of payment"})
    @IsNumber()
    amount!:number

    @ApiProperty({example:"CREDIT_CARD", enum:Method, description:"payment method"})
    @IsEnum(Method)
    method!:Method

    @ApiProperty({example:"2000-03-24", description:"Payment date"})
    @IsDateString()
    date!:Date
}
