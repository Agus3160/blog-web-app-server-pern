import { NextFunction, Request, Response } from "express";
import { ApiResponseScheme, PostReq, PostRes } from "../../type";
import { ServerError } from "../middelwares/errorHandler";
import { createPost, deletePost, getPostById, getPosts, getPostsByAuthorUsername, updatePost } from "../services/postsServices";

const getAllPostsController = async (_req: Request, res: Response<ApiResponseScheme<PostRes[]|[]>>, next:NextFunction) => {
  try{
    const posts = await getPosts()
    const PostData = posts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author.username
      }
    })

    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: PostData
    })

  }catch(error){
    next(error)
  }
}

const uploadPostController = async (req: Request, res: Response<ApiResponseScheme<PostRes>>, next:NextFunction) => {
  try{

    const { title, content, authorId }:PostReq = req.body

    if(!title || !content || !authorId) throw new ServerError(400, 'Bad Request', "title, content and authorId are required", undefined,'title, content and authorId are required')

    const post = await createPost(title, content, authorId)

    const postData = {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author.username
    }

    res.status(200).json({
      success: true,
      message: 'Post created successfully',
      data: postData
    })

  }catch(error){
    next(error)
  }
}

const getPostsByAuthorUsernameController = async (req: Request, res: Response<ApiResponseScheme<PostRes[]|[]>>, next:NextFunction) => {
  try{
    const { username } = req.params
    const posts = await getPostsByAuthorUsername(username)
    const PostData = posts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author.username
      }
    })

    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: PostData
    })

  }catch(error){
    next(error)
  }
}

const getPostByIdController = async (req: Request, res: Response<ApiResponseScheme<PostRes>>, next:NextFunction) => {
  try{
    const { id } = req.params
    const postData = await getPostById(id)
    if(!postData) throw new ServerError(404, 'Not Found', 'Post not found', undefined, 'Post not found')
    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        createdAt: postData.createdAt,
        updatedAt: postData.updatedAt,
        author: postData.author.username
      }
    })
  }catch(error){
    next(error)
  }
}

const deletePostController = async (req: Request, res: Response<ApiResponseScheme<null>>, next:NextFunction) => {
  try{
    const { id } = req.params

    const postData = await deletePost(id)

    if(!postData) throw new ServerError(404, 'Not Found', 'Post not found', undefined, 'Post not found')

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: null
    })
  }catch(error){
    next(error)
  }
}

const updatePostController = async (req: Request, res: Response<ApiResponseScheme<PostRes>>, next:NextFunction) => {
  try{
    const { id: authorId } = req.params
    const { title, content }:PostReq = req.body

    await updatePost(authorId, title, content)
    
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
    })
  }catch(error){
    next(error)
  }
}


export { getAllPostsController, uploadPostController, getPostsByAuthorUsernameController, getPostByIdController, deletePostController, updatePostController }