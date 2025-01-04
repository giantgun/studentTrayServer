import { FindOptions, InferAttributes } from "@sequelize/core"
import {User} from "../models/user"
import argon2 from "argon2"
import { Response, Request } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { testDbConnection } from "../config/database"
import { Business } from "../models/business"
import { Review } from "../models/reviews"

testDbConnection()
dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

export async function signUp_user(req: Request , res: Response): Promise<any>{
    try{
        const {
            username,
            email,
            password,
            dateOfBirth,
            phoneNumber,
            school
        } = req.body
        if (!username || !email || !password || !dateOfBirth || !school) {
            return res.status(400).json('Invalid input.');
          }
        console.log(req.body)
    
        const existingUserEmail = await User.findOne( { where: { email: email } } as FindOptions<InferAttributes<User, { omit: never; }>>)
        if(existingUserEmail){
            return res.status(400).json("email already in use.")
        }
    
        const existingUserUsername = await User.findOne( { where: { username: username } } as FindOptions<InferAttributes<User, { omit: never; }>>)
        if(existingUserUsername){
            return res.status(400).json("Username already exist.")
        }

        const hashedPassword = await argon2.hash(password)

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            dateOfBirth: dateOfBirth,
            school: school,
            phoneNumber: phoneNumber
        })
        newUser.save() 
        return res.status(200).json("Sign up successful.")
          
    }catch(error){
        console.error(error)
    }
}

export async function signIn_user(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body

    if ( !email || !password ) {
        return res.status(400).json( 'Invalid input.' );
      }
    
    const user = await User.findOne( { where: { email: email } } as FindOptions<InferAttributes<User, { omit: never; }>> )
    if(!user){
        return res.status(400).json("Invalid Username or Password.")
    }

    const isPasswordValid = await argon2.verify(user!.password, password)
    if(!isPasswordValid){
        return res.status(400).json("Invalid Username or Password.")
    }

    const business = await Business.findOne({ where: { userId: user.userId }  })

    const token = await generateAccessToken(email)
    if(business){
        return res.status(200).cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        }).json({
            user: {
                username: user.username,
                school: user.school,
                dateOfBirth: user.dateOfBirth,
                photoUrl: user.photoUrl,
            },
            business: {
                businessName: business.businessName,
                address: business.address,
                businessEmail: business.businessEmail,
                phoneNumber: business.phoneNumber,
                nearestSchool: business.nearestSchool,
                description: business.description,
                dateJoined: business.createdAt
            }
        })
    }

    return res.status(200).cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    }).json({
        user: {
            username: user.username,
            school: user.school,
            dateOfBirth: user.dateOfBirth,
            photoUrl: user.photoUrl,
        },
    })

    
}

export async function signOut_user(req: Request, res: Response): Promise<any> {
    return res.clearCookie("access_token").status(200).json("Sign out successful.")
}

export async function edit_profile(req: Request, res: Response): Promise<any>{
    const {
        username,
        firstName,
        lastName,
        dateOfBirth,
        school
    } = req.body

    const user = req.user
    if(
        !username ||
        !firstName ||
        !lastName ||
        !dateOfBirth ||
        !school
    ){
        return res.status(400).json("Invalid Input.")
    }

    const editedUser = await User.findOne( { where: { userId: user.userId } } as FindOptions<InferAttributes<User, { omit: never; }>> )

    editedUser!.username = username,
    editedUser!.dateOfBirth = dateOfBirth,
    editedUser!.school = school

    await editedUser!.save()


    return res.status(200).json({
        username: editedUser!.username,
        school: editedUser!.school,
        dateOfBirth: editedUser!.dateOfBirth,
        photoUrl: editedUser!.photoUrl,
      })
}

export async function get_user_public(req: Request, res: Response): Promise<any> {
    const userId = req.params.userId
    const reviews = await Review.findAll({where: { userId: userId }})
    const user = await User.findOne({where: { userId: userId }})
    const business = await Business.findOne({where: { userId: userId }})
    
    return res.json({
        username: user?.username,
        school: user?.school,
        photoUrl: user?.photoUrl,
        bussinessId: business?.businessId,
        reviews: reviews
    })


}

async function generateAccessToken(email: string ){
    return jwt.sign({email: email}, tokenSecret!, { expiresIn: "7d" })
}