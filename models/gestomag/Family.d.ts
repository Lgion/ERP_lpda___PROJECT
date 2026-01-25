import { Model, Document } from 'mongoose';

export interface IFamily extends Document {
    code: string;
    label: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

declare const Family: Model<IFamily>;
export default Family;
