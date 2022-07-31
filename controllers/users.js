/* eslint-disable no-await-in-loop */
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export async function signup(req, res) {
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
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
export async function login(req, res) {
  try {
    User.findOne({ email: req.body.email });
  } catch (err) {
    res.status(500).json({ err });
  }
}
