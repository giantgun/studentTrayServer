import { NextFunction, Request, Response } from "express";
import { Business } from "../models/business";
import { FindOptions, InferAttributes } from "@sequelize/core";
import { Review } from "../models/reviews";
import { User } from "../models/user";
import { Item } from "../models/item";
import { Service } from "../models/service";
import { Lodge } from "../models/lodge";
import { Room } from "../models/room";

export async function register_business(req: Request, res: Response): Promise<any>{
    const {
        businessName,
        address,
        businessEmail,
        phoneNumber,
        nearestSchool,
        description,
        firstName,
        lastName
    } = req.body
    const userId = req.user.userId
    const user = req.user

    if(
        !businessName ||
        !address ||
        !businessEmail ||
        !phoneNumber ||
        !nearestSchool ||
        !description ||
        !firstName ||
        !lastName
    ){
        return res.status(400).json("Invalid input.")
    }

    const newBusiness = new Business({
        businessName: businessName,
        address: address,
        businessEmail: businessEmail,
        phoneNumber: phoneNumber,
        nearestSchool: nearestSchool,
        description: description,
        userId: userId,
        firstName: firstName,
        lastName: lastName
    })
    await newBusiness.save()

    const business = await Business.findOne( { where: { userId: userId } } as FindOptions<InferAttributes<Business, { omit: never; }>> )

    return res.status(200).json({
        user: {
            username: user.username,
            school: user.school,
            dateOfBirth: user.dateOfBirth,
            photoUrl: user.photoUrl,
        },
        business: {
            businessName: business!.businessName,
            address: business!.address,
            businessEmail: business!.businessEmail,
            phoneNumber: business!.phoneNumber,
            nearestSchool: business!.nearestSchool,
            description: business!.description,
            dateJoined: business!.createdAt
        }
    })
}

export async function edit_business(req: Request, res: Response): Promise<any>{
    const {
        businessName,
        address,
        businessEmail,
        phoneNumber,
        nearestSchool,
        description
    } = req.body
    const userId = req.user.userId
    const user = req.user

    if(
        !businessName ||
        !address ||
        !businessEmail ||
        !phoneNumber ||
        !nearestSchool ||
        !description 
    ){
        return res.status(400).json("Invalid input.")
    }

    const business = await Business.findOne( { where: { userId: userId } } as FindOptions<InferAttributes<Business, { omit: never; }>> )

    business!.businessName = businessName
    business!.address = address
    business!.businessEmail = businessEmail
    business!.phoneNumber = phoneNumber
    business!.nearestSchool = nearestSchool
    business!.description = description

    await business?.save()

    return res.status(200).json({
        user: {
            username: user.username,
            school: user.school,
            dateOfBirth: user.dateOfBirth,
            photoUrl: user.photoUrl,
        },
        business: {
            businessName: business!.businessName,
            address: business!.address,
            businessEmail: business!.businessEmail,
            phoneNumber: business!.phoneNumber,
            nearestSchool: business!.nearestSchool,
            description: business!.description,
            dateJoined: business!.createdAt
        }
    })
}

export async function get__business_public(req: Request, res: Response): Promise<any> {
    const businessId = req.params.businessId
    const loggedInUserSchool = req.user.school

    const reviews = await Review.findAll({where: { businessId: businessId, }})
    const business = await Business.findOne({where: { businessId: businessId }})
    const user = await User.findOne({where: { userId: business?.userId}})
    const items = await Item.findAll({where: { userId: user?.userId, school: loggedInUserSchool }})
    const services = await Service.findAll({where: { userId: user?.userId, school: loggedInUserSchool }})
    const lodges = await Lodge.findAll({where: { userId: user?.userId, nearestSchool: loggedInUserSchool }})
    const rooms = await Room.findAll({where: { userId: user?.userId, nearestSchool: loggedInUserSchool }})
    
    return res.json({
        businessName: business?.businessName,
        businessEmail: business?.businessEmail,
        nearestSchool: business?.nearestSchool,
        photoUrl: business?.photoUrl,
        coverPhotoUrl: business?.coverPhotoUrl,
        businessId: business?.businessId,
        phoneNumber: business?.phoneNumber,
        dateJoined: business?.createdAt,
        description: business?.description,
        reviews: reviews,
        items: items,
        services: services,
        lodges: lodges,
        rooms: rooms
    })


}

export async function get__business_private(req: Request, res: Response): Promise<any> {
    const userId = req.user.userId
    const user= req.user

    const business = await Business.findOne({where: { userId: userId }})
    const reviews = await Review.findAll({where: { businessId: business?.businessId }})
    const items = await Item.findAll({where: { userId: user?.userId }})
    const services = await Service.findAll({where: { userId: user?.userId }})
    const lodges = await Lodge.findAll({where: { userId: user?.userId }})
    const rooms = await Room.findAll({where: { userId: user?.userId }})
    
    return res.json({
        businessName: business?.businessName,
        businessEmail: business?.businessEmail,
        nearestSchool: business?.nearestSchool,
        photoUrl: business?.photoUrl,
        coverPhotoUrl: business?.coverPhotoUrl,
        businessId: business?.businessId,
        phoneNumber: business?.phoneNumber,
        dateJoined: business?.createdAt,
        description: business?.description,
        reviews: reviews,
        items: items,
        services: services,
        lodges: lodges,
        rooms: rooms
    })


}

export async function get_business_photo_url_for_overwrite(req: Request, res: Response, next: NextFunction){
    const user = req.user

    const business = await Business.findOne( { where: { userId: user.userId } } )

    req.urlToOverwrite = business?.photoUrl
    next()
}

export async function save_business_photo_url(req: Request, res: Response): Promise<any>{
    const user = req.user
    const { photoUrl } = req.body

    const business = await Business.findOne( { where: { userId: user.userId } } )

    business!.photoUrl = photoUrl
    await business!.save()

    return res.json("Upload succesful.")
}

export async function get_business_cover_photo_url_for_overwrite(req: Request, res: Response, next: NextFunction){
    const user = req.user

    const business = await Business.findOne( { where: { userId: user.userId } } )

    req.urlToOverwrite = business?.coverPhotoUrl
    next()
}

export async function save_business_cover_photo_url(req: Request, res: Response): Promise<any>{
    const user = req.user
    const { coverPhotoUrl } = req.body

    const business = await Business.findOne( { where: { userId: user.userId } } )

    business!.coverPhotoUrl = coverPhotoUrl
    await business!.save()

    return res.json("Upload succesful.")
}