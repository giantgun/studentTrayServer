import { Request, Response } from "express"
const cloudinary = require('cloudinary').v2
require('dotenv').config()

export async function get_image_signature(req: Request, res: Response): Promise<any>{
    const timestamp = Math.round((new Date).getTime()/1000)

    console.log('Timestamp:',timestamp)
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
    const eager = 'w_400,h_300,c_pad|w_260,h_200,c_crop'
    const api_key = process.env.CLOUDINARY_API_KEY

    const optionsForSignature = {
        timestamp,
        eager,
    }

    const signature = cloudinary.utils.api_sign_request(
        optionsForSignature,
        process.env.CLOUDINARY_API_SECRET
    )

    console.log('Signature:', signature)
    return res.json({
        signature,
        cloud_name,
        eager,
        api_key,
        timestamp
    })
}