import { Request, Response, NextFunction } from "express";
import { Room } from "../models/room";
import { Business } from "../models/business";
import { User } from "../models/user";
import { Op } from "@sequelize/core";

export async function list_room(req: Request, res: Response): Promise<any> {
    const {
        imagesUrlArrayString,
        propertyType,
        numberOfBedrooms,
        numberOfBathrooms,
        paymentFrequency,
        price,
        priceType,
        location,
        school,
        walkingTime,
        kekeTime,
        description,
        WiFi,
        parking,
        electricity,
        water,
        electricityDescription,
        waterDescription,
        networkQuality,
        networkDescription,
        ownerName,
        ownerPhone,
        ownerProgramme,
        yearOfStudy,
        dateOfBirth,
        additionalInfo
    } = req.body
    
    if(
        !propertyType||
        !paymentFrequency ||
        !price ||
        !priceType ||
        !location ||
        !school ||
        !walkingTime ||
        !kekeTime ||
        !description || 
        !networkQuality ||
        !ownerName ||
        !ownerPhone ||
        !ownerProgramme ||
        !yearOfStudy ||
        !dateOfBirth ||
        !additionalInfo ||
        !imagesUrlArrayString || imagesUrlArrayString.split(",").length <= 1
    ){
        return res.status(400).json("Invalid input.")
    }

    const userId = req.user.userId

    const newRoom = new Room({
        imagesUrlArrayString: imagesUrlArrayString,
        propertyType: propertyType,
        numberOfBedrooms: numberOfBedrooms,
        numberOfBathrooms: numberOfBathrooms,
        paymentFrequency: paymentFrequency,
        price: price,
        priceType: priceType,
        location: location,
        nearestSchool: school,
        walkingTime: walkingTime,
        kekeTime: kekeTime,
        description: description,
        WiFi: WiFi,
        parking: parking,
        electricity: electricity,
        water: water,
        electricityDescription: electricityDescription,
        waterDescription: waterDescription,
        networkQuality: networkQuality,
        networkDescription: networkDescription,
        ownerName: ownerName,
        ownerPhone: ownerPhone,
        ownerProgramme: ownerProgramme,
        yearOfStudy: yearOfStudy,
        dateOfBirth: dateOfBirth,
        additionalInfo: additionalInfo,
        userId: userId
    })

    await newRoom.save()
    return res.status(200).json("The Room has been listed.")
}

export async function get_all_rooms(req: Request, res: Response): Promise<any>{
  const user = req.user
  const searchedText = req.query.search
  if(searchedText){
    const rooms = await Room.findAll({
        where: {
        propertyType: { [Op.like]: `%${searchedText}%` },
        nearestSchool: user.school
        },
    })
    return res.status(200).json(rooms)
    }
  const allRooms = await Room.findAll({where: { nearestSchool: user.school }})
  return res.status(200).json(allRooms)
}

export async function get_a_room(req: Request, res: Response): Promise<any>{
    const user = req.user
    const roomId = req.params.roomId

    const room= await Room.findOne({where: { nearestSchool: user.school, RoomId: roomId }})
    const business = await Business.findOne({where: { userId: room?.userId }})
    if(business){
        return res.status(200).json({
            ...room?.dataValues,
        })
    }
    const owner = await User.findOne({ where: {userId: room?.userId} })

    return res.status(200).json({
        ...room?.dataValues,
        phoneNumber: owner?.phoneNumber
    })
}

export async function delete_room(req: Request, res: Response): Promise<any>{
    const user = req.user
    const roomId = req.params.roomId

    await Room.destroy({where: { userId: user.userId, RoomId: roomId }})

    return res.status(200).json("The room has been deleted successfully.")
}

export async function edit_room(req: Request, res: Response): Promise<any> {
    const {
        imagesUrlArrayString,
        propertyType,
        numberOfBedrooms,
        numberOfBathrooms,
        paymentFrequency,
        price,
        priceType,
        location,
        school,
        walkingTime,
        kekeTime,
        description,
        WiFi,
        parking,
        electricity,
        water,
        electricityDescription,
        waterDescription,
        networkQuality,
        networkDescription,
        ownerName,
        ownerPhone,
        ownerProgramme,
        yearOfStudy,
        dateOfBirth,
        additionalInfo
    } = req.body
    
    if(
        !propertyType||
        !paymentFrequency ||
        !price ||
        !priceType ||
        !location ||
        !school ||
        !walkingTime ||
        !kekeTime ||
        !description || 
        !networkQuality ||
        !ownerName ||
        !ownerPhone ||
        !ownerProgramme ||
        !yearOfStudy ||
        !dateOfBirth ||
        !additionalInfo ||
        !imagesUrlArrayString || imagesUrlArrayString.split(",").length <= 1
    ){
        return res.status(400).json("Invalid input.")
    }

    const user = req.user
    const roomId = req.params.roomId

    const room = await Room.findOne({where: { userId: user.userId, RoomId: roomId }})

    if(!room){
        return res.status(400).json("invalid input.")
    }

    room!.imagesUrlArrayString = imagesUrlArrayString
    room!.propertyType = propertyType
    room!.numberOfBedrooms = numberOfBedrooms
    room!.numberOfBathrooms = numberOfBathrooms
    room!.paymentFrequency = paymentFrequency
    room!.price = price
    room!.priceType = priceType
    room!.location = location
    room!.nearestSchool = school
    room!.walkingTime = walkingTime
    room!.kekeTime = kekeTime
    room!.description = description
    room!.WiFi = WiFi
    room!.parking = parking
    room!.electricity = electricity
    room!.water = water
    room!.electricityDescription = electricityDescription
    room!.waterDescription = waterDescription
    room!.networkQuality = networkQuality
    room!.networkDescription = networkDescription
    room!.ownerName = ownerName
    room!.ownerPhone = ownerPhone
    room!.ownerProgramme = ownerProgramme
    room!.yearOfStudy = yearOfStudy
    room!.dateOfBirth = dateOfBirth
    room!.additionalInfo = additionalInfo

    await room!.save()
    return res.status(200).json("The Room has been listed.")
}