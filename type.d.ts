export type ApiResponseScheme<T=undefined> = {
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
  profileImage: string|null
  accessToken: string
}

export type NewAccessToken = {
  newAccessToken: string
}

export type SessionPayload = {
  userId: string
  username: string
}

export type PostRes = {
  id: string,
  title: string,
  content: string,
  imageUrl:string|null,
  createdAt: Date,
  updatedAt: Date,
  author: string
}

export type PostReq = {
  title: string,
  content: string
  authorId: string
  image:string|null
}

export type PostPutReq = {
  title: string,
  content: string
  newImage: string|null
  oldImageUrl: string|null
}

export type UserData = {
  username: string
  email: string
  imageUrl: string|null
}

export type UserPutReq = {
  username:string
  email:string
  currentPassword:string
  newImage:string|null
}