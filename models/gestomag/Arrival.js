import mongoose from 'mongoose';

const arrivalLineSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GestomagProduct',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  }
});

const arrivalSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  reference: {
    type: String,
    default: null
  },
  totalAmount: {
    type: Number,
    required: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GestomagSupplier',
    required: true
  },
  lines: [arrivalLineSchema]
}, {
  timestamps: true
});

export default mongoose.models.GestomagArrival || mongoose.model('GestomagArrival', arrivalSchema);
