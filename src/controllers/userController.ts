import argon2 from "argon2"
import { Response, Request, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

export async function signUp_user(req: Request , res: Response): Promise<any>{
    try{
        const {
            username,
            email,
            password,
            phoneNumber,
            school
        } = req.body
        if (!username || !email || !password || !school || !phoneNumber) {
            return res.status(400).json('Invalid input.');
        }
    
        const existingUserEmail = await prisma.user.findUnique({ where: { email: email } })
        if(existingUserEmail){
            return res.status(400).json("email already in use.")
        }
    
        const existingUserUsername = await prisma.user.findUnique({ where: { username: username } })
        if(existingUserUsername){
            return res.status(400).json("Username already exist.")
        }

        const existingSchool = await prisma.school.findFirst({ where: { schoolName: school } })
        if(!existingSchool){
            return res.status(400).json("Sorry, we are not available in your school yet.")
        }

        const hashedPassword = await argon2.hash(password)
        const currentDate = new Date()

        await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
                schoolId: existingSchool!.schoolId,
                phoneNumber: phoneNumber.toString(),
                updatedAt: currentDate
            }
        })

        return res.status(200).json("Sign up successful.")
          
    }catch(error){
        console.error(error)
    }
}

export async function signIn_user(req: Request, res: Response): Promise<any> {
    const { username, password } = req.body

    if ( !username || !password ) {
        return res.status(400).json( 'Invalid input.' );
      }
    
    const user = await prisma.user.findUnique({ 
        where:{ 
            username: username 
        }, 
        select: { 
            phoneNumber:true,
            school: true,
            password: true,
            username: true,
            userId: true,
            email: true,
            photoUrl: true
        }
    })
    if(!user){
        return res.status(400).json("Invalid Username or Password.")
    }

    const isPasswordValid = await argon2.verify(user!.password, password)
    if(!isPasswordValid){
        return res.status(400).json("Invalid Username or Password.")
    }

    const business = await prisma.business.findUnique({ where: { userId: user.userId }  })
 
    const token = await generateAccessToken(user.email)
    if(business){
        const nearestSchool = await prisma.school.findUnique({ where: { schoolId: business?.nearestSchoolId } })

        return res.status(200).cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        }).json({
            user: {
                username: user.username,
                school: user.school,
                photoUrl: user.photoUrl,
                email: user.email,
                phoneNumber: user.phoneNumber
            },
            business: {
                businessName: business.businessName,
                address: business.address,
                businessEmail: business.businessEmail,
                phoneNumber: business.phoneNumber,
                nearestSchool: nearestSchool,
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
            photoUrl: user.photoUrl,
            email: user.email,
            phoneNumber: user.phoneNumber
        },
    })

    
}

export async function signOut_user(req: Request, res: Response): Promise<any> {
    return res.clearCookie("access_token").status(200).json("Sign out successful.")
}

export async function edit_profile(req: Request, res: Response): Promise<any>{
    const {
        username,
        email,
        phoneNumber,
        school
    } = req.body

    const user = req.user
    if(
        !username ||
        !email ||
        !phoneNumber ||
        !school
    ){
        return res.status(400).json("Invalid Input.")
    }

    const editedUser = await prisma.user.update({ 
        where: { userId: user.userId }, 
        data: {
            username: username,
            email,
            phoneNumber,
            school: {
                connect: {
                    schoolName: school
                }
            }
        },  
        select: { 
            school: true,
            password: true,
            username: true,
            userId: true,
            email: true,
            photoUrl: true
        }
    })


    return res.status(200).json({
        username: editedUser!.username,
        school: editedUser!.school,
        photoUrl: editedUser!.photoUrl,
      })
}

export async function get_user_public(req: Request, res: Response): Promise<any> {
    const userId = req.params.userId

    const user = await prisma.user.findUnique({
        where: { userId: Number(userId) },
        select: { 
            school: true,
            password: true,
            username: true,
            userId: true,
            email: true,
            photoUrl: true,
            createdAt: true
        }
    })
    const reviews = await prisma.review.findMany({where: { userId: Number(userId) }})

    if(!user){
        return res.status(400).json("User does not exist")
    }

    let userReviews = []

    for (let i = 0; i < reviews.length ; i++){
        const owner = await prisma.user.findFirst({ where: { userId: reviews[i].ownerUserId } })
        const review = {
            ...reviews[i],
            ownerPhotoUrl: owner?.photoUrl,
            username: owner?.username,
        }
        userReviews.push(review)
    }

    return res.json({
        username: user?.username,
        school: user?.school,
        photoUrl: user?.photoUrl,
        dateJoined: user?.createdAt,
        reviews: userReviews,
    })


}

export async function get_user_private(req: Request, res: Response): Promise<any> {
    const userId = req.user.userId

    const reviews = await prisma.review.findMany({where: { userId: userId }})
    const user = await prisma.user.findUnique({
        where: { userId: userId },
        include: {
            school: true,
            review: true,
            lodge: true,
            item: true,
            service: true,
            room: true,
            business: true,
        }
    })

    if(!user){
        return res.status(400).json("User exist")
    }

    let userReviews = []

    for (let i = 0; i < reviews.length ; i++){
        const owner = await prisma.user.findUnique({ where: { userId: reviews[i].ownerUserId } })
        const review = {
            ...reviews[i],
            ownerPhotoUrl: owner?.photoUrl,
            username: owner?.username,
        }
        userReviews.push(review)
    }
    
    return res.json({
        username: user?.username,
        school: user?.school.schoolName,
        photoUrl: user?.photoUrl,
        businessId: user.business?.businessId,
        reviews: userReviews,
        items: user.item,
        services: user.service,
        lodges: user.lodge,
        rooms: user.room,
        createdAt: user.createdAt,
        email: user.email,
        phoneNumber: user.phoneNumber
    })


}

export async function get_user_photo_url_for_overwrite(req: Request, res: Response, next: NextFunction){
    const user = req.user

    req.urlToOverwrite = user?.photoUrl
    next()
}

export async function save_user_photo_url(req: Request, res: Response): Promise<any>{
    const user = req.user
    const { photoUrl } = req.body

    await prisma.user.update({ 
        where: { userId: user.userId },
        data: {
            photoUrl: photoUrl
        }
    })

    return res.json("Upload succesful.")
}

async function generateAccessToken(email: string ){
    return jwt.sign({email: email}, tokenSecret!, { expiresIn: "7d" })
}