export class CreateTicketDto {
    number?: number;
    subject: string;
    due_date?: Date;
    start_date?: Date;
    end_date?: Date;
    resoved_date?: Date;
    status?: string;
    priorityId?: number;
    customerId: number;
    technicianId?: number; 
    comment?: string;
}
