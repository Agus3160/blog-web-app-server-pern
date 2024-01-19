import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ServerError } from "../middelwares/errorHandler";

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
