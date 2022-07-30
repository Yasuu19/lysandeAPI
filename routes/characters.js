import express from 'express';
import {
  createCharacter, updateCharacters, deleteCharacter, getAllCharacters, getCharacterById,
} from '../controllers/characters.js';

const router = express.Router();

router.post('/', createCharacter);
router.put('/', updateCharacters);
router.delete('/:id', deleteCharacter);
router.get('/', getAllCharacters);
router.get('/:id', getCharacterById);

export default router;
