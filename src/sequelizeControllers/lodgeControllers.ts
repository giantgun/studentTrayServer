import { Request, Response, } from "express";
import { Lodge } from "../models/lodge";
import { Business } from "../models/business";
import { User } from "../models/user";
import { Op } from "@sequelize/core";

export async function list_lodge(req: Request, res: Response): Promise<any>{
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

    const newLodge = new Lodge({
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
      phoneNumber: phoneNumber,
      userId: userId,
      numberAvailable: numberOfLodges,
      imagesUrlArrayString: imagesUrlArrayString,
      agentFee: agentFee,
      videoUrl,
    })
    await newLodge.save()
    return res.status(200).json("The lodge has been listed.")
}

export async function get_all_lodges(req: Request, res: Response): Promise<any>{
  const user = req.user
  const searchedText = req.query.search
    if(searchedText){
      const lodges = await Lodge.findAll({
          where: {
          propertyType: { [Op.like]: `%${searchedText}%` },
          nearestSchool: user.school
        },
      })
      return res.status(200).json(lodges)
    }
  const allLodges = await Lodge.findAll({where: { nearestSchool: user.school }})
  return res.status(200).json(allLodges)
}

export async function get_a_lodge(req: Request, res: Response): Promise<any>{
    const user = req.user
    const lodgeId = req.params.lodgeId

    const lodge= await Lodge.findOne({where: { nearestSchool: user.school, lodgeId: lodgeId }})
    const business = await Business.findOne({where: { userId: lodge?.userId }})
        if(business){
            return res.status(200).json({
                ...lodge?.dataValues,
                phoneNumber: business.phoneNumber
            })
        }
        const owner = await User.findOne({ where: {userId: lodge?.userId} })
    
        return res.status(200).json({
            ...lodge?.dataValues,
            phoneNumber: owner?.phoneNumber
        })
}

export async function delete_lodge(req: Request, res: Response): Promise<any>{
    const user = req.user
    const lodgeId = req.params.lodgeId

    const oldLodge = await Lodge.findOne({ where: { lodgeId: lodgeId, userId: user.userId  } })
        
    if(!oldLodge){
        return res.status(400).json("Invalid Input.")
    }
    
    await Lodge.destroy({where: {
        userId: user.userId,
        propertyType: oldLodge.dataValues.propertyType,
        numberOfBedrooms: oldLodge.dataValues.numberOfBedrooms,
        numberOfBathrooms : oldLodge.dataValues.numberOfBathrooms,
        paymentFrequency: oldLodge.dataValues.paymentFrequency,
        price: oldLodge.dataValues.price,
        priceType: oldLodge.dataValues.priceType,
        location: oldLodge.dataValues.location,
        nearestSchool: oldLodge.dataValues.nearestSchool,
        walkingTime: oldLodge.dataValues.walkingTime,
        kekeTime: oldLodge.dataValues.kekeTime,
        description: oldLodge.dataValues.description,
        WiFi: oldLodge.dataValues.WiFi,
        parking: oldLodge.dataValues.parking,
        electricity: oldLodge.dataValues.electricity,
        water: oldLodge.dataValues.water,
        electricityDescription: oldLodge.dataValues.electricityDescription,
        waterDescription: oldLodge.dataValues.waterDescription,
        networkQuality: oldLodge.dataValues.networkQuality,
        networkDescription: oldLodge.dataValues.networkDescription,
        phoneNumber: oldLodge.dataValues.phoneNumber,
        imagesUrlArrayString: oldLodge.dataValues.phoneNumber,
        numberAvailable: oldLodge.dataValues.numberAvailable,
        agentFee: oldLodge.dataValues.agentFee,
        videoUrl: oldLodge.dataValues.videoUrl,
       
      }})
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
  const userId = req.user.userId
  const lodgeId = req.params.lodgeId

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

  const lodge = await Lodge.findOne({where: { userId: userId, lodgeId: lodgeId }})
  
  if(!lodge){
      return res.status(400).json("invalid input.")
  }

  lodge!.propertyType = propertyType
  lodge!.numberOfBedrooms = numberOfBedrooms
  lodge!.numberOfBathrooms = numberOfBathrooms
  lodge!.paymentFrequency = paymentFrequency
  lodge!.price = price
  lodge!.priceType = priceType
  lodge!.location = location
  lodge!.nearestSchool = nearestSchool
  lodge!.walkingTime = walkingTime
  lodge!.kekeTime = kekeTime
  lodge!.description = description
  lodge!.WiFi = WiFi
  lodge!.parking = parking
  lodge!.electricity = electricity
  lodge!.water = water
  lodge!.electricityDescription = electricityDescription
  lodge!.waterDescription = waterDescription
  lodge!.networkQuality = networkQuality
  lodge!.networkDescription = networkDescription
  lodge!.phoneNumber = phoneNumber
  lodge!.userId = userId
  lodge!.numberAvailable = numberOfLodges
  lodge!.imagesUrlArrayString = imagesUrlArrayString
  lodge!.agentFee = agentFee

  await lodge!.save()
  return res.status(200).json("The lodge has been listed.")
}