import { Request, Response, } from "express";
import { Lodge } from "../models/lodge";

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
        imagesUrlArrayString
      } = req.body
    const userId = req.user.userId
    
    if(
        !propertyType||
        !paymentFrequency ||
        !price ||
        !priceType ||
        !location ||
        !nearestSchool ||
        !walkingTime ||
        !kekeTime ||
        !description || 
        !networkQuality || 
        !phoneNumber || phoneNumber >= 9999999999 
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
      imagesUrlArrayString: imagesUrlArrayString
    })
    await newLodge.save()
    return res.status(200).json("The lodge has been listed.")
}

export async function all_lodges(req: Request, res: Response): Promise<any>{
  const user = req.user
  const allLodges = await Lodge.findAll({where: { nearestSchool: user.school }})
  return res.status(200).json(allLodges)
}