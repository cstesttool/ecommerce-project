function validateEmail(email){
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email)
}

function validatePhone(phone){
    const phonePattern = /^[0-9]{10}$/
    return phonePattern.test(phone)
}

function validatePincode(pincode){
    const phonePattern = /^[0-9]{6}$/
    return phonePattern.test(pincode)
}

function validatePassword(password){
    return password.length >= 6;
}

export { validateEmail, validatePhone, validatePincode, validatePassword};