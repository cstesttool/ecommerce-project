export class CartManager {
    constructor() {
        this.cartKey = "shopEasyCart";
    }

    getCart() {
        try {
            const cartData = localStorage.getItem(this.cartKey)
            if (!cartData) {
                return []
            }

            const cart = JSON.parse(cartData)

            if (!Array.isArray(cart)) {
                return []
            }
            return cart
        } catch (error) {
            console.error("Cart storage error: ", error)
            return []
        }
    }

    saveCart(cart) {
        localStorage.setItem("shopEasyCart", JSON.stringify(cart))
    }

    addToCart(product) {
        const cart = this.getCart()

        //check whether product already exists
        const existingProduct = cart.find(function (item) {
            return item.id === product.id;
        })

        if (existingProduct) {
            //increase quantity
            existingProduct.quantity++;
        } else {
            //add new product
            cart.push({
                ...product,
                quantity: 1
            });
        }

        //save update cart
        this.saveCart(cart)
        console.log("Carts::; ", cart)
    }

    calculateCartTotal(cart) {
        let subtotal = 0;
        cart.forEach(function (product) {
            subtotal += product.price * product.quantity;
        })
        return subtotal;
    }

    calculateShipping(subtotal) {
        if (subtotal >= 1000) {
            return 0;
        }
        return 100;
    }

    calculateGrandTotal(subtotal, shipping) {
        return subtotal + shipping;
    }

    increaseQuantity(productId) {
        const cart = this.getCart()
        const product = cart.find(function (item) {
            return item.id === productId
        })

        if (product) {
            product.quantity++
        }

        this.saveCart(cart)
        displayCart()
    }

    decreaseQuantity(productId) {
        const cart = this.getCart()
        const product = cart.find(function (item) {
            return item.id === productId
        })

        if (!product) {
            return;
        }

        if (product.quantity > 1) {
            product.quantity--
        }

        this.saveCart(cart)
        displayCart()
    }

    //remove product from cart
    removeFromCart(productId) {
        const cart = this.getCart()
        const productIndex = cart.findIndex(function (item) {
            return item.id === productId
        })

        if (productIndex === -1) {
            return;
        }

        cart.splice(productIndex, 1);

        this.saveCart(cart)
        displayCart()
    }
}