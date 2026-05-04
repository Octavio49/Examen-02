import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBookLoanDto } from './create-book-loan.dto';

export class UpdateBookLoanDto extends PartialType(OmitType(CreateBookLoanDto, ['bookIds'] as const)) {}
