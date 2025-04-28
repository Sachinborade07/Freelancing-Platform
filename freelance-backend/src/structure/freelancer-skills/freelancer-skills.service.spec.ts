import { Test, TestingModule } from '@nestjs/testing';
import { FreelancerSkillsService } from './freelancer-skills.service';

describe('FreelancerSkillsService', () => {
  let service: FreelancerSkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreelancerSkillsService],
    }).compile();

    service = module.get<FreelancerSkillsService>(FreelancerSkillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
