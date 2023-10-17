import express from 'express';
import { Router } from "express";
import mongoose from "mongoose";
import ProductManager from "../controllers/ProductManager.js"
import { EventEmitter } from 'events'


const productRouter = express.Router()
const product = new ProductManager();
const bus = new EventEmitter();

bus.setMaxListeners(15);

// Se agregan los productos 
productRouter.post("/", async (req, res) => {
    let newProduct = req.body
    res.send(await product.addProduct(newProduct))
})

//actualizar productos
productRouter.put("/:id", async (req, res) => {
    let id = req.params.id
    let updProd = req.body
    res.send(await product.updateProducts(id, updProd))
})

//traer productos por id
productRouter.get("/:id", async (req, res) => {
    try {
        const prodId = req.params.id;
        const productDetails = product.getProductsById(prodId);
        res.render("viewDetails", {product: productDetails} )
    } catch (error) {
        console.error("Error al obtener el producto", error);
        res.status(500).json({error: "Error al obtener el producto"});
    }
})
//-----------------------------------------------------------

productRouter.get("/", async (req, res) => {
    let sortOrder = req.query.sortOrder;
    let category = req.query.category;
    let availability = req.query.availability;
    if(sortOrder === undefined) {
        sortOrder = "asc";
    }
    if(category === undefined) {
        category = "";
    }
    if(availability === undefined) {
        availability = "";
    }
    res.send(await product.getProductsMasters(null, null, category, availability, sortOrder))
})

//gets para obtener informacion 
//limit
productRouter.get("/limit/:limit", async (req, res) => {
    let limit = parseInt(req.params.limit)
    if(isNaN(limit) || limit <= 0) {
        limit = 10;
    }
    res.send(await product.getProductsByLimit(limit));
})
//obtener page     asi     8080/api/products/page/numeroPage
productRouter.get("/page/:page", async (req, res) => {
    let page = parseInt(req.params.page)
    if(isNaN(page) || page <= 0) {
        limit = 1;
    }
    const productsPerPage = 1;+
    res.send(await product.getProductsByPage(page, productsPerPage));
})
//buscar query   asi   8080//api/products/buscar/query/?q=nombreProducto
productRouter.get("/buscar/query", async (req, res) => {
    const query = req.query.q
    res.send(await product.getProductsByQuery(query));
})

//buscar por sort   asi          8080//api/products/ordenar/sort?sort=desc
productRouter.get("/ordenar/sort", async (req, res) => {
    let sortOrder = 0;
    if(req.query.sort) {
        if (req.query.sort === "desc") {
            sortOrder = -1;
        }else if(req.query.sort === "asc") {
            sortOrder = 1;
        }
    }
    res.send(await product.getProductsBySort(sortOrder))
})

productRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.delProducts(id))
})



export default productRouter