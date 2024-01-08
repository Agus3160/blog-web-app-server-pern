import bcrypt from 'bcrypt'
import { ServerError } from '../middelwares/errorHandler'

const saltAndHashPassword = async (password: string) => {
  try{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  }catch(error){
    if(error instanceof Error) throw new ServerError(500, error.name, error.message, undefined, "Sign up failed")
    throw new ServerError(500, 'SaltAndHashPasswordError', 'Error hashing password', undefined, "Sign up failed")
  }
}

const comparePassword = async (password: string, hashedPassword: string) => {
  try{
    return await bcrypt.compare(password, hashedPassword)
  }catch(error){
    if(error instanceof Error) throw new ServerError(500, error.name, error.message, undefined, "Invalid Credentials")
    throw new ServerError(500, 'ComparePasswordError', 'Error comparing password', undefined, "Invalid Credentials")
  }
}

export { saltAndHashPassword, comparePassword }