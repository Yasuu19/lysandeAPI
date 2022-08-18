import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  moment: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  gm: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Session', sessionSchema);
