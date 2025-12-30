import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.models.GestomagSupplier || mongoose.model('GestomagSupplier', supplierSchema);
