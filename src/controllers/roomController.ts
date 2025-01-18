import { NextFunction, Request, Response } from "express"
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
            numberOfBedrooms: Number(numberOfBedrooms),
            numberOfBathrooms: Number(numberOfBathrooms),
            paymentFrequency: paymentFrequency,
            price: Number(price),
            priceType: priceType,
            location: location,
            nearestSchool: school,
            walkingTime: Number(walkingTime),
            kekeTime: Number(kekeTime),
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
            videoUrl,
            updatedAt: currentDate,
            user: {
                connect: {
                    userId: userId
                }
            },
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
            owner: "business"
        })
    }
    const owner = await prisma.user.findUnique({ where: {userId: room?.userId} })

    return res.status(200).json({
        ...room,
        phoneNumber: owner?.phoneNumber,
        owner: "user"
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
        !additionalInfo
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
                walkingTime: Number(walkingTime),
                kekeTime: Number(kekeTime),
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
                school: {
                    connect: {
                        schoolName: school
                    }
                },
            }
    })

    return res.status(200).json("The Room has been edited.")
}

export async function get_a_room_for_edit(req: Request, res: Response): Promise<any>{
    const roomId = Number(req.params.roomId)

    const room = await prisma.room.findUnique({ 
        where: { roomId: roomId },
        include: {
            school: true
        }
    })

    return res.status(200).json(room)
}

export async function get_room_image_url_for_overwrite(req: Request, res: Response, next: NextFunction): Promise<any>{
    const user = req.user
    const roomId = Number(req.params.roomId)
    const selectedIndex = req.params.selectedIndex

    const rooms = user.room

    function getImagesUrlArrayString(){
        for (let i = 0; i < rooms.length ; i++){
            if(rooms[i].roomId === roomId){
                return rooms[i].imagesUrlArrayString
            }
        }
        return null
    }
    
    let imagesUrlArrayString = getImagesUrlArrayString()

    if(!imagesUrlArrayString){
        return res.status(403).json("forbidden")
    }

    let imagesUrlArray = imagesUrlArrayString.split(",") 

    req.urlToOverwrite = imagesUrlArray[selectedIndex]
    next()
}

export async function save_room_image_url(req: Request, res: Response): Promise<any>{
    const user = req.user
    const roomId = Number(req.params.roomId)
    const selectedIndex = req.params.selectedIndex
    const { imageUrl } = req.body

    const rooms = user.room
    function getImagesUrlArrayString(){
        for (let i = 0; i < rooms.length ; i++){
            if(rooms[i].roomId === roomId){
                return rooms[i].imagesUrlArrayString
            }
        }
        return null
    }

    let imagesUrlArrayString = getImagesUrlArrayString()

    if(!imagesUrlArrayString){
        return res.status(403).json("Unauthorized")
    }

    let imagesUrlArray = imagesUrlArrayString.split(",")
    imagesUrlArray[selectedIndex] = imageUrl

    imagesUrlArrayString = imagesUrlArray.toString()

    await prisma.room.update({ 
        where: { 
            userId: user.userId,
            roomId: Number(roomId)
        },
        data: {
            imagesUrlArrayString: imagesUrlArrayString
        }
    })

    return res.json("Upload succesful.")
}

export async function get_room_images_url_for_delete(req: Request, res: Response, next: NextFunction): Promise<any>{
    const user = req.user
    const roomId = Number(req.params.roomId)

    if(!roomId ||!Number.isInteger(roomId) ){
        return res.status(400).json("Invalid Input.")
    }

    const oldroom = await prisma.room.findFirst({ where: { roomId: roomId, userId: user.userId  } })
    
    if(!oldroom){
        return res.status(400).json("Item has been deleted, or never existed.")
    }
    req.urlArrayToDelete = oldroom.imagesUrlArrayString.split(",")
    next()
}