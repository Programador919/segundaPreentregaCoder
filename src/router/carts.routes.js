import { Router } from "express";
import CartManager from "../controllers/CartManager.js"


const CartRouter = Router()
const carts = new CartManager

// // 8080/api/carts
// CartRouter.post("/", async (req, res)=> {
//     let newCart = req.body
//     res.send(await carts.addCarts(newCart))
// })

//trae los carros 8080/api/carts con get general
CartRouter.get("/", async (req, res)=> {
    res.send(await carts.getCarts())
})

//trae carro por id 8080/api/carts/idCart para get con id
CartRouter.get("/:id", async (req, res)=> {
    res.send(await carts.getCartsById(req.params.id))
})

//traer todos los carros con population   8080/api/carts
CartRouter.get("/population/:cid", async (req, res)=> {
    let cartId = req.params.cid
    res.send(await carts.getCartWhihProducuts(cartId))
})

//ingresar productos al carro 8080/api/carts/cid/products/pid  con post
CartRouter.post("/:cid/products/:pid", async (req, res)=> {
    let cartId = req.params.cid
    let productId = req.params.pid
    res.send(await carts.addProductInCart(cartId, productId))
})


//actualizar   8080/api/carts/idCarts   para put 
CartRouter.put("/:cid", async (req, res)=> {
    let cartId = req.params.cid
    let newProducts = req.body
    res.send(await carts.updateProductsInCart(cartId, newProducts))
})

//actualizar con varios productos   8080/api/carts/idCarts
CartRouter.put("/:cid/products/:pid", async (req, res)=> {
    let cartId = req.params.cid
    let prodId = req.params.pid
    let newProducts = req.body
    res.send(await carts.updateProductsInCart(cartId, prodId, newProducts))
})

//eliminar todos los productos del carrito   8080/api/carts/idCarts
CartRouter.delete("/:cid", async (req, res)=> {
    let cartId = req.params.cid
    res.send(await carts.removeAllProductsFromCart(cartId))
})

//eliminaqr el producto del carrito  8080/api/Carts/idCarts/products/idProducts con dellete
CartRouter.delete("/:cid/products/:pid", async (req, res)=> {
    let cartId = req.params.cid
    let productId = req.params.pid
    res.send(await carts.removeProductFromCart(cartId, productId))
})

export default CartRouter