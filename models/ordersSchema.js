import mongoose from 'mongoose';

const ordersSchema = mongoose.Schema({
    Invoice_Number: String,
    Invoice_Date: String,
    Transaction_Type: String,
    Order_Id: String,	
    Shipment_Id: String,
    Shipment_Date: String,
    Order_Date: String,
    Shipment_Item_Id: String,
    Item_Description: String,
    Asin: String,
    Hsn_sac: String,
    Sku: String,
    Ship_To_State: String,
    pincode: String,
    Invoice_Amount: String,
    gst: String,
})

var OrdersSchema = mongoose.model('OrdersSchema', ordersSchema);

export default OrdersSchema;