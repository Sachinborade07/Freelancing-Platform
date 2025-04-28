import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export class CreateFreelancerSkillDto {
    @IsNotEmpty()
    @IsNumber()
    freelancer_id: number;

    @IsNotEmpty()
    @IsNumber()
    skill_id: number;

    @IsNotEmpty()
    @IsString()
    @IsIn(['beginner', 'intermediate', 'expert'])
    proficiency_level: string;
}