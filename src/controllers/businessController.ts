import { Request, Response } from "express";
import { Business } from "../models/business";
import { FindOptions, InferAttributes } from "@sequelize/core";

export async function register_business(req: Request, res: Response): Promise<any>{
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

    const newBusiness = new Business({
        businessName: businessName,
        address: address,
        businessEmail: businessEmail,
        phoneNumber: phoneNumber,
        nearestSchool: nearestSchool,
        description: description,
        userId: userId
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