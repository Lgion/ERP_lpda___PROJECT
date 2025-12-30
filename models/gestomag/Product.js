import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  ref: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  minStock: {
    type: Number,
    default: 0
  },
  vat: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'out_of_stock'],
    default: 'available'
  },
  image: {
    type: String,
    default: null
  },
  cloudinaryId: {
    type: String,
    default: null
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GestomagFamily',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.GestomagProduct || mongoose.model('GestomagProduct', productSchema);
