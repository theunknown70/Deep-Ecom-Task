import express from 'express';

import OrdersSchema from '../models/ordersSchema.js';

const router = express.Router();

export const postOrders = async (req, res) => {

    // Converting .csv to .json
    let {csv} = req.body;
    var array = csv.toString().split("\r");
    let result = [];  
    let headers = array[0].split(", ");
                                                    
    for(let i=1; i<array.length; i++){
        let obj = {}   
        let properties = array[i].split(", ");

        for (let j in headers) {
            if(properties[j].includes(", ")){
                obj[headers[j]] = properties[j]
                .split(", ").map(item => {
                    return item.trim();
                })
            }else{
                obj[headers[j]] = properties[j];
            }
        }
        result.push(obj)
    }

    // posting
    try {
        let newOrders = await Promise.all(result.map(async (order) => {
            let Invoice_Number = order.Invoice_Number;
            const oldOrder = await OrdersSchema.findOne({ Invoice_Number });
            if(oldOrder) {                                              // checking if order with Inv No already exists or not
                return {Invoice_Number: "Order already exists"};
            }else{
                var newOrder = new OrdersSchema(order);
                await newOrder.save();
                return newOrder;
            }
        }));

        res.status(201).json(newOrders);                                // response

    } catch (error) {                                                   // catch any errors
        res.status(409).json({ message: error.message });
    }
}

export default router;