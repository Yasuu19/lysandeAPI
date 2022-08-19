/* eslint-disable no-await-in-loop */
import Session from '../models/Session.js';
import CharacterOfSession from '../models/CharacterOfSession.js';
import Character from '../models/character.js';
import { setSessionAvailability } from './availabilities.js';
import { getCharactersByUser } from './characters.js';

const formatReq = (req) => ({
  date: req.body.date,
  moment: req.body.moment,
  platform: req.body.platform,
  gm: req.auth.userId,
});

const getCharactersOfSession = async (sessionId) => {
  try {
    const sessionCharacters = await CharacterOfSession.find({ session: sessionId });
    const characters = [];
    for (let i = 0; i < sessionCharacters.length; i++) {
      const currentCharacter = await Character.findOne({ _id: sessionCharacters[i].character });
      characters.push(currentCharacter);
    }
    return characters;
  } catch (error) {
    return error;
  }
};

const saveCharactersOfSession = async (characters, sessionId) => {
  characters.forEach(async (el) => {
    if (el && sessionId) {
      const characterSession = new CharacterOfSession({
        character: el,
        session: sessionId,
      });
      await characterSession.save();
    }
  });
};

export const createSession = async (req, res) => {
  if (
    req.auth.role === 'admin'
        || req.auth.role === 'gm'
  ) {
    if (
      req.body.characters.length
    ) {
      const session = new Session(formatReq(req));
      try {
        const newSession = await session.save();
        saveCharactersOfSession(req.body.characters, newSession._id);
        const updateAvailabilityGM = await setSessionAvailability(
          req.body.date,
          req.body.moment,
          req.auth.userId,
        );
        if (updateAvailabilityGM !== 0) throw new Error(updateAvailabilityGM);
        req.body.characters.forEach(async (el) => {
          const updateAvailability = await setSessionAvailability(
            req.body.date,
            req.body.moment,
            el,
          );
          if (updateAvailability !== 0) throw new Error(updateAvailability);
        });
        res.status(201).json({ session });
      } catch (err) {
        res.status(500).json(err);
      }
    } else res.status(400).json({ err: 'Wrong format' });
  }
};

export const getSession = async (req, res) => {
  try {
    const playersCharacters = await getCharactersByUser();
    const session = await Session.findOne({ _id: req.params.id }).exec();
    const charactersOfSession = await getCharactersOfSession(req.params.id);
    const response = ({
      _id: session._id,
      platform: session.platform,
      moment: session.moment,
      dates: session.dates,
      characters: [...charactersOfSession],
    });
    const acces = (req.auth.role === 'admin'
    || response.some(
      (el) => el.gm === req.auth.userId
              || el.characters.some(
                (sessionCharacter) => playersCharacters.some(
                  (playersCharacter) => sessionCharacter.id === playersCharacter.id,
                ),
              ),
    ));
    if (acces) res.status(200).json(response);
    else res.status(403).json({ error: 'Unauthorized' });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSessions = async (req, res) => {
  try {
    const playersCharacters = await getCharactersByUser();
    const sessions = await Session.find({}).exec();
    const formatSessions = [];
    for (let i = 0; i < sessions.length; i++) {
      const sessionsId = sessions[i]._id.toHexString();
      const charactersOfSession = await getCharactersOfSession(sessionsId);
      formatSessions.push({
        id: sessions[i]._id,
        platform: sessions[i].platform,
        moment: sessions[i].moment,
        date: sessions[i].date,
        gm: sessions[i].gm,
        characters: [...charactersOfSession],
      });
    }
    res.status(200).json(
      req.auth.role === 'admin' ? formatSessions
        : formatSessions.filter(
          (el) => el.gm === req.auth.userId
                    || el.characters.some(
                      (sessionCharacter) => playersCharacters.some(
                        (playersCharacter) => sessionCharacter.id === playersCharacter.id,
                      ),
                    ),
        ),
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
