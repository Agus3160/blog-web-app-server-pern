import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ServerError } from "../middelwares/errorHandler";

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

export const createPost = async (title: string, content: string, authorId: string) => {
  try{
    return await prisma.post.create({
      data: {
        title,
        content,
        authorId
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