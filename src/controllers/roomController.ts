import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma  = new PrismaClient()

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
        additionalInfo,
        videoUrl,
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
    const currentDate = new Date()

    await prisma.room.create({
        data: {
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
            userId: userId,
            user: req.user,
            videoUrl,
            updatedAt: currentDate,
            school: {
                connect:{
                    schoolName: school
                }
            }
        }
    })

    return res.status(200).json("The Room has been listed.")
}

export async function get_all_rooms(req: Request, res: Response): Promise<any>{
  const user = req.user
  const searchedText = req.query.search
  if(searchedText){
    const rooms = await prisma.room.findMany({
        where: { 
            OR:[
                { propertyType: {search: `%${searchedText}%`} },
                { description: {search: `%${searchedText}%`} },
            ],
            schoolId: user.school.schoolId
        },
      })
    return res.status(200).json(rooms)
  }
  const allRooms = await prisma.room.findMany({ where: { schoolId: user.school.schoolId } })
  return res.status(200).json(allRooms)
}

export async function get_a_room(req: Request, res: Response): Promise<any>{
    const user = req.user
    const roomId = Number(req.params.roomId)

    const room = await prisma.room.findUnique({ 
        where: { 
            roomId: roomId,
            schoolId: user.school.schoolId
        },
    })

    if(!room){
        return res.status(400).json("Room does not exist.")
    }

    const business = await prisma.business.findUnique({ where: { userId: room.userId }})
    if(business){
        return res.status(200).json({
            ...room,
            phoneNumber: business.phoneNumber,
            business: true
        })
    }
    const owner = await prisma.user.findUnique({ where: {userId: room?.userId} })

    return res.status(200).json({
        ...room,
        phoneNumber: owner?.phoneNumber,
        user: true
    })
}

export async function delete_room(req: Request, res: Response): Promise<any>{
    const user = req.user
    const roomId = Number(req.params.roomId)

    const oldRoom = await prisma.room.findFirst({ where: { roomId: roomId, userId: user.userId  } })
        
    if(!oldRoom){
        return res.status(400).json("Unauthorized.")
    }

    
    await prisma.room.delete({ where: { roomId: roomId, userId: user.userId  } })

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
    const roomId = Number(req.params.roomId)

    const room = await prisma.room.findFirst({where: { userId: user.userId, roomId: roomId }})

    if(!room){
        return res.status(400).json("invalid input.")
    }

    await prisma.room.update({
        where: { userId: user.userId, roomId: roomId },
            data: {
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
            }
    })

    return res.status(200).json("The Room has been listed.")
}