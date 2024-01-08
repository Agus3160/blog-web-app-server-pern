import express from 'express'
import { signUpController, loginController, refreshAccessTokenController } from '../controllers/authController'

const route = express.Router();

route.post('/signup', signUpController)
route.post('/login', loginController)

route.get('/refresh', refreshAccessTokenController)

export default route