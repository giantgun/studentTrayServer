import { Request, Response, } from "express"
import { Review } from "../models/reviews"

export async function create_user_review(req: Request, res: Response): Promise<any>{
    const { numberOfStars, description } = req.body
    const userId = Number(req.params.userId)

    const newReview = new Review({
        numberOfStars,
        description,
        userId,
    })
    await newReview.save()
    return res.status(200).json("You've successfully reviewed the user.")
}

export async function create_business_review(req: Request, res: Response): Promise<any>{
    const { numberOfStars, description } = req.body
    const businessId = Number(req.params.businessId)

    const newReview = new Review({
        numberOfStars,
        description,
        businessId,
    })
    await newReview.save()
    return res.status(200).json("You've successfully reviewed the user.")
}