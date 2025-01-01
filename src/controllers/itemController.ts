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