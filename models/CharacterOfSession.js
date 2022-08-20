import mongoose from 'mongoose';

const CharacterOfSessionSchema = new mongoose.Schema({
  session: {
    type: String,
    required: true,
  },
  character: {
    type: String,
    required: true,
  },
});

export default mongoose.model('CharacterOfSession', CharacterOfSessionSchema);
