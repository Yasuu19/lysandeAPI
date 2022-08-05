import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
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
  user: {
    type: String,
    required: true,
  },

});

export default mongoose.model('Availability', availabilitySchema);
