import { NextFunction, Request, Response } from "express";
import { ApiResponseScheme, LoginCredentials, RegisterCredentials, Session } from "../../type";
import { createUser, getUserByUsername } from "../services/authServices";
import { ServerError } from "../middleware/errorHandler";
import { saltAndHashPassword, comparePassword } from "../libs/bcryptLib";
import { generateAccessToken, generateRefreshToken, getRefreshTokenPayLoad } from "../services/tokenServices";
import { uploadImage } from "../services/firebaseServices";

const signUpController = async (req: Request, res: Response<ApiResponseScheme<undefined>>, next:NextFunction) => {
  try{
    const { username, email, password, image }:RegisterCredentials = req.body

    if(!username || !email || !password || !image) throw new ServerError(400, 'Bad Request', 'username, email and password are required', undefined, "Username, email and password are necesary")
    if(password.length < 8) throw new ServerError(400, 'Bad Request', 'password must be at least 8 characters long', undefined, "The min length of the password is 8 chars")

    const [imageUrl, path] = await uploadImage(image, 'profile-images')

    const cryptedPassword = await saltAndHashPassword(password)

    await createUser(username, email, cryptedPassword, imageUrl, path)

    res.status(200).json({
      success: true,
      message: 'user created successfully',
    })

  }catch(error){
    next(error)
  }
}

const loginController = async (req: Request, res: Response<ApiResponseScheme<Session>>, next:NextFunction) => {
  try{
    const { username, password }:LoginCredentials = req.body

    if(!username || !password) throw new ServerError(400, 'Bad Request', 'Username and Password are required', "Invalid Credentials")

    const user = await getUserByUsername(username)

    if(!user) throw new ServerError(400, 'Bad Request', 'User not found', undefined, "Invalid Credentials")

    const isPasswordValid = await comparePassword(password, user.password)

    if(!isPasswordValid) throw new ServerError(400, 'Bad Request', 'Incorrect Password', undefined, "Invalid Credentials")

    const sessionPayload = {userId:user.id, username:user.username, profileImage:user.imageUrl}

    const accessToken = generateAccessToken(sessionPayload)
    const refreshToken = generateRefreshToken(sessionPayload)

    res.cookie('refreshToken', refreshToken, { secure: true, sameSite: 'none', httpOnly: true, maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_TTL!) * 1000 })
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        profileImage: user.imageUrl,
        username: user.username,
        userId: user.id,
        accessToken: accessToken
      }
    })
  }catch(error){
    next(error)
  }  
}

const refreshAccessTokenController = async (req: Request, res: Response<ApiResponseScheme<Session>>, next:NextFunction) => {
  try{
    const refreshToken:string|null = req.cookies["refreshToken"]

    if(!refreshToken) throw new ServerError(401, 'Unauthorized', 'Refresh token is required', undefined, "Unauthorized")

    const payload = getRefreshTokenPayLoad(refreshToken)
    const newAccessToken = generateAccessToken(payload.session)

    res.status(200).json({
      success: true,
      message: 'token refreshed successfully',
      data: {
        username: payload.session.username,
        userId: payload.session.userId,
        accessToken: newAccessToken,
        profileImage: payload.session.profileImage
      }
    })

  }catch(error){
    next(error)
  }
}

const logOutController = async (req: Request, res: Response<ApiResponseScheme<undefined>>, next:NextFunction) => {
  try{
    res.clearCookie('refreshToken')
    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    })
  }catch(error){
    next(error)
  }
}


export { signUpController, loginController, refreshAccessTokenController, logOutController }
