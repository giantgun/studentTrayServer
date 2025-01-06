import { Request, Response } from "express";
import { Service } from "../models/service";
import { Business } from "../models/business";
import { User } from "../models/user";
import { Op } from '@sequelize/core';

export async function list_service(req: Request, res: Response): Promise<any>{
    const {
        title,
        description,
        price,
        priceType,
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
        !priceType ||
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
            school: schoolArray[i],
            priceType: priceType
        })
    
        await newService.save()
    }

    return res.status(200).json("Service listed successfully.")
}

export async function get_all_services(req: Request, res: Response): Promise<any>{
  const user = req.user
  const searchedText = req.query.search
  if(searchedText){
    console.log(searchedText)
    const services = await Service.findAll({
        where: {
          title: { [Op.like]: `%${searchedText}%` },
          school: user.school
        },
    })
    return res.status(200).json(services)
    }


  const allServices= await Service.findAll({where: { school: user.school }})
  return res.status(200).json(allServices)
}

export async function get_a_service(req: Request, res: Response): Promise<any>{
    const user = req.user
    const serviceId = req.params.serviceId

    const service= await Service.findOne({where: { school: user.school, ServiceId: serviceId }})
    const business = await Business.findOne({where: { userId: service?.userId }})
        if(business){
            return res.status(200).json({
                ...service?.dataValues,
                phoneNumber: business.phoneNumber
            })
        }
        const owner = await User.findOne({ where: {userId: service?.userId} })
    
        return res.status(200).json({
            ...service?.dataValues,
            phoneNumber: owner?.phoneNumber
        })
}

export async function delete_service(req: Request, res: Response): Promise<any>{
    const user = req.user
    const serviceId = req.params.serviceId

    await Service.destroy({where: { userId: user.userId, ServiceId: serviceId }})
    return res.status(200).json("The service has been deleted successfully.")
}

export async function edit_service(req: Request, res: Response): Promise<any>{
    const {
        title,
        description,
        price,
        category,
        online,
        inPerson,
        availability,
        imagesUrlArrayString,
        schoolArray,
        priceType
    } = req.body
    const userId = req.user.userId
    const serviceId = req.params.serviceId

    if(
        schoolArray.length < 1 ||
        !title ||
        !priceType ||
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

    const oldService = await Service.findOne({where:{
        ServiceId: serviceId
    }})

    if(!oldService){
        return res.status(400).json("invalid input.")
    }

    const services = await Service.findAll({where: {
        priceType: oldService.priceType,
        title: oldService?.title,
        description: oldService?.description,
        price: oldService?.price,
        category: oldService?.category,
        online: oldService?.online,
        inPerson: oldService?.inPerson,
        jsonStingifiedAvailabilty: oldService?.jsonStingifiedAvailabilty,
        imagesUrlArrayString: oldService?.imagesUrlArrayString,
        userId
    }})
    
    if (services.length < schoolArray.length){
        for (let i = 0; i < services.length ; i++) {
        
            services[i]!.title = title
            services[i]!.description = description
            services[i]!.price = price
            services[i]!.category = category
            services[i]!.online = online
            services[i]!.online = online
            services[i]!.inPerson = inPerson
            services[i]!.jsonStingifiedAvailabilty = jsonStingifiedAvailabilty
            services[i]!.imagesUrlArrayString = imagesUrlArrayString
            services[i]!.school = schoolArray[i]
    
            await services[i]!.save()
        }
        for (let i = 0; i < schoolArray.slice(services.length).length ; i++) {
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
                school: schoolArray[i],
                priceType: priceType
            })
            
            await newService.save()
        }
    }else if(services.length === schoolArray.length){
        for (let i = 0; i < services.length ; i++) {
        
            services[i]!.title = title
            services[i]!.description = description
            services[i]!.price = price
            services[i]!.category = category
            services[i]!.online = online
            services[i]!.online = online
            services[i]!.inPerson = inPerson
            services[i]!.jsonStingifiedAvailabilty = jsonStingifiedAvailabilty
            services[i]!.imagesUrlArrayString = imagesUrlArrayString
            services[i]!.school = schoolArray[i]
    
            await services[i]!.save()
        }
    }else if(services.length > schoolArray.length){
        for (let i = 0; i < schoolArray.length ; i++) {
        
            services[i]!.title = title
            services[i]!.description = description
            services[i]!.price = price
            services[i]!.category = category
            services[i]!.online = online
            services[i]!.online = online
            services[i]!.inPerson = inPerson
            services[i]!.jsonStingifiedAvailabilty = jsonStingifiedAvailabilty
            services[i]!.imagesUrlArrayString = imagesUrlArrayString
            services[i]!.school = schoolArray[i]
    
            await services[i]!.save()
        }
        for (let i = 0; i < services.slice(schoolArray.length).length ; i++){
            services[i].destroy()
        }
    }

    return res.status(200).json("Service edited successfully.")
}