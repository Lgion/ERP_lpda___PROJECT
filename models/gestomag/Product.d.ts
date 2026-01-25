import { Model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
    ref: string;
    name: string;
    price: number;
    stock: number;
    minStock: number;
    vat: number;
    status: 'available' | 'out_of_stock';
    image?: string;
    cloudinaryId?: string;
    familyId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

declare const Product: Model<IProduct>;
export default Product;
