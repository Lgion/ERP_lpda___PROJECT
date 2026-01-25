import { Model, Document, Types } from 'mongoose';

export interface IStockMovement extends Document {
    productId: Types.ObjectId;
    previousStock: number;
    newStock: number;
    delta: number;
    type: 'manual_adjustment' | 'sale' | 'arrival' | 'initial';
    reason?: string;
    createdAt: Date;
    updatedAt: Date;
}

declare const StockMovement: Model<IStockMovement>;
export default StockMovement;
