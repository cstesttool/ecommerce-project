import { CartManager } from "./CartManager.js"
//================
//Cart Functions
//=================

const cartManager = new CartManager()

//display cart page
function displayCart() {
    const cart = cartManager.getCart()
    const cartContainer = document.getElementById("cart-container")
    const cartSummary = document.getElementById("cart-summary")
    const cartMessage = document.getElementById("cart-message")

    if (!cartContainer) {
        return
    }

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3> your cart is empty</h3>
                <p>
                    Add some Products to your cart
                </p>
                <a href="products.html"> Continue Shopping </a>
            </div>
        `;

        cartSummary.innerHTML = "";
        cartMessage.textContent = ""
        return;
    }

    //clear previous content
    cartContainer.innerHTML = "";
    let total = 0;

    //display products
    cart.forEach(product => {
        const productTotal = product.price * product.quantity;
        total += productTotal // total = total + productTotal
        const cartItem = document.createElement("div")

        cartItem.className = "cart-item"

        cartItem.innerHTML = `
            <img 
                src="${product.image}"
                alt="${product.name}"
                class = "cart-item-image"/>
            <div class="cart-item-details">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <div class="quantity-controls">
                    <button
                        type = "button" class="decrease-button" data-id="${product.id}">
                        - 
                        </button>
                    <span>${product.quantity}</span>
                    <button
                        type = "button" class="increase-button" data-id="${product.id}">
                        +
                        </button>
                </div>

                <p> subTotal: ${productTotal}</p>
                <button type="button" class="remove-button" data-id="${product.id}">
                    Remove
                </button>
            </div>
        `;

        cartContainer.appendChild(cartItem)
    });

    //calculate totals
    const subtotal = cartManager.calculateCartTotal(cart)
    const shipping = cartManager.calculateShipping(subtotal)
    const grandTotal = cartManager.calculateGrandTotal(subtotal, shipping)

    //display total
    cartSummary.innerHTML = `
        <div class="summary-row">
            <span>
                subTotal: 
            </span>
            <strong>${subtotal}</strong>
        </div>

        <div class="summary-row">
            <span>
                shipping: 
            </span>
            <strong>${shipping === 0 ?
            "FREE"
            : `${shipping}`
        }
            </strong>
        </div>

        <div class="summary-row grand-total">
            <span>
                Grand Total: 
            </span>
            <strong>${grandTotal}
            </strong>
        </div>

        <button type="button" id="checkout-button"> Proceed to Checkout </button>
    `;

    const checkoutButton = document.getElementById("checkout-button")
    if(checkoutButton){
        checkoutButton.addEventListener("click", function(){
            window.location.href = "checkout.html"
        })
    }


    //increase-button

    const increaseButtons = document.querySelectorAll(".increase-button");

    increaseButtons.forEach(function (button) {
        button.addEventListener("click",
            function () {
                const productId = Number(button.dataset.id);
                cartManager.increaseQuantity(productId)
            }
        )
    });

    //decrease-button

    const decreaseButtons = document.querySelectorAll(".decrease-button");

    decreaseButtons.forEach(function (button) {
        button.addEventListener("click",
            function () {
                const productId = Number(button.dataset.id);
                cartManager.decreaseQuantity(productId)
            }
        )
    });

    //remove product
    const removeButtons = document.querySelectorAll(".remove-button");

    removeButtons.forEach(function (button) {
        button.addEventListener("click",
            function () {
                const productId = Number(button.dataset.id);
                cartManager.removeFromCart(productId)
            }
        )
    });
}


//logout
const logoutButton = document.getElementById("logout-button")

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("shopEasyLoggedIn")
        localStorage.removeItem("shopEasyCurrectUser")
        window.location.href = "login.html"
    })
}

//make function available globally
window.displayCart = displayCart;

//start
displayCart()
