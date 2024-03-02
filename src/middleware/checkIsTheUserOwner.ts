import { NextFunction, Request, Response } from "express";
import { getPostById } from "../services/postsServices";
import { ServerError } from "./errorHandler";
import { getAccessTokenPayLoad } from "../services/tokenServices";
import { getUserByUsername } from "../services/authServices";

const checkIsTheUserOwner = async (req: Request, _res: Response, next: NextFunction) => {
  try{
    
    const accessToken = req.headers.authorization?.split(' ')[1]

    const decoded = getAccessTokenPayLoad(accessToken as string)

    const { session } = decoded
    
    const userData = await getUserByUsername(session.username)

    if(session.role === 'ADMIN') return next()

    if(userData?.id !== session.userId) throw new ServerError(403, 'Forbidden', 'You are not the owner of this User', undefined, 'You are not the owner of this User')

    next()

  }catch(error){
    next(error)
  }
}

export default checkIsTheUserOwner