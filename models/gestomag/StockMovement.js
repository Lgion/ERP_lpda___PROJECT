import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GestomagProduct',
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  delta: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['manual_adjustment', 'sale', 'arrival', 'initial'],
    default: 'manual_adjustment'
  },
  reason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.GestomagStockMovement || mongoose.model('GestomagStockMovement', stockMovementSchema);
