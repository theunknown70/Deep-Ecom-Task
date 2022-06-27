import mongoose from 'mongoose';

const ordersSchema = mongoose.Schema({
    orderDetails: {
        "Invoice Number": String, 
        "Invoice Date": String,
        "Transaction Type": String,
        "Order Id": String,	
        "Shipment Id": String,
        "Shipment Date": String,
        "Order Date": String,
        "Shipment Item Id": String,
        "Quantity": String,
        "Item Description": String,
        "Asin": String,
        "Hsn/sac": String,
        "Sku": String,
        "Ship To State": String,
        "pincode": String,
        "Invoice Amount": String,
        "gst": String,
    },
})

var OrdersSchema = mongoose.model('OrdersSchema', ordersSchema);

export default OrdersSchema;