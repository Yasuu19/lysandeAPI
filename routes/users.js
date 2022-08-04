import express from 'express';
// eslint-disable-next-line import/no-named-as-default
import auth from '../middlewares/auth.js';

import {
  getUser, getAllUsers, getUserCharacters,
} from '../controllers/users.js';

const router = express.Router();

router.get('/:id/characters', auth, getUserCharacters);
router.get('/:id', auth, getUser);
router.get('/', auth, getAllUsers);

export default router;
