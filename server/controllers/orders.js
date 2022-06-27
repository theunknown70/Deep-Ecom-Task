import express from 'express';
import fs from 'fs';
import http from 'http';

import OrdersSchema from '../models/ordersSchema.js';

const router = express.Router();

export const postOrders = async (req, res) => {

    // Converting .csv to .json
    const file = fs.createWriteStream("file.csv");
    const abc = http.get("http://deepecompublic.s3.ap-south-1.amazonaws.com/problemStatement.csv", function(response) {
        response.pipe(file);
    });

    var csv = await fs.readFileSync("file.csv")

    var array = csv.toString().split("\r");

    let result = [];  
    let headers = await array[0].split(",");
        
    for(let i=1; i<array.length; i++){
        let obj = {}   
        let properties = array[i].split(",");

        for (let j in headers) {
            if(properties[j]?.includes(",")){
                obj[headers[j]] = properties[j]
                .split(",").map(item => {
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
            let Invoice_Number = order["Invoice Number"];
            let Transaction_Type = order["Transaction Type"];
            let Shipment_Item_Id = order["Shipment Item Id"];

            const oldOrder = await OrdersSchema.findOne({ "orderDetails.Invoice Number": Invoice_Number, "orderDetails.Transaction Type": Transaction_Type, "orderDetails.Shipment Item Id": Shipment_Item_Id });
            if(oldOrder) {                                                  // checking if order already exists or not
                return {Invoice_Number: "Order already exists"};
            }else{
                var newOrder = new OrdersSchema({"orderDetails": order});
                await newOrder.save();
                return newOrder;
            }
        }));

        res.status(201).json( newOrders );                                  // response

    } catch (error) {                                                       // catch any errors
        res.status(409).json({ message: error.message });
    }
}

export default router;