import { Request, Response } from "express";
import { Service } from "../models/service";

export async function list_service(req: Request, res: Response): Promise<any>{
    const {
        title,
        description,
        price,
        category,
        online,
        inPerson,
        availability,
        imagesUrlArrayString,
        schoolArray
    } = req.body
    const userId = req.user.userId

    if(
        schoolArray.length < 1 ||
        !title ||
        !description ||
        !price || price <= 0 ||
        !category ||
        (!online && !inPerson) ||
        !availability ||
        !imagesUrlArrayString || imagesUrlArrayString.split(",").length <= 1
    ){
        return res.status(400).json("Invalid input.")
    }
    const jsonStingifiedAvailabilty = JSON.stringify(availability)

    for (let i = 0; i < schoolArray.length ; i++) {
        const newService = new Service({
            title: title,
            description: description,
            price: price,
            category: category,
            online: online,
            inPerson: inPerson,
            jsonStingifiedAvailabilty: jsonStingifiedAvailabilty,
            imagesUrlArrayString: imagesUrlArrayString,
            userId: userId,
            school: schoolArray[i]
        })
    
        await newService.save()
    }

    return res.status(200).json("Service listed successfully.")
}

export async function get_all_services(req: Request, res: Response): Promise<any>{
  const user = req.user

  const allServices= await Service.findAll({where: { school: user.school }})
  return res.status(200).json(allServices)
}

export async function get_a_service(req: Request, res: Response): Promise<any>{
    const user = req.user
    const serviceId = req.params.serviceId

    const service= await Service.findOne({where: { school: user.school, ServiceId: serviceId }})
    return res.status(200).json(service)
}