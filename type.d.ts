export type ApiResponseScheme<T> = {
  success: boolean
  message?: string
  data?: T
}

export type ApiResponseErrorScheme = {
  success: boolean
  name?: string
  message?: string
  messageClient?: string
  httpStatusCode?: number
}

export type LoginCredentials = {
  username: string
  password: string
}

export type RegisterCredentials = {
  username: string
  email: string
  password: string
  image:string
}

export type Session = {
  username: string
  userId: string
  profileImage: string
  accessToken: string
}

export type SessionPayload = Omit<Session, 'accessToken'>

export type PostRes = {
  id: string,
  title: string,
  content: string,
  imageUrl:string,
  createdAt: Date,
  updatedAt: Date,
  author: string
}

export type PostReq = {
  title: string,
  content: string
  authorId: string
  image:string
}

export type PostPutReq = {
  title: string,
  content: string
  newImage: string
  oldImageUrl: string
}

export type UserData = {
  username: string
  email: string
  imageUrl: string
}

export type UserPutReq = {
  username:string
  email:string
  currentPassword:string
  newImage:string
}