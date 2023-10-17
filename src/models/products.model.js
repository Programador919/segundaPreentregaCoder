import mongoose from 'mongoose';
//import paginate from "mongoose-paginate-v2"

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    name:{type:"String", max: 50},
    description:{type:"String", max: 100},
    image:{type:"String", max: 400},
    price:{type:"Number"},
    stock:{type:"Number"},
    category:{type:"String", max:30},
    availability:{type:"String", enum:['in_stock', 'out_of_stock']}
})

export const productsModel = mongoose.model(productsCollection, productsSchema)