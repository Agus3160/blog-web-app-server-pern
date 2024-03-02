import { PrismaClient, Role } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ServerError } from "../middleware/errorHandler";

const prisma = new PrismaClient();

export const createUser = async (username: string, email: string, password: string, imageUrl:string|null, imagePath:string|null, role:Role) => {
  try{
    return await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: password,
        imageUrl: imageUrl,
        imagePath: imagePath,
        role: role
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) {
      switch(error.code){
        case "P2002":
          throw new ServerError(400, error.name, error.message, error.code, "User and/or Email already exists")
        default:
          throw new ServerError(500, error.name, error.message, error.code, "Error creating user")
      }
    }
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message,undefined,"Error creating user")
    throw error
  }
}

export const getUserByUsername = async (username: string) => {
  try{
    return await prisma.user.findUnique({
      where: {
        username: username
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) {
      throw new ServerError(500, error.name, error.message, error.code, "Error using credentials")
    }
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined, "Error using credentials")
    throw error
  }
}

export const resetPassword = async (userId: string, password: string) => {
  try{
    return await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        password: password
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error resetting password")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined, "Error resetting password")
    throw error
  }
}