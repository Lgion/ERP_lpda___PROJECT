import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['particulier', 'professionnel', 'association'],
    default: 'particulier'
  },
  phone: {
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

export default mongoose.models.GestomagClient || mongoose.model('GestomagClient', clientSchema);
