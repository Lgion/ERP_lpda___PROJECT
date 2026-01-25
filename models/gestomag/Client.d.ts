import { Model, Document } from 'mongoose';

export interface IClient extends Document {
    name: string;
    type: 'particulier' | 'professionnel' | 'association';
    phone?: string;
    city?: string;
    createdAt: Date;
    updatedAt: Date;
}

declare const Client: Model<IClient>;
export default Client;
