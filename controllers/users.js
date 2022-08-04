import { formatSending } from './characters.js';
import Character from '../models/Character.js';
import User from '../models/User.js';

const formatUser = (data) => ({
  id: data._id,
  email: data.email,
  name: data.name,
  role: data.role,
});

export async function getUser(req, res) {
  if (
    req.auth.role === 'admin'
    || req.auth.role === 'gm'
    || req.params.id === req.auth.userId
  ) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      res.status(200).json(formatUser(user));
    } catch (err) {
      res.status(404).json(err);
    }
  } else {
    res.status(403).json('Unauthorized request');
  }
}

export async function getAllUsers(req, res) {
  if (
    req.auth.role === 'admin'
    || req.auth.role === 'gm'
  ) {
    try {
      const users = await User.find({});
      res.status(200).json(users.map((el) => formatUser(el)));
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('Unauthorized');
  }
}

export async function getUserCharacters(req, res) {
  if (
    req.auth.role === 'admin'
    || req.auth.role === 'gm'
    || req.params.id === req.auth.userId
  ) {
    try {
      const characters = await Character.find({ player: req.params.id });
      res.status(200).json(characters.map((el) => formatSending(el)));
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('Unauthorized request');
  }
}
