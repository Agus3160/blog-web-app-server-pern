import express from 'express'
import { signUpController, loginController, refreshAccessTokenController, logOutController, resetPasswordSendEmailController, resetPasswordController } from '../controllers/authController'

const route = express.Router();

route.post('/signup', signUpController)
route.post('/login', loginController)
route.post('/refresh', refreshAccessTokenController)
route.post('/logout', logOutController)
route.post('/reset-password-send-email', resetPasswordSendEmailController)
route.post('/reset-password/:token', resetPasswordController)

export default route