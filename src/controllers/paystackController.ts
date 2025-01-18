import { Response, Request, NextFunction } from "express"
import https from 'https'

export async function pay_for_item_listing(req: Request, res: Response, next: NextFunction): Promise<any>{
    const user = req.user
    const listedItems = user.item.length
    const numberOfItemsPaidFor = user.itemsPaidFor

    if((listedItems === 0) && (numberOfItemsPaidFor === 0)){
        req.productTier = "free"
        next()
    }else if((numberOfItemsPaidFor - listedItems) > 0){
        req.productTier = "paid"
        next()
    }else if(numberOfItemsPaidFor === listedItems){
        req.productTier = "free"
        next()
    }else if((numberOfItemsPaidFor - listedItems) > 0){
        const stringifiedItemData = JSON.stringify(req.body)
        const params = JSON.stringify({
            "email": "customer@email.com",
            "amount": "20000",
            "plan": "PLN_xxxxxxxxxx",
            "metadata": {
                "item_data": stringifiedItemData,
                "cancel_action": "https://your-cancel-url.com"
            }
        })
        
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
              Authorization: 'Bearer SECRET_KEY',
              'Content-Type': 'application/json'
            }
        }
        
        const httpReq = https.request(options, httpRes => {
            let data = ''
            
            httpRes.on('data', (chunk) => {
                data += chunk
            });
            
            httpRes.on('end', () => {
                console.log(JSON.parse(data))
            })
        }).on('error', error => {
            console.error(error)
        })
        
        httpReq.write(params)
        httpReq.end()

        req.productTier = "paid"
        next()
    }
}