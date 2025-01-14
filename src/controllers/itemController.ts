import { NextFunction, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { IsProductAllowed } from "../utils/utils"

const prisma  = new PrismaClient()

export async function list_item(req: Request, res: Response): Promise<any>{
    const {
        videoUrl,
        imagesUrlArrayString,
        title,
        description,
        price,
        condition,
        category,
        schoolArray,
        numberInStock
    } = req.body
    const userId = req.user.userId

    if(
        !imagesUrlArrayString || imagesUrlArrayString.split(",").length <= 1 ||
        !title ||
        !description ||
        !price ||
        !condition ||
        !category ||
        !schoolArray ||
        !numberInStock
    ){
        return res.status(400).json("Invalid Input.")
    }

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
    await prisma.item.create({
        data: {
            user: req.user,
            videoUrl,
            imagesUrlArrayString,
            title,
            description,
            price,
            condition,
            category,
            userId,
            numberInStock,
            updatedAt: currentDate,
            item_school: {
                create: saveSchools
            }
        }
    })
    return res.status(200).json("The Item has been listed succesfully.")
}

export async function get_all_items(req: Request, res: Response): Promise<any>{
    const user = req.user
    const searchedText = req.query.search
    if(searchedText){
      const items= await prisma.item.findMany({
        where: { 
            OR:[
                { title: {search: `%${searchedText}%`}},
                { description: {search: `%${searchedText}%`}},
            ],
            item_school: {
                some:{
                    schoolId: user.school.schoolId
                }
            }
            
        },
      })
      return res.status(200).json(items)
      }
  
  
    const allItems = await prisma.item.findMany({ where: { item_school: { some:{ schoolId: user.school.schoolId } } } })
    return res.status(200).json(allItems)
}

export async function get_an_item(req: Request, res: Response): Promise<any>{
    const user = req.user
    const itemId = Number(req.params.itemId)

    const item = await prisma.item.findUnique({ 
        where: { itemId: itemId },
        include: {
            item_school: true
        }
    })

    if(!item?.item_school){
        return res.status(400).json("Item does not exist.")
    }

    if(!IsProductAllowed(item.item_school, user.school.schoolId)){
        return res.json("Item does not exist.")
    }

    const business = await prisma.business.findUnique({ where: { userId: item?.userId }})
    if(business){
        return res.status(200).json({
            ...item,
            phoneNumber: business.phoneNumber,
            owner: "business"
        })
    }
    const owner = await prisma.user.findUnique({ where: {userId: item?.userId} })

    return res.status(200).json({
        ...item,
        phoneNumber: owner?.phoneNumber,
        owner: "user"
    })
}

export async function delete_item(req: Request, res: Response): Promise<any>{
    
    const user = req.user
    const itemId = Number(req.params.itemId)

    const oldItem = await prisma.item.findFirst({ where: { itemId: itemId, userId: user.userId  } })
        
    if(!oldItem){
        return res.status(400).json("Unauthorized.")
    }

    const deleteItemSchoolRecord = await prisma.item_school.deleteMany({ where: { itemId: itemId } })
    const deleteItem = await prisma.item.deleteMany({ where: { itemId: itemId, userId: user.userId  } })

    await prisma.$transaction([deleteItemSchoolRecord, deleteItem] as any) 

    return res.status(200).json("The item has been deleted successfully.")
}

export async function get_item_images_url_for_delete(req: Request, res: Response, next: NextFunction): Promise<any>{
    const user = req.user
    const itemId = Number(req.params.itemId)

    if(!itemId || Number.isInteger(itemId) ){
        return res.status(400).json("Invalid Input.")
    }

    const oldItem = await prisma.item.findFirst({ where: { itemId: itemId, userId: user.userId  } })
    
    if(!oldItem){
        return res.status(400).json("Item has been deleted, or never existed.")
    }
    req.urlArrayToDelete = oldItem.imagesUrlArrayString.split(",")
    next()
}

export async function edit_item(req: Request, res: Response): Promise<any>{
    const {
        title,
        description,
        price,
        condition,
        category,
        schoolArray,
        numberInStock
    } = req.body
    const userId = req.user.userId
    const itemId = Number(req.params.itemId)

    if(
        !title ||
        !description ||
        !price ||
        !condition ||
        !category ||
        !schoolArray ||
        !numberInStock
    ){
        return res.status(400).json("Invalid Input.")
    }

    const oldItem = await prisma.item.findFirst({where:{
        itemId: itemId,
        userId: userId
    }})

    if(!oldItem){
        return res.status(400).json("Item does not exist.")
    }

    const deleteItemSchoolRecord = await prisma.item_school.deleteMany({ where: { itemId: itemId } })

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
    const editItem = await prisma.item.update({
        where:{
        itemId: itemId,
        userId: userId
        },
        data: {
            title: title,
            description: description,
            price: price,
            category: category,
            condition: condition,
            numberInStock: numberInStock,
            userId,
            updatedAt: currentDate,
            item_school: {
                create: saveSchools
            }
        }
    })

    await prisma.$transaction([deleteItemSchoolRecord, editItem] as any)

    return res.status(200).json("Item edited successfully.")
}

export async function get_an_item_for_edit(req: Request, res: Response): Promise<any>{
    const user = req.user
    const itemId = Number(req.params.itemId)

    const item = await prisma.item.findUnique({ 
        where: { itemId: itemId },
        include: {
            item_school: true
        }
    })

    if(!item?.item_school){
        return res.status(400).json("Item does not exist.")
    }

    return res.status(200).json(item)
}