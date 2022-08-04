import express from 'express';
// eslint-disable-next-line import/no-named-as-default
import auth from '../middlewares/auth.js';

import {
  createCharacter, updateCharacters, deleteCharacter, getAllCharacters, getCharacterById,
} from '../controllers/characters.js';

const router = express.Router();

router.post('/', auth, createCharacter);
router.put('/', auth, updateCharacters);
router.delete('/:id', auth, deleteCharacter);
router.get('/', auth, getAllCharacters);
router.get('/:id', auth, getCharacterById);

export default router;
