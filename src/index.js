import express  from 'express';
import { engine } from "express-handlebars";
import * as path from "path";
import  __dirname from "./utils.js"


import mongoose from "mongoose";
import CartRouter from "./router/carts.routes.js"
import productRouter from "./router/product.routes.js"
import ProductManager from "./controllers/ProductManager.js"
import CartManager from "./controllers/CartManager.js";


const app = express();
const PORT = 8080

const product = new ProductManager()
const cart = new CartManager();

//Middleware para parsear json y datos de formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, ()=>{
    console.log(`Servidor Express Puerto ${PORT}`);
});
//-----------------mongoose----------------
mongoose.connect("mongodb+srv://luisalbertovalencia1966:2ogZdmSl9jWGJBAV@proyectocoder.sqvx5rc.mongodb.net/?retryWrites=true&w=majority")
.then(()=> {
    console.log("Conectado a la base de datos ")
})
.catch(error=> {
    console.error("Error al intentar conectarse a la DB", error);
})

//Rutas
app.use("/api/product", productRouter)
app.use("/api/carts", CartRouter)

//handlebarts ----
app.engine("handlebars",engine())
app.set('view engine', "handlebars")
app.set("views", path.resolve(__dirname + "/views"))


//css statics
app.use("/", express.static(__dirname + "/public/css"))



//rederizado de productos
app.get("/products", async (req, res) => {
    try {
        let allProducts = await product.getProducts();
        allProducts = allProducts.map(product => product.toJSON());
        res.render("viewProducts", {
            title: "vista de Productos",
            products : allProducts
        })
    } catch (error) {
        console.error('Error al obtener productos', error);
        res.status(500).send('Error interno del servidor');
    }
})



//render productos en carrito
app.get("/carts/:cid", async (req, res) => {
    try {
        let id = req.params.cid
        let allCarts = await cart.getCartWithProducts(id);
        res.render("viewCart", {
            title : "vista Cart",
            carts : allCarts,
            //products : allProducts
    })
    } catch (error) {
        console.error("Error al obtener el carrito ", error)
        res.status(500).send("Error interno del servidor")
    }
})