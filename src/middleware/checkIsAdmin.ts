import { NextFunction, Request, Response } from "express";
import { getPostById } from "../services/postsServices";
import { ServerError } from "./errorHandler";
import { getAccessTokenPayLoad } from "../services/tokenServices";

const checkIsAdmin = async (req: Request, _res: Response, next: NextFunction) => {
  try{
    
    const accessToken = req.headers.authorization?.split(' ')[1]

    const decoded = getAccessTokenPayLoad(accessToken as string)

    const { session } = decoded
    
    if(session.role !== 'ADMIN') throw new ServerError(403, 'Forbidden', 'You are not an admin', undefined, 'You are not an admin')

    next()

  }catch(error){
    next(error)
  }
}

export default checkIsAdmin