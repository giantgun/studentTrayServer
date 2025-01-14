import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

const prisma  = new PrismaClient()

export async function list_lodge(req: Request, res: Response): Promise<any>{
    const {
        propertyType,
        numberOfBedlodges,
        numberOfBathlodges,
        paymentFrequency,
        price,
        priceType,
        location,
        nearestSchool,
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
        phoneNumber,
        imagesUrlArrayString,
        numberOfLodges,
        agentFee,
        videoUrl,
      } = req.body
    const userId = req.user.userId
    
    if(
        !propertyType||
        !paymentFrequency ||
        !numberOfLodges ||
        !price ||
        !priceType ||
        !location ||
        !nearestSchool ||
        !walkingTime ||
        !kekeTime ||
        !agentFee ||
        !description || 
        !networkQuality || 
        !phoneNumber || phoneNumber >= 9999999999 ||
        !imagesUrlArrayString || imagesUrlArrayString.split(",").length <= 1
    ){
        return res.status(400).json("Invalid input.")
    }

    const currentDate = new Date()
    await prisma.lodge.create({
      data: {
        propertyType: propertyType,
        numberOfBedrooms: numberOfBedlodges,
        numberOfBathrooms: numberOfBathlodges,
        paymentFrequency: paymentFrequency,
        price: price,
        priceType: priceType,
        location: location,
        nearestSchool: nearestSchool,
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
        userId: userId,
        numberOfLodges,
        imagesUrlArrayString: imagesUrlArrayString,
        agentFee: agentFee,
        videoUrl,
        updatedAt: currentDate,
        user: req.user,
        school: {
            connect:{
                schoolName: nearestSchool
            }
        }
      }
    })
    return res.status(200).json("The lodge has been listed.")
}

export async function get_all_lodges(req: Request, res: Response): Promise<any>{
    const user = req.user
    const searchedText = req.query.search
    if(searchedText){
      const lodges = await prisma.lodge.findMany({
          where: { 
              OR:[
                  { propertyType: {search: `%${searchedText}%`} },
                  { description: {search: `%${searchedText}%`} },
              ],
              schoolId: user.school.schoolId
          },
        })
      return res.status(200).json(lodges)
    }
    const allLodges = await prisma.lodge.findMany({ where: { schoolId: user.school.schoolId } })
    return res.status(200).json(allLodges)
}

export async function get_a_lodge(req: Request, res: Response): Promise<any>{
    const user = req.user
    const lodgeId = Number(req.params.lodgeId)

    const lodge = await prisma.lodge.findUnique({ 
        where: { 
            lodgeId: lodgeId,
            schoolId: user.school.schoolId
        },
    })

    if(!lodge){
        return res.status(400).json("Lodge does not exist.")
    }

    const business = await prisma.business.findUnique({ where: { userId: lodge.userId }})
    if(business){
        return res.status(200).json({
            ...lodge,
            phoneNumber: business.phoneNumber,
            business: true
        })
    }
    const owner = await prisma.user.findUnique({ where: {userId: lodge?.userId} })

    return res.status(200).json({
        ...lodge,
        phoneNumber: owner?.phoneNumber,
        user: true
    })
}

export async function delete_lodge(req: Request, res: Response): Promise<any>{
    const user = req.user
    const lodgeId = Number(req.params.lodgeId)

    const oldLodge = await prisma.lodge.findFirst({ where: { lodgeId: lodgeId, userId: user.userId  } })
        
    if(!oldLodge){
        return res.status(400).json("Unauthorized.")
    }

    await prisma.lodge.delete({ where: { lodgeId: lodgeId, userId: user.userId  } })

    return res.status(200).json("The lodge has been deleted successfully.")
}

export async function edit_lodge(req: Request, res: Response): Promise<any>{
  const {
      propertyType,
      numberOfBedrooms,
      numberOfBathrooms,
      paymentFrequency,
      price,
      priceType,
      location,
      nearestSchool,
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
      phoneNumber,
      imagesUrlArrayString,
      numberOfLodges,
      agentFee
    } = req.body

  if(
      !propertyType||
      !paymentFrequency ||
      !numberOfLodges ||
      !price ||
      !priceType ||
      !location ||
      !nearestSchool ||
      !walkingTime ||
      !kekeTime ||
      !agentFee ||
      !description || 
      !networkQuality || 
      !phoneNumber || phoneNumber >= 9999999999 ||
      !imagesUrlArrayString || imagesUrlArrayString.split(",").length <= 1
  ){
      return res.status(400).json("Invalid input.")
  }

  const user = req.user
    const lodgeId = Number(req.params.lodgeId)

    const lodge = await prisma.lodge.findFirst({where: { userId: user.userId, lodgeId: lodgeId }})

    if(!lodge){
        return res.status(400).json("invalid input.")
    }

    await prisma.lodge.update({
        where: { userId: user.userId, lodgeId: lodgeId },
        data: {
            propertyType: propertyType,
            numberOfBedrooms: numberOfBedrooms,
            numberOfBathrooms: numberOfBathrooms,
            paymentFrequency: paymentFrequency,
            price: price,
            priceType: priceType,
            location: location,
            nearestSchool: nearestSchool,
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
            userId: user.userId,
            numberOfLodges: numberOfLodges,
            imagesUrlArrayString: imagesUrlArrayString,
            agentFee: agentFee,
        }
    })

  return res.status(200).json("The lodge has been edited.")
}