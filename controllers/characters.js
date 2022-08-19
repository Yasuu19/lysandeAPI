/* eslint-disable no-await-in-loop */
import Character from '../models/character.js';

const isPlayerCharacter = async (playerId, characterId) => {
  const characterFromDB = await Character.findOne({ _id: characterId });
  return characterFromDB.player === playerId;
};

const FormatPositionForSending = (character) => {
  if (
    (character.x || character.x === 0)
        && (character.y || character.y === 0)
        && (character.group || character.group === 0)
        && character.map) {
    return ({
      coordinates: {
        x: character.x,
        y: character.y,
      },
      map: character.map,
      group: character.group,
    });
  }
  return undefined;
};

const formatRequestPosition = (data) => {
  if (data.positions === null) {
    return ({
      x: null,
      y: null,
      map: null,
      group: null,
    });
  }
  if (data.positions
        && data.positions.coordinates
        && (data.positions.coordinates.x || data.positions.coordinates.x === 0)
        && (data.positions.coordinates.y || data.positions.coordinates.y === 0)
        && data.positions.map
        && (data.positions.group || data.positions.group === 0)
  ) {
    return ({
      x: data.positions.coordinates.x,
      y: data.positions.coordinates.y,
      map: data.positions.map,
      group: data.positions.group,
    });
  }
  return {};
};

export const formatSending = (character) => ({
  id: character._id,
  player: character.player,
  name: character.name,
  race: character.race,
  job: character.job,
  level: character.level,
  img: character.img,
  culte: character.culte ? character.culte : undefined,
  positions: FormatPositionForSending(character),
  quest: character.quest,
  story: character.story,
  alignment: {
    moral: character.moral,
    law: character.law,
  },
  gold: character.gold,
});

const formatRequest = (data) => ({
  id: data.id,
  player: data.player,
  name: data.name,
  race: data.race,
  job: data.job,
  level: data.level,
  img: 'https://nnsprod.com/naheulbeuk/images/gob.png',
  culte: data.culte,
  ...formatRequestPosition(data),
  quest: data.quest,
  story: data.story,
  moral: data.alignment ? data.alignment.moral : null,
  law: data.alignment ? data.alignment.law : null,
  gold: data.gold,
});

export async function createCharacter(req, res) {
  if (Object.keys(req.body).length) {
    const character = new Character(formatRequest({ ...req.body, player: req.auth.userId }));
    try {
      const newCharacter = await character.save();
      res.status(201).json(formatSending(newCharacter));
    } catch (err) {
      res.status(400).json(`Error when creating a new character ${err}`);
    }
  } else {
    res.status(400).json('Body is required');
  }
}

export async function updateCharacters(req, res) {
  if (req.body.length) {
    if (
      req.auth.role === 'admin'
      || req.auth.role === 'gm'
      || !(req.body.some((character) => !isPlayerCharacter(req.auth.userId, character.id)))
    ) {
      const newCharacters = [];
      let error = '';
      for (let i = 0; i < req.body.length; i++) {
        const requestCharacter = formatRequest(req.body[i]);
        if (requestCharacter.id) {
          try {
            await Character.updateOne({ _id: requestCharacter.id }, requestCharacter);
            newCharacters.push(
              formatSending(await Character.findOne({ _id: requestCharacter.id })),
            );
          } catch (err) {
            error = err;
            break;
          }
        } else {
          error = 'Id is required';
          break;
        }
      }
      if (error) {
        res.status(500).json(`${error}`);
      } else {
        res.status(200).json(formatSending(newCharacters));
      }
    } else {
      res.status(403).json('Unauthorized access');
    }
  } else {
    res.status(400).json('Body requires an array');
  }
}

export async function deleteCharacter(req, res) {
  if (
    req.auth.role === 'admin'
    || req.auth.role === 'gm'
    || isPlayerCharacter(req.auth.userId, req.params.id)
  ) {
    try {
      await Character.deleteOne({ _id: req.params.id });
      res.status(200).json(undefined);
    } catch (err) {
      res.status(500).json({ err });
    }
  } else {
    res.status(403).json('Unauthorized request');
  }
}

export const getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.find({});
    res.status(200).json(characters.map((el) => formatSending(el)));
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};

export const getCharacterById = async (req, res) => {
  try {
    const character = await Character.findOne({ _id: req.params.id });
    res.status(200).json(character ? formatSending(character) : undefined);
  } catch (err) {
    res.status(404).json(`${err}`);
  }
};

export const getUserIdByCharacterId = async (characterId) => {
  try {
    const character = await Character.findOne({ _id: characterId });
    return character.player;
  } catch (error) {
    return { err: error };
  }
};

export const getCharactersByUser = async (userId) => {
  try {
    const characters = await Character.find({ player: userId });
    return (characters.map((el) => formatSending(el)));
  } catch (err) {
    return err;
  }
};
