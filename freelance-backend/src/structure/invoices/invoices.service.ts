import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoices.dto';
import { Milestone } from 'src/entities/milestone.entity';

@Injectable()
export class InvoicesService {
    constructor(
        @InjectRepository(Invoice)
        private invoicesRepository: Repository<Invoice>,
        @InjectRepository(Milestone)
        private milestonesRepository: Repository<Milestone>,
    ) { }

    async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
        const milestone = await this.milestonesRepository.findOne({
            where: { milestone_id: createInvoiceDto.milestone_id },
        });
        if (!milestone) {
            throw new NotFoundException('Milestone not found');
        }

        const invoice = this.invoicesRepository.create({
            ...createInvoiceDto,
            milestone,
            amount: Number(createInvoiceDto.amount),
        });
        return await this.invoicesRepository.save(invoice);
    }

    async findAll(): Promise<Invoice[]> {
        return await this.invoicesRepository.find({ relations: ['milestone'] });
    }

    async findByMilestone(milestoneId: number): Promise<Invoice> {
        const invoice = await this.invoicesRepository.findOne({
            where: { milestone_id: milestoneId },
            relations: ['milestone'],
        });
        if (!invoice) {
            throw new NotFoundException(`Invoice for milestone ${milestoneId} not found`);
        }
        return invoice;
    }

    async findOne(id: number): Promise<Invoice> {
        const invoice = await this.invoicesRepository.findOne({
            where: { invoice_id: id },
            relations: ['milestone'],
        });
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }

    async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
        const invoice = await this.findOne(id);
        this.invoicesRepository.merge(invoice, {
            ...updateInvoiceDto,
            amount: updateInvoiceDto.amount ? Number(updateInvoiceDto.amount) : undefined,
        });
        return await this.invoicesRepository.save(invoice);
    }

    async updateStatus(id: number, status: string): Promise<Invoice> {
        const invoice = await this.findOne(id);
        invoice.status = status;
        if (status === 'paid') {
            invoice.paid_at = new Date();
        }
        return await this.invoicesRepository.save(invoice);
    }

    async remove(id: number): Promise<void> {
        const result = await this.invoicesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }
    }
}