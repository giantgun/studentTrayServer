import { NextFunction, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { IsProductAllowed } from "../utils/utils"

const prisma  = new PrismaClient()

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
        schoolArray,
        videoUrl,
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

    const saveSchools = schoolArray.map((school: string) => (
        {
            school: {
                connect:{
                    schoolName: school
                }
            }
        }
    ))

    const currentDate = new Date()
    await prisma.service.create({
        data: {
            title: title,
            description: description,
            price: Number(price),
            category: category,
            online: online,
            inPerson: inPerson,
            jsonStingifiedAvailabilty: jsonStingifiedAvailabilty,
            imagesUrlArrayString: imagesUrlArrayString,
            userId: userId,
            priceType: priceType,
            videoUrl,
            updatedAt: currentDate,
            service_school: {
                create: saveSchools
            }
        }
    })

    return res.status(200).json("Service listed successfully.")
}

export async function get_all_services(req: Request, res: Response): Promise<any>{
    const user = req.user
    const searchedText = req.query.search
    if(searchedText){
      const services= await prisma.service.findMany({
        where: { 
            OR:[
                { title: {contains: `%${searchedText}%`}},
                { description: {contains: `%${searchedText}%`}},
            ],
            service_school: {
                some:{
                    schoolId: user.school.schoolId
                }
            }
            
        },
      })
      return res.status(200).json(services)
      }
  
  
    const allServices = await prisma.service.findMany({ where: { service_school: { some:{ schoolId: user.school.schoolId } } } })
    return res.status(200).json(allServices)
}

export async function get_a_service(req: Request, res: Response): Promise<any>{
    const user = req.user
    const serviceId = Number(req.params.serviceId)

    const service = await prisma.service.findUnique({ 
        where: { serviceId: serviceId },
        include: {
            service_school: true
        }
    })

    if(!service?.service_school){
        return res.status(400).json("Service does not exist.")
    }

    if(!IsProductAllowed(service.service_school, user.school.schoolId)){
        return res.json("Service does not exist.")
    }

    const business = await prisma.business.findUnique({ where: { userId: service?.userId }})
    if(business){
        return res.status(200).json({
            ...service,
            phoneNumber: business.phoneNumber,
            owner: "business"
        })
    }
    const owner = await prisma.user.findUnique({ where: {userId: service?.userId} })

    return res.status(200).json({
        ...service,
        phoneNumber: owner?.phoneNumber,
        owner: "user"
    })
}

export async function delete_service(req: Request, res: Response): Promise<any>{
    const user = req.user
    const serviceId = Number(req.params.serviceId)

    const oldService = await prisma.service.findFirst({ where: { serviceId: serviceId, userId: user.userId  } })
        
    if(!oldService){
        return res.status(400).json("Unauthorized.")
    }

    const deleteServiceSchoolRecord = prisma.service_school.deleteMany({ where: { serviceId: serviceId } })
    const deleteService = prisma.service.deleteMany({ where: { serviceId: serviceId, userId: user.userId  } })

    await prisma.$transaction([deleteServiceSchoolRecord, deleteService] as any) 

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
        schoolArray,
        priceType
    } = req.body
    const userId = req.user.userId
    const serviceId = Number(req.params.serviceId)

    if(
        schoolArray.length < 1 ||
        !title ||
        !priceType ||
        !description ||
        !price || price <= 0 ||
        !category ||
        (!online && !inPerson) ||
        !availability
    ){
        return res.status(400).json("Invalid input.")
    }
    const jsonStingifiedAvailabilty = JSON.stringify(availability)

    const oldService = await prisma.service.findFirst({where:{
        serviceId: serviceId,
        userId: userId
    }})

    if(!oldService){
        return res.status(400).json("Service does not exist.")
    }

    const deleteServiceSchoolRecord = prisma.service_school.deleteMany({ where: { serviceId: serviceId } })

    const saveSchools = schoolArray.map((school: string) => (
        {
            school: {
                connect:{
                    schoolName: school
                }
            }
        }
    ))
    const currentDate = new Date()
    const editService = prisma.service.update({
        where:{
        serviceId: serviceId,
        userId: userId
        },
        data: {
            title: title,
            description: description,
            price: Number(price),
            category: category,
            online: online,
            inPerson: inPerson,
            jsonStingifiedAvailabilty: jsonStingifiedAvailabilty,
            userId: userId,
            priceType: priceType,
            updatedAt: currentDate,
            service_school: {
                create: saveSchools
            }
        }
    })

    await prisma.$transaction([deleteServiceSchoolRecord, editService] as any)

    return res.status(200).json("Service edited successfully.")
}

export async function get_a_service_for_edit(req: Request, res: Response): Promise<any>{
    const serviceId = Number(req.params.serviceId)

    const service = await prisma.service.findUnique({ 
        where: { serviceId: serviceId },
        include: {
            service_school: {
                include: {
                    school: true
                }
            }
        }
    })

    if(!service?.service_school){
        return res.status(403).json("Service does not exist.")
    }

    return res.status(200).json(service)
}

export async function get_service_image_url_for_overwrite(req: Request, res: Response, next: NextFunction): Promise<any>{
    const user = req.user
    const serviceId = Number(req.params.serviceId)
    const selectedIndex = req.params.selectedIndex

    const services = user.service

    function getImagesUrlArrayString(){
        for (let i = 0; i < services.length ; i++){
            if(services[i].serviceId === serviceId){
                return services[i].imagesUrlArrayString
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

export async function save_service_image_url(req: Request, res: Response): Promise<any>{
    const user = req.user
    const serviceId = Number(req.params.serviceId)
    const selectedIndex = req.params.selectedIndex
    const { imageUrl } = req.body

    const services = user.service
    function getImagesUrlArrayString(){
        for (let i = 0; i < services.length ; i++){
            if(services[i].serviceId === serviceId){
                return services[i].imagesUrlArrayString
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

    await prisma.service.update({ 
        where: { 
            userId: user.userId,
            serviceId: Number(serviceId)
        },
        data: {
            imagesUrlArrayString: imagesUrlArrayString
        }
    })

    return res.json("Upload succesful.")
}

export async function get_service_images_url_for_delete(req: Request, res: Response, next: NextFunction): Promise<any>{
    const user = req.user
    const serviceId = Number(req.params.serviceId)

    if(!serviceId ||!Number.isInteger(serviceId) ){
        return res.status(400).json("Invalid Input.")
    }

    const oldService = await prisma.service.findFirst({ where: { serviceId: serviceId, userId: user.userId  } })
    
    if(!oldService){
        return res.status(400).json("Item has been deleted, or never existed.")
    }
    req.urlArrayToDelete = oldService.imagesUrlArrayString.split(",")
    next()
}