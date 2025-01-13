import { NextFunction, Request, Response } from "express"
import { Item } from "../models/item"
import { Business } from "../models/business"
import { User } from "../models/user"
import { Op } from "@sequelize/core"

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

    for (let i = 0; i < schoolArray.length; i++) {
        const newItem = new Item({
            videoUrl,
            imagesUrlArrayString,
            title,
            description,
            price,
            condition,
            category,
            userId,
            numberInStock,
            school: schoolArray[i]
        })
        await newItem.save()
    }
    return res.status(200).json("The Item has been listed succesfully.")
}

export async function get_all_items(req: Request, res: Response): Promise<any>{
  const user = req.user
  const searchedText = req.query.search
    if(searchedText){
      const items = await Item.findAll({
          where: {
          title: { [Op.like]: `%${searchedText}%` },
          school: user.school
        },
      })
      return res.status(200).json(items)
    }

  const allItems = await Item.findAll({where: { school: user.school }})
  return res.status(200).json(allItems)
}

export async function get_an_item(req: Request, res: Response): Promise<any>{
    const user = req.user
    const itemId = req.params.itemId

    const item = await Item.findOne({where: { school: user.school, itemId: itemId }})
    const business = await Business.findOne({where: { userId: item?.userId }})
    if(business){
        return res.status(200).json({
            ...item?.dataValues,
            phoneNumber: business.phoneNumber
        })
    }
    const owner = await User.findOne({ where: {userId: item?.userId} })

    return res.status(200).json({
        ...item?.dataValues,
        phoneNumber: owner?.phoneNumber
    })
}

export async function delete_item(req: Request, res: Response): Promise<any>{
    const user = req.user
    const itemId = req.params.itemId

    const oldItem = await Item.findOne({ where: { itemId: itemId, userId: user.userId  } })
    
    if(!oldItem){
        return res.status(400).json("Invalid Input.")
    }

    await Item.destroy({where: { 
        userId: user.userId,
        videoUrl: oldItem.dataValues.videoUrl,
        imagesUrlArrayString: oldItem.dataValues.imagesUrlArrayString,
        title: oldItem.dataValues.title,
        description: oldItem.dataValues.description,
        price: oldItem.dataValues.price,
        condition: oldItem.dataValues.condition,
        category: oldItem.dataValues.category,
        numberInStock: oldItem.dataValues.numberInStock
    }})

    return res.status(200).json("The item has been deleted successfully.")
}

export async function get_item_images_url_for_delete(req: Request, res: Response, next: NextFunction): Promise<any>{
    const user = req.user
    const itemId = req.params.itemId

    if(!itemId || Number.isInteger(itemId) ){
        return res.status(400).json("Invalid Input.")
    }

    const oldItem = await Item.findOne({ where: { itemId: itemId, userId: user.userId  } })
    
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
    const itemId = req.params.itemId

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

    const oldItem = await Item.findOne({where:{
        itemId: itemId,
        userId
    }})
    
    if(!oldItem){
        return res.status(400).json("invalid input.")
    }
    
    const imagesUrlArrayString = oldItem?.dataValues.imagesUrlArrayString

    const items = await Item.findAll({where: {
        title: oldItem?.title,
        description: oldItem?.description,
        price: oldItem?.price,
        category: oldItem?.category,
        imagesUrlArrayString: oldItem?.imagesUrlArrayString,
        condition: oldItem?.condition,
        numberInStock: oldItem?.numberInStock,
        userId
    }})
    
    if (items.length < schoolArray.length){
        for (let i = 0; i < items.length ; i++) {
        
            items[i]!.title = title
            items[i]!.description = description
            items[i]!.price = price
            items[i]!.category = category
            items[i]!.imagesUrlArrayString = imagesUrlArrayString
            items[i]!.school = schoolArray[i]
            items[i]!.numberInStock = numberInStock
            items[i]!.condition = condition
    
            await items[i]!.save()
        }
        for (let i = 0; i < schoolArray.slice(items.length).length ; i++) {
            for (let i = 0; i < schoolArray.length - 1; i++) {
                const newItem = new Item({
                    imagesUrlArrayString,
                    title,
                    description,
                    price,
                    condition,
                    category,
                    userId,
                    numberInStock,
                    school: schoolArray[i+items.length]
                })
                await newItem.save()
            }
        }
    }else if(items.length === schoolArray.length){
        for (let i = 0; i < items.length ; i++) {
        
            items[i]!.title = title
            items[i]!.description = description
            items[i]!.price = price
            items[i]!.category = category
            items[i]!.imagesUrlArrayString = imagesUrlArrayString
            items[i]!.school = schoolArray[i]
            items[i]!.numberInStock = numberInStock
            items[i]!.condition = condition
    
            await items[i]!.save()
        }
    }else if(items.length > schoolArray.length){
        for (let i = 0; i < schoolArray.length ; i++) {
        
            items[i]!.title = title
            items[i]!.description = description
            items[i]!.price = price
            items[i]!.category = category
            items[i]!.imagesUrlArrayString = imagesUrlArrayString
            items[i]!.school = schoolArray[i]
            items[i]!.numberInStock = numberInStock
            items[i]!.condition = condition
    
            await items[i]!.save()
        }
        for (let i = 0; i < items.slice(schoolArray.length).length ; i++){
            items[i+schoolArray.length].destroy()
        }
    }

    return res.status(200).json("Item edited successfully.")
}

export async function get_an_item_for_edit(req: Request, res: Response): Promise<any>{
    const userId = req.user.userId
    const itemId = req.params.itemId

    const oldItem = await Item.findOne({where:{
        itemId: itemId,
        userId
    }})
    
    if(!oldItem){
        return res.status(400).json("invalid input.")
    }

    const items = await Item.findAll({where: {
        title: oldItem?.title,
        description: oldItem?.description,
        price: oldItem?.price,
        category: oldItem?.category,
        imagesUrlArrayString: oldItem?.imagesUrlArrayString,
        condition: oldItem?.condition,
        numberInStock: oldItem?.numberInStock,
        userId
    }})

    return res.status(200).json(items)
}