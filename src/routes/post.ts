import express from 'express'
import authAccessToken from '../middelwares/authAccessToken';
import { 
  getAllPostsController, 
  uploadPostController, getPostsByAuthorUsernameController, 
  updatePostController, 
  getPostByIdController, 
  deletePostController 
} from '../controllers/postController';
import checkIsThePostOwner from '../middelwares/checkIsThePostOwner';

const route = express.Router();

//Get endpoints
route.get('/', authAccessToken, getAllPostsController)
route.get('/:id', authAccessToken, getPostByIdController)
route.get('/author/:username', authAccessToken, getPostsByAuthorUsernameController)

//POST endpoints
route.post('/upload', authAccessToken, uploadPostController)

//PUT endpoints
route.put('/:id', authAccessToken, checkIsThePostOwner, updatePostController)

//DELETE endpoints
route.delete('/:id', authAccessToken, checkIsThePostOwner, deletePostController)

export default route