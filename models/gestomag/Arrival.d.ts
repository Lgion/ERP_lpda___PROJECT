import { Model, Document, Types } from 'mongoose';

export interface IArrival extends Document {
    date: Date;
    reference?: string;
    totalAmount: number;
    supplierId: Types.ObjectId;
    lines: Array<{
        productId: Types.ObjectId;
        quantity: number;
        unitPrice: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

declare const Arrival: Model<IArrival>;
export default Arrival;
