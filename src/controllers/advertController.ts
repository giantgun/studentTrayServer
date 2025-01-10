import { Request, Response } from "express"
import { Advert } from "../models/advert"
import { Business } from "../models/business"
import { User } from "../models/user"

export async function create_user_advert(req: Request, res: Response): Promise<any>{
    const {
        imagesUrlArrayString,
        title,
        content,            
        actionWhatsappNumber,
        actionLink,
        actionPhoneNumber,
        schoolArray
    } = req.body
    const userId = req.user.userId

    if(
        !title || 
        !content || 
        !actionWhatsappNumber || 
        !actionLink || 
        !actionPhoneNumber || 
        !schoolArray
    ){
        return res.status(400).json("Invalid Input.")
    }

    for (let i = 0; i < schoolArray.length; i++) {
        const newAdvert = new Advert({
            imagesUrlArrayString,
            title,
            content,            
            userId,
            actionWhatsappNumber,
            actionLink,
            actionPhoneNumber,
            school: schoolArray[i]
        })
        await newAdvert.save()
    }
    return res.status(200).json("The Advert has been created succesfully.")
}

export async function create_business_advert(req: Request, res: Response): Promise<any>{
    const {
        imagesUrlArrayString,
        title,
        content,            
        actionWhatsappNumber,
        actionLink,
        actionPhoneNumber,
        schoolArray
    } = req.body
    const userId = req.user.userId

    const business = await Business.findOne({where: { userId: userId }})

    if(
        !title || 
        !content || 
        !actionWhatsappNumber || 
        !actionLink || 
        !actionPhoneNumber || 
        !schoolArray ||
        !business
    ){
        return res.status(400).json("Invalid Input.")
    }

    for (let i = 0; i < schoolArray.length; i++) {
        const newAdvert = new Advert({
            imagesUrlArrayString,
            title,
            content,            
            businessId: business.businessId,
            actionWhatsappNumber,
            actionLink,
            actionPhoneNumber,
            school: schoolArray[i]
        })
        await newAdvert.save()
    }
    return res.status(200).json("The Advert has been created succesfully.")
}

export async function get_all_adverts(req: Request, res: Response): Promise<any>{
  const user = req.user

  const adverts = await Advert.findAll({where: { school: user.school }})

  let allAdverts = []
  
  for (let i = 0; i < adverts.length ; i++){
    if( adverts[i].dataValues.userId ){
        const owner = await User.findByPk(adverts[i].dataValues.userId)
        const advert = {
            ...adverts[i].dataValues,
            ownerPhotoUrl: owner?.photoUrl,
            username: owner?.username,
        }
        allAdverts.push(advert)
    }else if(adverts[i].dataValues.businessId){
        const owner = await Business.findByPk(adverts[i].dataValues.businessId)
        const advert = {
            ...adverts[i].dataValues,
            ownerPhotoUrl: owner?.photoUrl,
            username: owner?.businessName,
        }
        allAdverts.push(advert)
    }
  }  

  return res.status(200).json(allAdverts)
}

export async function delete_user_advert(req: Request, res: Response): Promise<any>{
    const user = req.user
    const advertId = req.params.advertId

    const adverts = await Advert.findOne({ where: { advertId: advertId, userId: user.userId  } })

    if(!adverts){
        return res.status(400).json("Invalid Input.")
    }

    await Advert.destroy({where: { 
        userId: user.userId, 
        title: adverts.dataValues.title, 
        content: adverts.dataValues.content,
        actionLink: adverts.dataValues.actionLink,
        actionPhoneNumber: adverts.dataValues.actionPhoneNumber,
        actionWhatsappNumber: adverts.dataValues.actionPhoneNumber,
        imagesUrlArrayString: adverts.dataValues.imagesUrlArrayString
    }})

    return res.status(200).json("The advert has been deleted successfully.")
}

export async function delete_business_advert(req: Request, res: Response): Promise<any>{
    const user = req.user
    const advertId = req.params.advertId

    const business = await Business.findOne({ where: { userId: user.userId } })

    if(!business){
        return res.status(400).json("Invalid Input.")
    }

    const adverts = await Advert.findOne({ where: { advertId: advertId, businessId: business.businessId  } })

    if(!adverts){
        return res.status(400).json("Invalid Input.")
    }

    await Advert.destroy({where: { 
        businessId: business.businessId, 
        title: adverts.dataValues.title, 
        content: adverts.dataValues.content,
        actionLink: adverts.dataValues.actionLink,
        actionPhoneNumber: adverts.dataValues.actionPhoneNumber,
        actionWhatsappNumber: adverts.dataValues.actionPhoneNumber,
        imagesUrlArrayString: adverts.dataValues.imagesUrlArrayString
    }})

    return res.status(200).json("The advert has been deleted successfully.")
}

export async function edit_user_advert(req: Request, res: Response): Promise<any>{
    const {
        title,
        content,            
        actionWhatsappNumber,
        actionLink,
        actionPhoneNumber,
        schoolArray
    } = req.body
    const userId = req.user.userId
    const advertId = req.params.advertId

    if(
        !title ||
        !content ||            
        !actionWhatsappNumber ||
        !actionLink ||
        !actionPhoneNumber ||
        !schoolArray
    ){
        return res.status(400).json("Invalid Input.")
    }

    const oldAdvert = await Advert.findOne({where:{
        advertId: advertId, userId: userId
    }})

    if(!oldAdvert){
        return res.status(400).json("invalid input.")
    }

    const imagesUrlArrayString = oldAdvert.dataValues.imagesUrlArrayString

    const adverts = await Advert.findAll({where: {
        title,
        content,            
        actionWhatsappNumber,
        actionLink,
        actionPhoneNumber,
    }})
    
    if (adverts.length < schoolArray.length){
        for (let i = 0; i < adverts.length ; i++) {
            adverts[i]!.title = title
            adverts[i]!.content = content
            adverts[i]!.actionLink = actionLink                          
            adverts[i]!.actionPhoneNumber = actionPhoneNumber
            adverts[i]!.school = schoolArray[i]
            adverts[i]!.actionWhatsappNumber =actionWhatsappNumber
    
            await adverts[i]!.save()
        }

        for (let i = 0; i < schoolArray.slice(adverts.length).length; i++) {
            const newAdvert = new Advert({
                imagesUrlArrayString,
                title,
                content,            
                userId,
                actionWhatsappNumber,
                actionLink,
                actionPhoneNumber,
                school: schoolArray[i+adverts.length]
            })
            await newAdvert.save()
        }
    }else if(adverts.length === schoolArray.length){
        for (let i = 0; i < adverts.length ; i++) {
        
            adverts[i]!.title = title
            adverts[i]!.content = content
            adverts[i]!.actionLink = actionLink                          
            adverts[i]!.actionPhoneNumber = actionPhoneNumber
            adverts[i]!.school = schoolArray[i]
            adverts[i]!.actionWhatsappNumber =actionWhatsappNumber

            await adverts[i]!.save()
        }
    }else if(adverts.length > schoolArray.length){
        for (let i = 0; i < schoolArray.length ; i++) {
        
            adverts[i]!.title = title
            adverts[i]!.content = content
            adverts[i]!.actionLink = actionLink                          
            adverts[i]!.actionPhoneNumber = actionPhoneNumber
            adverts[i]!.imagesUrlArrayString = imagesUrlArrayString
            adverts[i]!.school = schoolArray[i]
            adverts[i]!.actionWhatsappNumber =actionWhatsappNumber
    
            await adverts[i]!.save()
        }
        for (let i = 0; i < adverts.slice(schoolArray.length).length ; i++){
            adverts[i+schoolArray.length].destroy()
        }
    }

    return res.status(200).json("Advert edited successfully.")
}

export async function edit_business_advert(req: Request, res: Response): Promise<any>{
    const {
        title,
        content,            
        actionWhatsappNumber,
        actionLink,
        actionPhoneNumber,
        schoolArray
    } = req.body
    const userId = req.user.userId
    const advertId = req.params.advertId

    if(
        !title ||
        !content ||            
        !actionWhatsappNumber ||
        !actionLink ||
        !actionPhoneNumber ||
        !schoolArray
    ){
        return res.status(400).json("Invalid Input.")
    }

    const business = await Business.findOne({ where: { userId: userId } })

    if(!business){
        return res.status(400).json("Invalid Input.")
    }

    const oldAdvert = await Advert.findOne({where:{
        advertId: advertId, businessId: business.businessId
    }})

    if(!oldAdvert){
        return res.status(400).json("invalid input.")
    }

    const imagesUrlArrayString = oldAdvert.dataValues.imagesUrlArrayString

    const adverts = await Advert.findAll({where: {
        title,
        content,            
        actionWhatsappNumber,
        actionLink,
        actionPhoneNumber,
    }})
    
    if (adverts.length < schoolArray.length){
        for (let i = 0; i < adverts.length ; i++) {
            adverts[i]!.title = title
            adverts[i]!.content = content
            adverts[i]!.actionLink = actionLink                          
            adverts[i]!.actionPhoneNumber = actionPhoneNumber
            adverts[i]!.school = schoolArray[i]
            adverts[i]!.actionWhatsappNumber =actionWhatsappNumber
    
            await adverts[i]!.save()
        }

        for (let i = 0; i < schoolArray.slice(adverts.length).length; i++) {
            const newAdvert = new Advert({
                imagesUrlArrayString,
                title,
                content,            
                businessId: business.businessId,
                actionWhatsappNumber,
                actionLink,
                actionPhoneNumber,
                school: schoolArray[i+adverts.length]
            })
            await newAdvert.save()
        }
    }else if(adverts.length === schoolArray.length){
        for (let i = 0; i < adverts.length ; i++) {
        
            adverts[i]!.title = title
            adverts[i]!.content = content
            adverts[i]!.actionLink = actionLink                          
            adverts[i]!.actionPhoneNumber = actionPhoneNumber
            adverts[i]!.school = schoolArray[i]
            adverts[i]!.actionWhatsappNumber =actionWhatsappNumber

            await adverts[i]!.save()
        }
    }else if(adverts.length > schoolArray.length){
        for (let i = 0; i < schoolArray.length ; i++) {
        
            adverts[i]!.title = title
            adverts[i]!.content = content
            adverts[i]!.actionLink = actionLink                          
            adverts[i]!.actionPhoneNumber = actionPhoneNumber
            adverts[i]!.imagesUrlArrayString = imagesUrlArrayString
            adverts[i]!.school = schoolArray[i]
            adverts[i]!.actionWhatsappNumber =actionWhatsappNumber
    
            await adverts[i]!.save()
        }
        for (let i = 0; i < adverts.slice(schoolArray.length).length ; i++){
            adverts[i+schoolArray.length].destroy()
        }
    }

    return res.status(200).json("Advert edited successfully.")
}