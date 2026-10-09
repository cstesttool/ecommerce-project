import { validateEmail, validatePassword, validatePhone, validatePincode } from "./utils.js"

console.log("Products page loaded")

const loggedIn = localStorage.getItem("shopEasyLoggedIn")
if (loggedIn !== "true") {
    window.location.href = "login.html"
}

//get current user
const currentUser = localStorage.getItem("shopEasyCurrentUser")
if (currentUser) {
    const user = JSON.parse(currentUser)
    console.log("Logged in User: ", user.name)
}

function getCart() {
    const cart = localStorage.getItem("shopEasyCart")
    if (!cart) {
        return [];
    }
    return JSON.parse(cart)
}

//Get Cart
const cart = getCart()
console.log("Cart: ", cart)

//Elements
const checkoutItems = document.getElementById("checkout-items")
const checkoutSummary = document.getElementById("checkout-summary")
const checkoutForm = document.getElementById("checkout-form")
const checkoutMessage = document.getElementById("checkout-message")

//empty cart
if (cart.length === 0) {
    checkoutItems.innerHTML = `
        <div class="empty-cart">
            <h3> your cart is empty</h3>
            <p>
                Please add products before checkout.
            </p>
            <a href="products.html"> Continue Shopping </a>
        </div>
    `;
    checkoutSummary.innerHTML = "";
    checkoutForm.style.display = "none"
}

//calculateSubtotal
function calculateCartTotal() {
    let subtotal = 0;

    cart.forEach(function (product) {
        subtotal += product.price * product.quantity
    })
    return subtotal
}

function calculateShipping(subtotal) {
    if (subtotal >= 1000) {
        return 0
    }
    return 100
}

//Grand total
function calculateGrandTotal(subtotal, shipping) {
    return subtotal + shipping
}

function displayOrderItems() {
    checkoutItems.innerHTML = ""

    cart.forEach(function (product) {
        const productTotal = product.price * product.quantity
        const orderItem = document.createElement("div")
        orderItem.className = "order-item"
        orderItem.innerHTML = `
            <div>
                <h4>${product.name}</h4>
                <p>
                    Quantity: ${product.quantity} x Price: ${product.price} 
                </p>
            </div>
            <strong>${productTotal}</strong>
        `;
        checkoutItems.appendChild(orderItem)
    })
}

//display summary
function displaySummary() {
    const subtotal = calculateCartTotal()
    const shipping = calculateShipping(subtotal)
    const grandTotal = calculateGrandTotal(subtotal, shipping)

    checkoutSummary.innerHTML = `
        <div class="summary-row">
            <span>Subtotal: </span>
            <strong>${subtotal}</strong>
        </div>
        <div class="summary-row">
            <span>Shipping: </span>
            <strong>${shipping === 0 ? "FREE" : `${shipping}`}
            </strong>
        </div>
        <hr>
        <div class="summary-row grand-total">
            <span>Grand Total: </span>
            <strong>${grandTotal}</strong>
        </div>
    `;
}

//place order
checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault()
    const name = document.getElementById("checkout-name").value.trim()
    const email = document.getElementById("checkout-email").value.trim()
    const phone = document.getElementById("checkout-phone").value.trim()
    const address = document.getElementById("checkout-address").value.trim()
    const city = document.getElementById("checkout-city").value.trim()
    const pincode = document.getElementById("checkout-pincode").value.trim()

    /*if(!name || !email || !phone || !address || !city || !pincode){
        checkoutMessage.textContent = "Please fill all the fields."
        checkoutMessage.style.color = "red"
        return
    }*/
    if (!name) {
        checkoutMessage.textContent = "Please enter your full name."
        checkoutMessage.style.color = "red"
        return
    }

    if (!validateEmail(email)) {
        checkoutMessage.textContent = "Please enter validate email address."
        checkoutMessage.style.color = "red"
        return
    }

    if (!validatePhone(phone)) {
        checkoutMessage.textContent = "Please enter a valid 10-digit phone number"
        checkoutMessage.style.color = "red"
        return
    }

    if (!validatePincode(email)) {
        checkoutMessage.textContent = "Please enter a valid 6 digit pincode"
        checkoutMessage.style.color = "red"
        return
    }

    if (!validatePassword(email)) {
        checkoutMessage.textContent = "Please enter more than 6"
        checkoutMessage.style.color = "red"
        return
    }


    //create order
    const subtotal = calculateCartTotal()
    const shipping = calculateShipping(subtotal)
    const grandTotal = calculateGrandTotal(subtotal, shipping)
    try {
        const order = {
            orderId: "ORD-" + Date.now(),
            customer: {
                name,
                email,
                phone,
                address,
                city,
                pincode
            },
            subtotal: subtotal,
            shipping: shipping,
            grandTotal: grandTotal,
            orderDate: new Date().toISOString()
        }
        console.log("Order Placed: ", order)

        //save order to localStorage
        localStorage.setItem("shopEasyLastOrder", JSON.stringify(order))
        // clear cart
        localStorage.removeItem("shopEasyCart")

        //success message
        checkoutMessage.textContent = `Order placed successfully! ${order.orderId}`
        checkoutMessage.style.color = "green"
        checkoutForm.reset()

        setTimeout(function () {
            window.location.href = "products.html"
        }, 5000)
    } catch (error) {
        console.error("checkout error:: ", error)
        checkoutMessage.textContent = "something wnet wrong while placing your order. please try again."
        checkoutMessage.style.color = "red";
    }

})

const logoutButton = document.getElementById("logout-button")

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("shopEasyLoggedIn")
    localStorage.removeItem("shopEasyCurrentUser")
    window.location.href = "login.html"
})

//start
if (cart.length > 0) {
    displayOrderItems()
    displaySummary()
}