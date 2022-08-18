import express from 'express';
import auth from '../middlewares/auth.js';

import {
  getSessions, createSession,
} from '../controllers/session.js';

const router = express.Router();

router.post('/', auth, createSession);
router.get('/', auth, getSessions);

export default router;
