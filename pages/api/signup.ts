import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

const jwtSecret = process.env.JWT_SECRET

//This is a serverless function. It does not require a server to be up and running
//to execute.
//Each serverless funciton will take 2 args a req and res which can be type checked
//Since we're using next these will be typed to next objects. Typing these gives us some autocomplete
//In the future it may be a good idea to create a set timeout function that checks the
//jwt and if it has expired. If it has have the user be redirected and log back in or
//auto refresh the token so that the user doesn't have to log back in as often
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //Creating the password encryption
  const salt = bcrypt.genSaltSync()
  const { email, password, firstName, lastName, phone, age, about } = req.body

  let user

  try {
    user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt),
        firstName,
        lastName,
        phone,
        age,
        about,
      },
    })
  } catch (e) {
    console.log(e)
    res.status(401).json({ error: e.message })
    return
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      time: Date.now(),
    },
    jwtSecret,
    {
      expiresIn: '8h',
    }
  )

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('MINDFULLY_FULL_ACCESS_TOKEN', token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  )

  res.json(user)
}
