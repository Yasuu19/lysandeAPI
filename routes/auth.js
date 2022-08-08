import express from 'express';

import {
  signup, login,
} from '../controllers/auth.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', auth, signup);
router.post('/login', login);

export default router;
