import { NextFunction, Request, Response } from "express";
import { getPostById } from "../services/postsServices";
import { ServerError } from "./errorHandler";
import { getAccessTokenPayLoad } from "../services/tokenServices";

const checkIsThePostOwner = async (req: Request, _res: Response, next: NextFunction) => {
  try{
    const { id } = req.params
    
    const accessToken = req.headers.authorization?.split(' ')[1]

    const decoded = getAccessTokenPayLoad(accessToken as string)

    const { session } = decoded
    
    const postData = await getPostById(id)

    if(session.role === 'ADMIN') return next()

    if(postData?.authorId !== session.userId) throw new ServerError(403, 'Forbidden', 'You are not the owner of this post', undefined, 'You are not the owner of this post')

    next()

  }catch(error){
    next(error)
  }
}

export default checkIsThePostOwner