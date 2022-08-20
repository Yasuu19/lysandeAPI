import express from 'express';
import auth from '../middlewares/auth.js';

import {
  getSessions, createSession, getSession, updateSession,
} from '../controllers/session.js';

const router = express.Router();

router.post('/', auth, createSession);
router.get('/', auth, getSessions);
router.get('/:id', auth, getSession);
router.put('/:id', auth, updateSession);

export default router;
