import mongoose, { Schema } from 'mongoose';

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    products: [{
    
        product: {
            type: Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {type: Number}
    
    }] 
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)


