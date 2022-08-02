import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretTokenKey = process.env.SECRET_TOKEN_KEY || 'BETTERCALLSAUL';

export default async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, secretTokenKey);
    const { userId } = decodedToken;
    req.auth = {
      userId,
    };
    next();
  } catch (err) {
    res.status(401).json(err);
  }
}
