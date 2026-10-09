console.log("Authentication module loaded")
const registerForm = document.getElementById("register-form")

const loginForm = document.getElementById("login-form")

//Register form
if(registerForm){
    registerForm.addEventListener("submit", async function (event){
        event.preventDefault()
        const message = document.getElementById("register-message")
        //Get form values
        const name = document.getElementById("register-name").value.trim()
        const email = document.getElementById("register-email").value.trim()
        const password = document.getElementById("register-password").value

        console.log("Name: ", name)
        console.log("Email: ", email)
        console.log("Password: ", password)

        //basic validation
        if(!name || !email || !password){
            message.textContent = "Please fill all fields."
            return
        }

        //password validation
        if(password.length < 6){
            message.textContent = "Password must at least 6 characters"
            return
        }
        
        //check existing user
        const existingUser = localStorage.getItem("shopEasyUser")

        if(existingUser){
            const savedUser = JSON.parse(existingUser)

            if(savedUser.email.toLowerCase() === email.toLowerCase()){
                message.textContent = "An Account with this email already exists."
                return
            }
        }

        //create user object
        const user = {
            name,
            email,
            password
        }

        try{
            message.textContent = "Creating account...."
            //send user to api
            const response = await fetch("https://jsonplaceholder.typicode.com/users",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            //response
            if(!response.ok){
                throw new Error("Registration failed")
            }

            //read api response
            const result = await response.json()
            console.log("API Response ::: ", result)

            //save local
            localStorage.setItem("shopEasyUser", JSON.stringify(user))

            //success message
            message.textContent = "Account created successfully"

            registerForm.reset()

            //redirect to login
            setTimeout(function(){
                window.location.href = "login.html"
            }, 1500);
        }catch(error){
            console.log("Registration Error::", error)
            message.textContent = "Unable to create account. please try again"
        }
    })
}

//login form
if(loginForm){
    loginForm.addEventListener("submit", function(event){
        event.preventDefault()
        const message = document.getElementById("login-message")
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value
        console.log("login Email: ", email)
        console.log("login Password :: ", password)

        if(!email || !password){
            message.textContent = "Please enter email and password."
            return;
        }

        const savedUser = localStorage.getItem("shopEasyUser")
        //no account
        if(!savedUser){
            message.textContent = "No Account found. Please register first."
            return
        }

        //convert json to object
        const user = JSON.parse(savedUser)

        if(user.email.toLowerCase() === email.toLowerCase() && user.password === password){
            //login successful
            console.log("shopEasyLoggedIn")
            localStorage.setItem("shopEasyLoggedIn", "true")
            localStorage.setItem("shopEasyCurrectUser", JSON.stringify(user))

            message.textContent = "Login Successfull"
            loginForm.reset()

            setTimeout(function(){
                window.location.href = "products.html"
            }, 1500)
        } else{
            message.textContent = "invalid email or password"
        }
    })
}