import { NextFunction, Request, Response } from "express"
import { ServerError } from "./errorHandler"
import { getAccessTokenPayLoad } from "../services/tokenServices"

const authAccessToken = async (req: Request, _res: Response, next: NextFunction) => {
  try{
    const accessToken = req.headers.authorization?.split(' ')[1]

    if(!accessToken) throw new ServerError(401, 'Unauthorized', 'access token is required', undefined, "Unauthorized")

    getAccessTokenPayLoad(accessToken)

    next()
  }catch(error){
    next(error)
  }
}

export default authAccessToken