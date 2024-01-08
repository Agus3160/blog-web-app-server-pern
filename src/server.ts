import express from 'express'
import { errorHandler } from './middelwares/errorHandler'
import auth from './routes/auth'
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config()

const server = express()

server.use(cors({origin: 'http://localhost:5173', credentials: true}))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(cookieParser())

server.use('/auth', auth)

server.use(errorHandler)

server.listen(3000, () => console.log('server running on port 3000'))