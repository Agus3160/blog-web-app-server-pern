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
}

export type Session = {
  username: string
  userId: string
  accessToken: string
}

export type SessionPayload = Omit<Session, 'accessToken'>