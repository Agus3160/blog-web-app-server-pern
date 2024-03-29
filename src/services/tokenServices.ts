import jwt,{JsonWebTokenError, JwtPayload, TokenExpiredError} from 'jsonwebtoken';
import { SessionPayload } from '../../type';
import { ServerError } from '../middleware/errorHandler';

interface CustomPayLoad extends JwtPayload {
  session: SessionPayload
}

interface ResetPassPayload extends JwtPayload {
  userId: string
}

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!
const JWT_ACCESS_TOKEN_TTL = parseInt(process.env.JWT_ACCESS_TOKEN_TTL!)

const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN!
const JWT_REFRESH_TOKEN_TTL = parseInt(process.env.JWT_REFRESH_TOKEN_TTL!)

const JWT_RESET_PASSWORD_TTL = parseInt(process.env.JWT_RESET_PASSWORD_TTL!)

const generateAccessToken = (session: SessionPayload) => {
  return jwt.sign({ session }, JWT_ACCESS_TOKEN, {
    expiresIn: JWT_ACCESS_TOKEN_TTL,
  })
}

const generateRefreshToken = (session: SessionPayload) => {
  return jwt.sign({ session }, JWT_REFRESH_TOKEN, {
    expiresIn: JWT_REFRESH_TOKEN_TTL,
  })
}

const getRefreshTokenPayLoad = (refreshToken: string) => {
  try{
    const payload = jwt.verify(refreshToken, JWT_REFRESH_TOKEN) as CustomPayLoad
    return payload
  }catch(error){
    if(error instanceof JsonWebTokenError) throw new ServerError(401, error.name, error.message, undefined, "Invalid Credentials")
    throw error
  }
}

const getAccessTokenPayLoad = (accessToken: string) => {
  try{
    const payload = jwt.verify(accessToken, JWT_ACCESS_TOKEN) as CustomPayLoad
    return payload
  }catch(error){
    if(error instanceof TokenExpiredError) throw new ServerError(403, error.name, error.message, undefined, "Access Token has expired")
    if(error instanceof JsonWebTokenError) throw new ServerError(500, error.name, error.message, undefined, "Invalid Credentials")
    throw error
  }
}

const generateResetToken = (userId: string) => {
  try{
    return jwt.sign({ userId }, JWT_ACCESS_TOKEN, {
      expiresIn: JWT_RESET_PASSWORD_TTL,
    })
  }catch(error){
    throw error
  }
}

const getResetTokenPayLoad = (resetToken: string) => {
  try{
    const payload = jwt.verify(resetToken, JWT_ACCESS_TOKEN) as ResetPassPayload
    return payload
  }catch(error){
    if(error instanceof JsonWebTokenError) throw new ServerError(401, error.name, error.message, undefined, "This link has expired")
    throw error
  }
}

export { generateAccessToken, generateRefreshToken, getRefreshTokenPayLoad, getAccessTokenPayLoad, getResetTokenPayLoad, generateResetToken }