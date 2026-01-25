import { Model, Document } from 'mongoose';

export interface ISupplier extends Document {
    name: string;
    contact?: string;
    phone?: string;
    email?: string;
    city?: string;
    createdAt: Date;
    updatedAt: Date;
}

declare const Supplier: Model<ISupplier>;
export default Supplier;
