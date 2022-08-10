import express from 'express';
import auth from '../middlewares/auth.js';

import {
  getAvailabilities, updateAvailability,
} from '../controllers/availabilities.js';

const router = express.Router();

router.put('/', auth, updateAvailability);
router.get('/', auth, getAvailabilities);

export default router;
