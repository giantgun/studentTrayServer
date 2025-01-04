import { Request, Response } from "express"
import { Item } from "../models/item"

export async function list_item(req: Request, res: Response): Promise<any>{
    const {
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
            school: schoolArray[i]
        })
        await newItem.save()
    }
    return res.status(200).json("The Item has been listed succesfully.")
}

export async function get_all_items(req: Request, res: Response): Promise<any>{
  const user = req.user

  const allItems = await Item.findAll({where: { school: user.school }})
  return res.status(200).json(allItems)
}

export async function get_an_item(req: Request, res: Response): Promise<any>{
    const user = req.user
    const itemId = req.params.itemId

    const item= await Item.findOne({where: { school: user.school, itemId: itemId }})
    return res.status(200).json(item)
}

export async function delete_item(req: Request, res: Response): Promise<any>{
    const user = req.user
    const itemId = req.params.itemId

    await Item.destroy({where: { userId: user.userId, itemId: itemId }})

    return res.status(200).json("The item has been deleted successfully.")
}

export async function edit_item(req: Request, res: Response): Promise<any>{
    const {
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
    const itemId = req.params.itemId

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

    const oldItem = await Item.findOne({where:{
        itemId: itemId
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
                    school: schoolArray[i]
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
            items[i].destroy()
        }
    }

    return res.status(200).json("Item edited successfully.")
}