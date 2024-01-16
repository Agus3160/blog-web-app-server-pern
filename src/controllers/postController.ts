import { NextFunction, Request, Response } from "express";
import { ApiResponseScheme, PostReq, PostRes } from "../../type";
import { ServerError } from "../middelwares/errorHandler";
import { createPost, getPosts, getPostsByAuthorUsername } from "../services/postsServices";

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


export { getAllPostsController, uploadPostController, getPostsByAuthorUsernameController }