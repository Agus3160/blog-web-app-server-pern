import { NextFunction, Request, Response } from "express";
import { ApiResponseScheme, PostPutReq, PostReq, PostRes } from "../../type";
import { ServerError } from "../middleware/errorHandler";
import { createPost, deletePost, getPostById, getPosts, getPostsByAuthorUsername, updatePost, getPostImagePath } from "../services/postsServices";
import { deleteImage, uploadImage } from "../services/firebaseServices";

const getAllPostsController = async (_req: Request, res: Response<ApiResponseScheme<PostRes[]|[]>>, next:NextFunction) => {
  try{
    const posts = await getPosts()
    const PostData = posts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
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

    const { title, content, authorId, image }:PostReq = req.body

    if(!title || !content || !authorId) throw new ServerError(400, 'Bad Request', "title, content and authorId are required", undefined,'title, content and authorId are required')

    let imageUrl: string|null = null
    let path: string|null = null

    if(image) [imageUrl, path] = await uploadImage(image, 'post-images')

    const post = await createPost(title, content, authorId, imageUrl, path)

    const postData = {
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
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
        imageUrl: post.imageUrl,
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
        imageUrl: postData.imageUrl,
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

    if(postData.imagePath) await deleteImage(postData.imagePath)

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
    const { id: postId } = req.params
    const { title, content, oldImageUrl, newImage }:PostPutReq = req.body

    if(!postId || !title || !content) throw new ServerError(400, 'Bad Request', "title, content and postId are required", undefined,'title, content and postId are required')

    let updatedData:{title:string, content:string, imageUrl:string|null, path:string|null}

    const postImageDirectory = await getPostImagePath(postId)
    if(!postImageDirectory) throw new ServerError(404, 'Not Found', 'Post not found', undefined, 'Post not found')

    if(newImage){
      if (postImageDirectory.imagePath) await deleteImage(postImageDirectory.imagePath)
      const [imageUrl, path] = await uploadImage(newImage, 'post-images')
      updatedData = {
        title: title,
        content: content,
        imageUrl: imageUrl,
        path: path
      }
    }else{
      updatedData = {
        title: title,
        content: content,
        imageUrl: oldImageUrl,
        path: postImageDirectory.imagePath
      }
    }

    await updatePost(postId, updatedData.title, updatedData.content, updatedData.path, updatedData.imageUrl)
    
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
    })
  }catch(error){
    next(error)
  }
}


export { getAllPostsController, uploadPostController, getPostsByAuthorUsernameController, getPostByIdController, deletePostController, updatePostController }