import { IsNotEmpty, IsNumber, IsString, IsDecimal, Min } from 'class-validator';
import { IsValidProjectStatus } from 'src/validator/project-status.validator';


export class CreateBidDto {
    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    @IsNotEmpty()
    @IsNumber()
    freelancer_id: number;

    @IsNotEmpty()
    @IsDecimal()
    bid_amount: string;

    @IsNotEmpty()
    @IsString()
    proposal: string;

    @IsNotEmpty()
    @IsString()
    @IsValidProjectStatus(['submitted'])
    status: string;
}