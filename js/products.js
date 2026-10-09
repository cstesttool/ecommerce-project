console.log("Products page loaded")

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
const productContainer = document.getElementById("product-container")
const productMessage = document.getElementById("product-message")
const searchInput = document.getElementById("search-input")

//store products

let allProducts = []

//Get Products
async function getProducts() {
    try {
        productMessage.textContent = "Loading products...."
        const response = await fetch("data/products.json")
        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        allProducts = await response.json()
        console.log("Products::: ", allProducts)

        displayProducts(allProducts)
    } catch (error) {
        console.error("Error:  ", error)
        productMessage.textContent = "Unable to load products. Please try again."
    }
}

function displayProducts(products) {
    productContainer.innerHTML = "";
    productMessage.textContent = "";

    if (products.length === 0) {
        productMessage.textContent = "No Products Found..."
        return;
    }

    products.forEach(function (product) {

        console.log(
            "Creating product:",
            product.name
        );


        const productCard =
            document.createElement("div");


        productCard.className =
            "product-card";


        productCard.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
            >

            <h3>
                ${product.name}
            </h3>

            <p>
                Category:
                ${product.category}
            </p>

            <p class="price">
                ₹${product.price}
            </p>

            <p>
                ${product.description}
            </p>

            <button
                type="button"
                class="view-product-button"
                data-id="${product.id}">
                View Product
            </button>
        `;
        productContainer.appendChild(
            productCard
        );
    });

    //view product Button
    const viewProductButton = document.querySelectorAll(".view-product-button");

    viewProductButton.forEach(function (button) {
        button.addEventListener("click", function () {
            const productId = button.dataset.id;
            console.log("Selected product ID: ", productId)
            window.location.href = `product-details.html?id=${productId}`;
        })
    })
}

//search products

searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase().trim()
    console.log("Search:: ", searchText)

    const filteredProducts = allProducts.filter(function (product) {
        return (product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText)
        );
    })
    displayProducts(filteredProducts)
})

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
getProducts();