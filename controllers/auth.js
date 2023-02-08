/* eslint-disable no-await-in-loop */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();
const secretTokenKey = process.env.SECRET_TOKEN_KEY || 'BETTERCALLSAUL';

export async function signup(req, res) {
  if (req.auth.role === 'admin') {
    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      try {
        const user = new User({
          email: req.body.email,
          name: req.body.name,
          role: req.body.role,
          password: hash,
        });
        await user.save();
        const { email, name, role } = user;
        res.status(201).json({ email, name, role });
      } catch (err) {
        res.status(400).json(err);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('Unauthorized');
  }
}
export async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      res.status(401).json({ message: 'Incorrect login or password' });
    } else {
      const valid = await bcrypt.compare(req.body.password, user.password);
      if (valid) {
        res.status(200).json({
          token: jwt.sign(
            {
              userId: user._id,
              role: user.role,
            },
            secretTokenKey,
            { expiresIn: '24h' },
          ),
        });
      } else {
        res.status(401).json({ message: 'Incorrect login or password' });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
