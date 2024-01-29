import express from 'express'
import authAccessToken from '../middleware/authAccessToken';
import { 
  getUserByIdController,
  deleteUserController,
  updateUserInfoController,
  changePasswordController
} from '../controllers/userController';

const route = express.Router();

//GET endpoints
route.get('/:username', authAccessToken, getUserByIdController)

//PUT endpoints
route.put('/', authAccessToken, updateUserInfoController)
route.put('/password', authAccessToken, changePasswordController)

//DELETE endpoints
route.delete('/', authAccessToken, deleteUserController)

export default route