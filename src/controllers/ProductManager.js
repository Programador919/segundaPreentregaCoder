//import fs from "fs/promises"
import mongoose from "mongoose"
import { nanoid } from 'nanoid';
import CartManager from './CartManager.js';
import { productsModel } from '../models/products.model.js';

class ProductManager {
    constructor() {
        this.path = "./src/models/products.json";
    }

    //----------------lo nuevo -----

    //obtener product por limit
    async  getProductsByLimit(limit)
    {
        try {
            //console.log(limit)
            const products = await ProductManager.find().limit(limit);
            if (products.length < limit) {
                limit = products.length;
            }
            return products
        } catch (error) {
            throw error;
        }
    }

    //obtener product por page

    async  getProductsByPage(page, produtsPerPage)
    {
        if (page <= 0) {
            page = 1;
        }
        try {
            const products = await ProductManager.find()
            .skip((page - 1) * produtsPerPage)
            .limit(productsPerPage);
        } catch (error) {
            throw error;
        }
    }

    //obtener producto por query
    async  getProductsByQuery(query)
    {
        console.log(query)
        try {
            const products = await productsModel.find({
                description: {$regex: query, $options: 'i'}
            });
            console.log(products);
            return products;
        } catch (error) {
            throw error;
        }
    }

    //busqueda con todo lo solicitado
    async  getProductsMaster(page = 1, limit = 10, category, availability, sortOrder)
    {
        try {
            let filter = {};

            const startIndex = (page -1) * limit;
            const endIndex = page * limit;

            const sortOptions = {};

            if(sortOrder === 'asc') {
                sortOptions.price = 1;
            }else if(sortOrder === 'desc') {
                sortOptions.price = -1;
            }else{
                throw new Error('El parametro sortOrder debe ser "asc" o "desc". ' )
            }

            if(category != "") {
                filter.category = category;
            }
            if(availability != "") {
                filter.availability = availability;
            }
            //realiza la consulta utilizando el filtro
            const query = ProductManager.find(filter)
            .skip(startIndex)
            .limit(limit)
            .sort(sortOptions)
            const products = await query.exec();

            //calcular total de las paginas
            const totalProducts = await ProductManager.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = startIndex > 0;
            const hasNextPage = endIndex < totalProducts;
            const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
            const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;

            //debuelve la respuesta con la extructura que se pide
            return {
                status: 'success',
                payload: products,
                totalPages: totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
            };
        } catch (error) {
            console.error("Error al obtener los productos", error);
            return {status: 'error', payload: "Error al obtener los productos"};
        }
    }

    //eliminar un producto por id
    async deleteProduct(id) {
        try {
            const product = await ProductManager.findById(id);
            
            if (!product) {
                return 'Producto no encontrado'
            }
            await product.remove();
            return 'Producto eliminado'
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            return 'Error al eliminar el producto'
        }
    }
    
        
    
}

export default ProductManager

