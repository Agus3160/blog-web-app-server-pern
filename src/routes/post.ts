import express from 'express'
import authAccessToken from '../middelwares/authAccessToken';
import { getAllPostsController, uploadPostController, getPostsByAuthorUsernameController } from '../controllers/postController';

const route = express.Router();

route.get('/', authAccessToken, getAllPostsController)
route.post('/upload', authAccessToken, uploadPostController)
route.get('/author/:username', authAccessToken, getPostsByAuthorUsernameController)

export default route