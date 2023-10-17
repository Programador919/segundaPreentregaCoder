import express  from 'express';
import expresshandlebars from 'express-handlebars';
import productRouter from "./router/product.routes.js"
import CartRouter from "./router/carts.routes.js"
import ProductManager from "./controllers/ProductManager.js"
import CartManager from "./controllers/CartManager.js";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import * as path from "path";
import  __dirname from "./utils.js"

const app = express();
const PORT = 8080


//const prod = new ProductRouter();
const product = new ProductManager()
const cart = new CartManager();
//handlebarts ----
app.engine("handlebars",engine())
app.set('view engine', "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//css statics
app.use("/", express.static(path.resolve(__dirname + "/public")))
//Middleware para parsear json y datos de formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use("/api/products", productRouter)
app.use("/api/cart", CartRouter)

app.get("/products", async (req, res) => {
    try {
        let allProducts = await productRouter.getProducts();
        const products = allProducts.map(product => product.toJSON());
        res.render("viewProducts", {
            title: "vista de Productos",
            products
        })
    } catch (error) {
        console.error('Error al obtener productos', error);
        res.status(500).send('Error interno del servidor');
    }
})

app.get("/carts/:cid", async (req, res) => {
    try {
        let id = req.params.cid
        allCarts = await cart.getCartWithProducts(id);
        //const allCarts = await cartManager.getCartWithProducts(id);
        res.render("viewCart", {
            title : "vista Cart",
            carts : allCarts
    })
    } catch (error) {
        console.error("Error al obtener el carrito ", error)
        res.status(500).send("Error interno del servidor")
    }
    
})

//-----------------mongoose----------------
mongoose.connect("mongodb+srv://luisalbertovalencia1966:2ogZdmSl9jWGJBAV@proyectocoder.sqvx5rc.mongodb.net/?retryWrites=true&w=majority")
.then(()=> {
    console.log("Conectado a la base de datos ")
})
.catch(error=> {
    console.error("Error al intentar conectarse a la DB", error);
})

app.listen(PORT, ()=>{
    console.log(`Servidor Express Puerto ${PORT}`);
});

