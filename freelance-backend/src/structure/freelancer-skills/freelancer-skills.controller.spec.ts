import { Test, TestingModule } from '@nestjs/testing';
import { FreelancerSkillsController } from './freelancer-skills.controller';

describe('FreelancerSkillsController', () => {
  let controller: FreelancerSkillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreelancerSkillsController],
    }).compile();

    controller = module.get<FreelancerSkillsController>(FreelancerSkillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
