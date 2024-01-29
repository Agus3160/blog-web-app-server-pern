import express from 'express'
import { errorHandler } from './middleware/errorHandler'
import auth from './routes/auth'
import post from './routes/post'
import user from './routes/user'
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config()

const server = express()

server.use(cors({origin: 'https://web-app-blog-pern.onrender.com', credentials: true}))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(cookieParser())

server.use('/auth', auth)
server.use('/posts', post)
server.use('/user', user)

server.use(errorHandler)

server.listen(3000, () => console.log('Server running on port 3000'))