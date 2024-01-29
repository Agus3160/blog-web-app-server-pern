import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ServerError } from "../middleware/errorHandler";

const prisma = new PrismaClient();

export const getPosts = async () => {
  try{
    return await prisma.post.findMany({
      include: {
        author: true
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting posts")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting posts")
    throw error
  }
}

export const createPost = async (title: string, content: string, authorId: string, imageUrl: string, imagePath: string) => {
  try{
    return await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        imageUrl: imageUrl,
        imagePath: imagePath
      },
      include: {
        author: true
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error creating post")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error creating post")
    throw error
  }
}

export const getPostsByAuthorUsername = async (username: string) => {
  try{
    return await prisma.post.findMany({
      where: {
        author: { username: username } 
      },
      include: {
        author: true
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting posts")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting posts")
    throw error
  }
}

export const getPostById = async (id: string) => {
  try{
    return await prisma.post.findUnique({
      where: {
        id: id
      },
      include: {
        author: true,
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting post")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting post")
    throw error
  }
}

export const deletePost = async (id: string) => {
  try{
    return await prisma.post.delete({
      where: {
        id: id
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error deleting post")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error deleting post")
    throw error
  }
}

export const updatePost = async (id: string, title: string, content: string, imagePath: string, imageUrl: string) => {
  try{
    return await prisma.post.update({
      where: {
        id: id
      },
      data: {
        title,
        content,
        imagePath,
        imageUrl
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error updating post")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error updating post")
    throw error
  }
}

export const getPostImagePath = async (id: string) => {
  try{
    return await prisma.post.findUnique({
      where: {
        id: id
      },
      select: {
        imagePath: true
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting post image path")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting post image path")
    throw error
  }
}

export const getAllPostImagePaths = async (userId:string) => {
  try{
    const pathsObject = await prisma.post.findMany({
      where: {
        authorId: userId
      },
      select: {
        imagePath: true
      }
    })
    const paths = pathsObject.map(path => path.imagePath)
    return paths
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting User Info")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting User Info")
    throw error
  }
}