import express from 'express';
//import request from 'request';

import { createRequire } from 'module';
//const require = createRequire(import.meta.url);
import fs from 'fs';
import http from 'http';

//const request = require("request"); 

import OrdersSchema from '../models/ordersSchema.js';

const router = express.Router();

export const postOrders = async (req, res) => {

    // Converting .csv to .json
    // let {csv} = req.body;

    //csv = await Promise.all(fs.readFileSync("https://www.google.com/url?sa=j&url=https%3A%2F%2Fdeepecompublic.s3.ap-south-1.amazonaws.com%2FproblemStatement.csv&uct=1653882745&usg=bdhPKFkGF2md-CfB99rUMK0n4Sg.&source=meet"));   
    //let csv;

    //var http = require('http');

    const file = fs.createWriteStream("file.csv");
    const csv = http.get("http://www.google.com/url?sa=j&url=https%3A%2F%2Fdeepecompublic.s3.ap-south-1.amazonaws.com%2FproblemStatement.csv&uct=1653882745&usg=bdhPKFkGF2md-CfB99rUMK0n4Sg.&source=meet", function(response) {
    response.pipe(file);
    });
    // const csv = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
    //     response.pipe(file);
    // });
    console.log(csv);
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
//https://www.google.com/url?sa=j&url=https%3A%2F%2Fdeepecompublic.s3.ap-south-1.amazonaws.com%2FproblemStatement.csv&uct=1653882745&usg=bdhPKFkGF2md-CfB99rUMK0n4Sg.&source=meet