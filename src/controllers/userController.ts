import { FindOptions, InferAttributes } from "@sequelize/core"
import {User} from "../models/user"
import argon2 from "argon2"
import { NextFunction, Response, Request } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { testDbConnection } from "../config/database"

testDbConnection()
dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

export async function signUp_user(req: Request , res: Response): Promise<any>{
    try{
        const {
            username,
            firstName,
            lastName,
            email,
            password,
            dateOfBirth,
            school
        } = req.body
        if (!username || !firstName || !lastName || !email || !password || !dateOfBirth || !school) {
            return res.status(400).json('Invalid input');
          }
        console.log(req.body)
    
        const existingUserEmail = await User.findOne( { where: { email: email } } as FindOptions<InferAttributes<User, { omit: never; }>>)
        if(existingUserEmail){
            return res.status(400).json("email already in use")
        }
    
        const existingUserUsername = await User.findOne( { where: { username: username } } as FindOptions<InferAttributes<User, { omit: never; }>>)
        if(existingUserUsername){
            return res.status(400).json("Username already exist")
        }

        const hashedPassword = await argon2.hash(password)

        const newUser = new User({
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            dateOfBirth: dateOfBirth,
            school: school
        })
        newUser.save() 
        return res.status(200).json("Sign up successful")
          
    }catch(error){
        console.error(error)
    }
}

export async function signIn_user(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body

    if ( !email || !password ) {
        return res.status(400).json( 'Invalid input' );
      }
    
    const user = await User.findOne( { where: { email: email } } as FindOptions<InferAttributes<User, { omit: never; }>> )
    if(!user){
        return res.status(400).json("Invalid Username or Password")
    }

    const isPasswordValid = await argon2.verify(user!.password, password)
    if(!isPasswordValid){
        return res.status(400).json("Invalid Username or Password")
    }

    const token = await generateAccessToken(email)
    return res.status(200).cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      }).json({
        userId: user.userId,
        username: user.username,
        school: user.school,
        dateOfBirth: user.dateOfBirth,
        photoUrl: user.photoUrl,
      })
}

export async function signOut_user(req: Request, res: Response): Promise<any> {
    return res.clearCookie("access_token").status(200).json("Sign out successful")
}

async function generateAccessToken(email: string ){
    return jwt.sign({email: email}, tokenSecret!, { expiresIn: "7d" })
}