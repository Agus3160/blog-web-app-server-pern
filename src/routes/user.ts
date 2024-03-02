import express from 'express'
import authAccessToken from '../middleware/authAccessToken';
import { 
  getUserByIdController,
  deleteUserController,
  updateUserInfoController,
  changePasswordController,
  getAllUsersController
} from '../controllers/userController';
import checkIsAdmin from '../middleware/checkIsAdmin';
import checkIsTheUserOwner from '../middleware/checkIsTheUserOwner';

const route = express.Router();

//GET endpoints
route.get('/:username', authAccessToken, getUserByIdController)
route.get('/', authAccessToken, checkIsAdmin, getAllUsersController)

//PUT endpoints
route.put('/', authAccessToken, updateUserInfoController)
route.put('/password', authAccessToken, changePasswordController)

//DELETE endpoints
route.delete('/:id', authAccessToken, checkIsTheUserOwner, deleteUserController)

export default route