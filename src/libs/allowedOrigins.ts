const DEPLOY = JSON.parse(process.env.DEPLOY!)

export const allowedOrigins = DEPLOY ? ['https://web-app-blog-pern.onrender.com'] : ['http://localhost:5173']