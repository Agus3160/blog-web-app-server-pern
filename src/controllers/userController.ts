import { NextFunction, Request, Response } from "express";
import { ApiResponseScheme, UserData } from "../../type";
import { ServerError } from "../middelwares/errorHandler";
import { getUserByUsername, deleteUserById } from "../services/usersServices";
import { getRefreshTokenPayLoad } from "../services/tokenServices";

const getUserByIdController = async (req: Request, res: Response<ApiResponseScheme<UserData>>, next: NextFunction) => {

  try {

    const { username } = req.params

    const user = await getUserByUsername(username)

    if (!user) throw new ServerError(404, 'Not Found', 'User not found', undefined, "User Not Found")

    const userData = {
      username: user.username,
      email: user.email
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

    const user = await deleteUserById(payload.session.userId)

    res.status(200).json({
      success: true,
      message: 'User data retrieved successfully',
    })

    console.log('User deleted successfully \nDeleted User Data:', user)

  } catch (error) {
    next(error)
  }

}

export { getUserByIdController, deleteUserController }