import User from '../models/User.js';
import Availabity from '../models/Availabity.js';
import { supressPastDate, formatAvailibilityOfResponse } from './availabilities.js';
import { getCharactersByUser } from './characters.js';

const formatUser = (data, role) => {
  if (role === 'admin') {
    return {
      id: data._id,
      email: data.email,
      name: data.name,
      role: data.role,
    };
  }
  return {
    id: data._id,
    name: data.name,
    role: data.role,
  };
};

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
    req.auth.role
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
      const character = await getCharactersByUser(req.params.id);
      if (character.err) throw new Error(character.err);
      res.status(200).json(character);
    } catch (err) {
      res.status(403).json(err);
    }
  } else {
    res.status(403).json('Unauthorized request');
  }
}

export const getAvailabilities = async (req, res) => {
  try {
    let availabilities = await Availabity.find({ user: req.auth.userId });
    const error = await supressPastDate(availabilities);
    if (error) {
      res.status(500).json(error);
    } else {
      availabilities = await Availabity.find({ user: req.auth.userId });
      res.status(200).json(availabilities.map((el) => formatAvailibilityOfResponse(el)));
    }
  } catch (err) {
    res.status(404).json(`${err}`);
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.auth.role !== 'admin') throw new Error('Unauthorized');
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json(1);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteUserAvailabilities = async (req, res) => {
  try {
    if (req.auth.role !== 'admin') throw new Error('Unauthorized');
    await Availabity.deleteMany({ user: req.params.id });
    res.status(200).json(1);
  } catch (err) {
    res.status(500).json(err);
  }
};
