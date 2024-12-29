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
    } = req.body
    const userId = req.user.userId

    if(
        !title ||
        !description ||
        !price || price <= 0 ||
        !category ||
        (!online && !inPerson) ||
        !availability ||
        !imagesUrlArrayString
    ){
        return res.status(400).json("Invalid input.")
    }
    const jsonStingifiedAvailabilty = JSON.stringify(availability)

    const newService = new Service({
        title: title,
        description: description,
        price: price,
        category: category,
        online: online,
        inPerson: inPerson,
        jsonStingifiedAvailabilty: jsonStingifiedAvailabilty,
        imagesUrlArrayString: imagesUrlArrayString,
        userId: userId
    })

    await newService.save()
    return res.status(200).json("Service listed successfully.")
}