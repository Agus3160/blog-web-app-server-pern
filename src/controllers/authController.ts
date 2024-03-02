import { NextFunction, Request, Response } from "express";
import { ApiResponseScheme, LoginCredentials, RegisterCredentials, Session } from "../../type";
import { createUser, getUserByUsername } from "../services/authServices";
import { ServerError } from "../middleware/errorHandler";
import { saltAndHashPassword, comparePassword } from "../libs/bcryptLib";
import { generateAccessToken, generateRefreshToken, generateResetToken, getRefreshTokenPayLoad, getResetTokenPayLoad } from "../services/tokenServices";
import { uploadImage } from "../services/firebaseServices";
import { getUserByEmail, getUserImageUrlById, updateUserPassword } from "../services/usersServices";
import { sendEmail } from "../services/mailService";
import { allowedOrigins } from "../libs/allowedOrigins";
import { Role } from "@prisma/client";

const signUpController = async (req: Request, res: Response<ApiResponseScheme>, next:NextFunction) => {
  try{
    const { username, email, password, image, role }:RegisterCredentials = req.body

    console.log(username, email, password, role)

    if(!username || !email || !password || !role ) throw new ServerError(400, 'Bad Request', 'username, email and password are required', undefined, "Username, email and password are necesary")

    if(password.length < 8) throw new ServerError(400, 'Bad Request', 'password must be at least 8 characters long', undefined, "The min length of the password is 8 chars")

    let imageUrl = null
    let path = null

    if(image){
      [imageUrl, path] = await uploadImage(image, 'profile-images')
    }

    const cryptedPassword = await saltAndHashPassword(password)

    await createUser(username, email, cryptedPassword, imageUrl, path, role as Role)

    res.status(200).json({
      success: true,
      message: 'User created successfully',
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

    const sessionPayload = {userId:user.id, username:user.username, role: user.role}

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
        accessToken: accessToken,
        role: user.role
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
    const currentImage = await getUserImageUrlById(payload.session.userId)

    if(currentImage === undefined) throw new ServerError(500, 'Internal Server Error', 'Error getting user image', undefined, "Error getting user image")

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {      
        username: payload.session.username,
        userId: payload.session.userId,
        profileImage: currentImage,
        accessToken: newAccessToken,
        role: payload.session.role
      }
    })

  }catch(error){
    next(error)
  }
}

const logOutController = async (_req: Request, res: Response<ApiResponseScheme<undefined>>, next:NextFunction) => {
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

const resetPasswordSendEmailController = async (req: Request, res: Response<ApiResponseScheme>, next:NextFunction) => {
  try{

    const { email }: {email: string|null} = req.body

    if(!email) throw new ServerError(400, 'Bad Request', 'Email is required', undefined, "Email is required")

    const user = await getUserByEmail(email)

    if(!user) throw new ServerError(400, 'Bad Request', 'User not found', undefined, "User not found")

    const resetToken = generateResetToken(user.id)

    const resetLink = `${allowedOrigins[0]}/reset-password/${resetToken}`

    const emailContent = `Hi ${user.username},\n\n You requested a password reset. Click the link below to reset your password:\n\n ${resetLink}`

    sendEmail(email, 'Password Reset', emailContent)
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
    })

    console.log('This user has requested a password reset: \n', user)

  }catch(error){
    next(error)
  }
}

const resetPasswordController = async (req: Request, res: Response<ApiResponseScheme>, next:NextFunction) => {
  try{
    const { password } = req.body

    const token = req.params.token

    const payload = getResetTokenPayLoad(token)

    const hashedPassword = await saltAndHashPassword(password)

    const user = await updateUserPassword(payload.userId, hashedPassword)

    if(!user) throw new ServerError(404, 'Bad Request', 'User not found', undefined, "User not found")

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    })

    console.log('This user has changed its password: \n', user)

  }catch(error){
    next(error)
  }
}

export { signUpController, loginController, refreshAccessTokenController, logOutController, resetPasswordSendEmailController, resetPasswordController }
