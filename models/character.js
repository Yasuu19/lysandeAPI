// Librairie qui permet de se connecter à la BDD Mongo DB
import mongoose from 'mongoose';
// Same as table in NoSQL DB
const characterSchema = new mongoose.Schema({
  player: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  race: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: false,
  },
  level: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  culte: {
    type: String,
    required: false,
  },
  x: {
    type: Number,
    required: false,
  },
  y: {
    type: Number,
    required: false,
  },
  map: {
    type: String,
    required: false,
  },
  group: {
    type: Number,
    required: false,

  },
  quest: {
    type: Number,
    required: false,
  },
  story: {
    type: String,
    required: false,
  },
  moral: {
    type: String,
    required: true,
  },
  law: {
    type: String,
    required: true,
  },
  gold: {
    type: Number,
    required: true,
  },
});
// Character is the name of the table in DB
export default mongoose.model('Character', characterSchema);
