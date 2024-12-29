import { Request, Response, NextFunction } from "express"
import { Item } from "../models/item"

export async function list_item(req: Request, res: Response): Promise<any>{
    const {
        imagesUrlArrayString,
        title,
        description,
        price,
        condition,
        category
    } = req.body
    const userId = req.user.userId

    const newItem = new Item({
        imagesUrlArrayString,
        title,
        description,
        price,
        condition,
        category,
        userId
    })
    await newItem.save()
    return res.status(200).json("The Item has been listed succesfully.")
}