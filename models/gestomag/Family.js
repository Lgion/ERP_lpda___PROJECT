import mongoose from 'mongoose';

const familySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.models.GestomagFamily || mongoose.model('GestomagFamily', familySchema);
