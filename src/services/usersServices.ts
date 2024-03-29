import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ServerError } from "../middleware/errorHandler";
import { Role as Roles } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserByUsername = async (username:string) => {
  try{
    return await prisma.user.findFirst({
      where: {
        username: username
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting User Info")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting User Info")
    throw error
  }
}

export const deleteUserById = async (userId:string) => {
  try{
    return await prisma.user.delete({
      where: {
        id: userId
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error deletting User")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error deletting User")
    throw error
  }
}


export const updateUserInfoById = async (userId:string, username:string, email:string, imageUrl:string|null, imagePath:string|null, role:Roles) => {
  try{
    return await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        username: username,
        email: email,
        imageUrl: imageUrl,
        imagePath: imagePath,
        role: role
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error updating User")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error updating User")
    throw error
  }
}

export const updateUserPassword = async (userId:string, password:string) => {
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
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error updating User")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error updating User")
    throw error
  }
}

export const getUserImagePath = async (userId:string) => {
  try{
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      select: {
        imagePath: true
      }
    })
    return user?.imagePath
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting User Info")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting User Info")
    throw error
  }
}

export const getUserPassword = async (userId:string) => {
  try{
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      select: {
        password: true
      }
    })
    return user?.password
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting User Info")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting User Info")
    throw error
  }
}

export const getUserImageUrlById = async (userId:string) => {
  try{
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }, select: {
        imageUrl: true
      }
    })
    return user?.imageUrl
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting User Info")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting User Info")
    throw error
  }
}

export const getUserByEmail = async (email:string) => {
  try{
    return await prisma.user.findFirst({
      where: {
        email: email
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting User Info")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting User Info")
    throw error
  }
}

export const getAllUsers = async () => {
  try{
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        imageUrl: true,
        role: true
      }
    })
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError) throw new ServerError(500, error.name, error.message, error.code, "Error getting User Info")
    if (error instanceof PrismaClientUnknownRequestError) throw new ServerError(500, error.name, error.message, undefined,"Error getting User Info")
    throw error
  }
}