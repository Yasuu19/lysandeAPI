import Session from '../models/Session.js';
import CharacterOfSession from '../models/CharacterOfSession.js';

const formatReq = (req) => ({
  date: req.body.date,
  moment: req.body.moment,
  platform: req.body.platform,
  gm: req.auth.userId,
});

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

export const getCharactersOfSession = async (sessionId) => {
  const characters = [];
  const charactersOfSession = await Session.findOne({ session: sessionId });
  charactersOfSession.forEach(async (el) => {
    const character = await Session.findOne({ _id: el.character });
    characters.push(character);
  });
  return characters;
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
        res.status(201).json({ session });
      } catch (err) {
        res.status(400).json(err);
      }
    } else res.status(400).json({ err: 'Wrong format' });
  }
};

export const getSession = async (req, res) => {
  console.log(res, req);
  try {
    // const character = await Session.findOne({ _id: req.params.id });
  } catch (err) {
    // res.status(404).json(`${err}`);
  }
};

export const getSessions = async (req, res) => {
  if (
    req.auth.role === 'admin'
    || req.auth.role === 'gm'
  ) {
    const session = await Session.find({});
    res.status(200).json(session);
  } else res.status(501).json({ err: 'Unauthorized' });
};

export const updateSessions = () => {

};
