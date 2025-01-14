import { Request, Response } from "express"
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
                { title: {search: `%${searchedText}%`}},
                { description: {search: `%${searchedText}%`}},
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

    const deleteServiceSchoolRecord = await prisma.service_school.deleteMany({ where: { serviceId: serviceId } })
    const deleteService = await prisma.service.deleteMany({ where: { serviceId: serviceId, userId: user.userId  } })

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

    const deleteServiceSchoolRecord = await prisma.service_school.deleteMany({ where: { serviceId: serviceId } })

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
    const editService = await prisma.service.update({
        where:{
        serviceId: serviceId,
        userId: userId
        },
        data: {
            title: title,
            description: description,
            price: price,
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