import express from 'express'
import { signUpController, loginController, refreshAccessTokenController, logOutController } from '../controllers/authController'

const route = express.Router();

route.post('/signup', signUpController)
route.post('/login', loginController)
route.post('/refresh', refreshAccessTokenController)
route.post('/logout', logOutController)

export default route