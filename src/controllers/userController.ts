import { NextFunction, Request, Response } from "express";
import { ApiResponseScheme, Session, UserData, UserPutReq } from "../../type";
import { ServerError } from "../middleware/errorHandler";
import { getUserByUsername, deleteUserById, updateUserInfoById, getUserImagePath, getUserPassword, updateUserPassword } from "../services/usersServices";
import { getAllPostImagePaths } from "../services/postsServices";
import { generateAccessToken, generateRefreshToken, getRefreshTokenPayLoad } from "../services/tokenServices";
import { deleteImage, uploadImage } from "../services/firebaseServices";
import { comparePassword, saltAndHashPassword } from "../libs/bcryptLib";

const getUserByIdController = async (req: Request, res: Response<ApiResponseScheme<UserData>>, next: NextFunction) => {
  try {
    const { username } = req.params

    const user = await getUserByUsername(username)

    if (!user) throw new ServerError(404, 'Not Found', 'User not found', undefined, "User Not Found")

    const userData = {
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl
    }

    res.status(200).json({
      success: true,
      message: 'User data retrieved successfully',
      data: userData
    })
  } catch (error) {
    next(error)
  }
}

const deleteUserController = async (req: Request, res: Response<ApiResponseScheme<undefined>>, next: NextFunction) => {
  try {
    const refreshToken = req.cookies["refreshToken"]

    if (!refreshToken) throw new ServerError(401, 'Unauthorized', 'refresh token is required', undefined, "Unauthorized")

    const payload = getRefreshTokenPayLoad(refreshToken)
    const userId = payload.session.userId

    if (!userId) throw new ServerError(401, 'Unauthorized', 'user id is required', undefined, "Unauthorized")

    const allPostsImagePathFormUser = await getAllPostImagePaths(userId)

    console.log('allPostsImagePathFormUser', allPostsImagePathFormUser)

    if(allPostsImagePathFormUser.length > 0){
      for(const imagePath of allPostsImagePathFormUser){
        await deleteImage(imagePath)
      }
    }

    const user = await deleteUserById(userId)

    res.status(200).json({
      success: true,
      message: 'User data retrieved successfully',
    })

    console.log('User deleted successfully \nDeleted User Data:', user)
  } catch (error) {
    next(error)
  }
}

const updateUserInfoController = async (req: Request, res: Response<ApiResponseScheme<Session>>, next: NextFunction) => {
  try{    
    const {username, email, currentPassword, newImage}:UserPutReq = req.body
    
    console.log(username, email, currentPassword, newImage)

    if(!username || !email || !currentPassword) throw new ServerError(400, 'Bad Request', 'username, email and password are required', undefined, "Bad Request")
    if(currentPassword.length < 8) throw new ServerError(400, 'Bad Request', 'password must be at least 8 characters long', undefined, "Bad Request")
    
    const refreshToken = req.cookies["refreshToken"]
    const payload = getRefreshTokenPayLoad(refreshToken)
    const currentImageUrl = payload.session.profileImage
    const userId = payload.session.userId

    const passwordDB = await getUserPassword(userId)
    if(!passwordDB) throw new ServerError(401, 'User doesnt exist with a session', 'The user doesnt exists in the DB', undefined, "The user doesn't exists")

    const passwordMatch = await comparePassword(currentPassword, passwordDB)
    if(!passwordMatch) throw new ServerError(400, 'Bad Request', 'Password is incorrect', undefined, "Bad Request")

    const currentPath = await getUserImagePath(userId)
    if(!currentPath) throw new ServerError(500, 'Internal Server Error', 'Error getting user image path', undefined, "Internal Server Error") 

    let newImageUrl = ''
    let newPath = ''

    if(newImage.length !== 0){
      await deleteImage(currentPath)
      let [imageUrl, path] = await uploadImage(newImage, 'profile-images')
      newImageUrl = imageUrl
      newPath = path 
    }else{
      newImageUrl = currentImageUrl
      newPath = currentPath
    }
  
    await updateUserInfoById(userId, username, email, newImageUrl, newPath)

    const newPayload = {
      profileImage: newImageUrl,
      username: username,
      userId: userId
    }

    const newRefreshToken = generateRefreshToken(newPayload)
    const newAccessToken = generateAccessToken(newPayload)

    res.status(200).cookie("refreshToken", newRefreshToken, { httpOnly: true, maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_TTL!) * 1000 }).
    json({
      success: true,
      message: 'User data updated successfully',
      data: {
        profileImage: newImageUrl,
        username: username,
        userId: userId,
        accessToken: newAccessToken
      }
    })

  }catch(error){
    next(error)
  }
}

const changePasswordController = async (req: Request, res: Response<ApiResponseScheme<undefined>>, next: NextFunction) => {
  try{
    const { currentPassword, newPassword } = req.body
    if(!currentPassword || !newPassword) throw new ServerError(400, 'Bad Request', 'Current and new passwords are required', undefined, "Bad Request")
    if(newPassword.length < 8) throw new ServerError(400, 'Bad Request', 'password must be at least 8 characters long', undefined, "Bad Request")
    
    const refreshToken = req.cookies["refreshToken"]
    const payload = getRefreshTokenPayLoad(refreshToken)
    const userId = payload.session.userId
    
    const passwordDB = await getUserPassword(userId)
    if(!passwordDB) throw new ServerError(401, 'User that doesnt exists with a session', 'The user doesnt exists in the DB', undefined, "The user doesn't exists")

    const passwordMatch = await comparePassword(currentPassword, passwordDB)
    if(!passwordMatch) throw new ServerError(400, 'Bad Request', 'Password is incorrect', undefined, "Bad Request")

    const hashedPassword = await saltAndHashPassword(newPassword)
    await updateUserPassword(userId, hashedPassword)
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    })

  }catch(error){
    next(error)
  }
}

export { getUserByIdController, deleteUserController, updateUserInfoController, changePasswordController }
