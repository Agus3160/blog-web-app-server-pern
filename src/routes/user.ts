import express from 'express'
import authAccessToken from '../middelwares/authAccessToken';
import { 
  getUserByIdController,
  deleteUserController
} from '../controllers/userController';

const route = express.Router();

//Get endpoints
route.get('/:username', authAccessToken, getUserByIdController)

//DELETE endpoints
route.delete('/', authAccessToken, deleteUserController)

export default route