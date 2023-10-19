import ProductManager from './ProductManager.js';
import { cartsModel } from '../models/carts.model.js';

const productAll = new ProductManager();

class CartManager extends cartsModel{
    constructor() {
        super();
    }
    
    async getCarts() {
        try {
            const carts = await cartsModel.find({})
            .populate({
                path: "products.product",
                model: "products",
                select: "image description price stock" ,
            });
            return carts;
        } catch (error) {
            console.error('Error al obtener los carritos', error);
            return [];
        }
    }



    //add
    async addCart(cartData) {
        try {
            await cartsModel.create(cartData);
            return 'carrito agregado';
        } catch (error) {
            console.error('Error al obtener datos para crear carrito', error);
            return 'Error al obtener datos para crear carrito';
        }
    }

    async getCartById(id) {
        try 
        {
            const cart = await cartsModel.findById(id)   
            if (!cart) {
                return 'Carrito no encontrado';
            } 
            return cart;
        } 
        catch (error) 
        {
            console.error('Error al obtener el carrito:', error);
            return 'Error al obtener el carrito';
        }
    }

    async addProductInCart(cartId, prodId) 
    {
        try 
        {
            const cart = await cartsModel.findById(cartId);
        
            if (!cart) 
            {
                return 'Carrito no encontrado';
            }
            
            const productIndex = cart.products.findIndex((product) =>product.productId.toString() === prodId.toString());
            if (productIndex !== -1) {
                cart.products[productIndex].quantity +=1;
            }else{
                cart.products.push({
                    productId: prodId,
                    quanntity: 1,
                })
            }
            await cart.save();
            return 'Producto agregado al carrito';
        } catch (error) 
        {
            console.error('Error al agregar el producto al carrito:', error);
            return 'Error al agregar el producto al carrito';
        }
    }

    //get traer
    async getCartWithProducts(cartId) {
        try {
            const cart = await  cartsModel.findById(cartId).populate('products..productId').lean();

            if (!cart) {
                return 'Carrito no encontrado';
            }
            return cart;

        } catch (error) {
            console.error('Error al obtener el carrito con los productos', error);
            return 'Error al obtener el carrito con los productos';
        }
    }

    

    //delete de u n producto por Id
    async removeProductFromCart(cartId, prodId) {
        try 
        {
            const cart = await cartsModel.findById(cartId);
            if(!cart){
                return "carrito no encontrado"
            }
            //busca el indice del producto
            const productIndex = cart.products.findIndex((product) => product.productId === prodId)
            
            if(productIndex !== -1 ) {
                cart.products.splice(productIndex, 1)
                await cart.save();
                return "Producto eliminado del carrito"
            }else {
                //si no lo encuentra en el carro
                return "Producto no encontrado en el carrito"
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito,', error)
            return "Error al eliminar el producto del carrito"
        }
    }
    
    //eliminar todos los product del carrito
    async removeAllProductsFromCart(cartId) {
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart){
                return 'Carrito no encontrado'
            }

            //eliminar todos los product
            cart.products = [];
            await cart.save();

            return 'Todos los productos han sido eliminados del carrito ';
        } catch (error) {
            console.error("Error al eliminar los productos del carrito", error);
            return 'Error al eliminar los productos del carrito';
        }
    }

    async updateProductsInCart(cartId, newProduct) {
        try {
            const cart = await cartsModel.findById(cartId);

            if(!cart) {
                return 'Carrito no encontrado'
            }
            cart.products = newProduct
            await cart.save();
            return 'Carrito actualizado con nuevos productos';
        } catch (error) {
            console.error('Error al actualizar el carrito con nuevos productos', error);
            return 'Error al actualizar el carrito con nuevos productos';
        }
    }

    async updateProductInCart(cartId, prodId, updateProduct) {
        try {
            const cart = await cartsModel.findById(cartId);

            if(!cart) {
                return 'Carrito no encontrado'
            }
            const productToUpdate = cart.products.find((product) => product.productId === prodId);

            if(!productToUpdate) {
                return  'Producto no encntrado en el carrito'
            }
            //actualizar con datos dados
            Object.assign(productToUpdate, updateProduct);

            await cart.save();
            return 'Producto actualizado en el carrito';
        } catch (error) {
            console.error('Error al actualizar el producto en el carrito', error);
            return 'Error al actualizar el producto en el carrito';
        }
    }


}

export default CartManager