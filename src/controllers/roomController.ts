import { Request, Response, NextFunction } from "express";
import { Room } from "../models/room";

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
  const allRooms = await Room.findAll({where: { nearestSchool: user.school }})
  return res.status(200).json(allRooms)
}

export async function get_a_room(req: Request, res: Response): Promise<any>{
    const user = req.user
    const roomId = req.params.roomId

    const room= await Room.findOne({where: { nearestSchool: user.school, RoomId: roomId }})
    return res.status(200).json(room)
}