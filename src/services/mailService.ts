import nodemailer from 'nodemailer'

const USER_EMAIL = process.env.USER_EMAIL!
const USER_PASSWORD = process.env.USER_PASSWORD!

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD,
  }
})

export const sendEmail = async (email: string, subject: string, text: string) => {
    await transporter.sendMail({
      from: USER_EMAIL,
      to: email,
      subject: subject,
      text: text
    })
}