import { CartManager } from "./CartManager.js"
console.log("Product Details page loaded")

const cartManager = new CartManager()

const loggedIn = localStorage.getItem("shopEasyLoggedIn")
console.log("shopEasyLoggedIn::: ", loggedIn)

if (loggedIn === "true") {
    console.log("Login Verified")
} else {
    console.log("Login not found")
    window.location.href = "login.html"
}

//get currect user
const currentUser = localStorage.getItem("shopEasyCurrectUser")

if (currentUser) {
    const user = JSON.parse(currentUser)
    console.log("logged in User: ", user.name)
}


//Product container
const productDetails = document.getElementById("product-details")
const productMessage = document.getElementById("product-message")

//Get Product Id from url
const urlParams = new URLSearchParams(window.location.search);

const productId = urlParams.get("id")
console.log("Product Id::: ", productId)

//Get Products
async function getProduct() {
    try {
        const response = await fetch("data/products.json")
        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        const products = await response.json()
        console.log("Products::: ", products)

        //find selected product
        const product = products.find(function (item) {
            return item.id === Number(productId);
        })

        console.log("Selected Product:: ", product)

        //product Not found
        if (!product) {
            productDetails.innerHTML = `
                <h2>Product Not Found</h2>
                <a href="products.html">Back to Products</a>
            `;
            return
        }

        displayProducts(product)
    } catch (error) {
        console.error("Error:  ", error)
        productMessage.textContent = "Unable to load products. Please try again."
    }
}

function displayProducts(product) {
    productDetails.innerHTML = `
        <div class="product-details-card">
            <img 
                src="${product.image}"
                alt="${product.name}"
                class="product-details-image"/>
            <div class="product-details-content">
                <h2>${product.name}</h2>
                <p>
                    <strong>Category: </strong>
                    ${product.category}
                </p>
                <p class="product-details-price">
                    ${product.price}
                </p>
                <p> ${product.description} </p>
                <button type="button"
                        id="add-to-cart-button"> Add to Cart</button>
                <br>
                <br>
                <a href="products.html"> back to products </a>
            </div>
        </div>
    `;

    //Add to Cart
    const addToCartButton = document.getElementById("add-to-cart-button");

    addToCartButton.addEventListener(
        "click",
        function(){
            cartManager.addToCart(product);
            productMessage.textContent = `${product.name} added to cart!`
        }
    )
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


//Start
getProduct();