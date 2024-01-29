import { ref, getDownloadURL, uploadString, StorageError, deleteObject } from "firebase/storage"
import { storage } from "../libs/firebaseConfig";
import { ServerError } from "../middleware/errorHandler";

export const uploadImage = async (image:string, directory:string) => {
  
  const path = `${directory}/${Date.now()}.webp`
  const storageRef = ref(storage, path)
  const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

  return new Promise<string[]>((resolve, reject) => {
    uploadString(storageRef, base64Data, 'base64').
      then(async () => {
        const imageUrl = await getDownloadURL(storageRef)
        resolve([imageUrl, path])
      })
      .catch((error) => {
        if(error instanceof StorageError) throw new ServerError(500, error.name, error.message, error.code, "Error uploading image")
        reject(new ServerError(500, 'Error uploading image', 'Error uploading image', undefined, "Error uploading image"))
      })
  })
}


export const deleteImage = async (directory:string) => {
  
  return new Promise<void>((resolve, reject) => {
    const storageRef = ref(storage, directory)
    deleteObject(storageRef)
      .then(() => resolve())
      .catch((error) => {
        if(error instanceof StorageError) throw new ServerError(500, error.name, error.message, error.code, "Error deleting image")
        reject(new ServerError(500, 'Error deleting image', 'Error deleting image', undefined, "Error deleting image"))
      })
  })

}