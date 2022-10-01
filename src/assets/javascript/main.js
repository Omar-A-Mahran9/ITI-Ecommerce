/* /////////////////////////////// START USER LOGIN & REGISTER VAlIDATION /////////////////////////////// */

// get users from local storags
var users = JSON.parse(localStorage.getItem('Users')) || [];
var showMsg = document.createElement('div');

// if user logged in show info in navbar
function loadUserData() {
    var user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        document.getElementById('user').innerHTML = user.username;
        document.getElementById('user_login').innerHTML = 'profile'
        document.getElementById('user_login').href = '/src/Pages/profile.html';
        document.getElementById('user_register').innerHTML = 'logout'
        document.getElementById('user_register').href = '/src/Pages/logout.html';
    }
}

// Registeration form
var newUserName;
var newUserEmail;
var newUserPass;
var confirmPass;
const registeration = document.getElementById('registeration');
if (registeration) {
    registeration.addEventListener('submit', addNewUser);
} // when user submit to register

// login form
var userEmail;
var userPass;
const errRegDiv = document.getElementById('registerErrors');
const errLoginDiv = document.getElementById('loginErrors');
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', login);
} // when user submit to login


// user profile page
function profileInfo() {
    var user = JSON.parse(sessionStorage.getItem('user'));
    document.getElementById('profile_username').value = user.username;
    document.getElementById('profile_email').value = user.useremail;
    document.getElementById('profile_logout').addEventListener('click', function(){
        location.replace('/src/Pages/logout.html');
    });
}



function login(event) {
    event.preventDefault();
    // get form input values
    userEmail = document.getElementById('email').value;
    userPass = document.getElementById('password').value;

    // First validation on empty fields
    let emptyResult = checkEmptyFields(userEmail, userPass);
    if (!emptyResult) {
        return errLoginDiv.prepend(showMsg);
    }

    // Second validation on inputs regex
    let resultEmailRegex = validateEmail(userEmail); //email input
    if (!resultEmailRegex) {
        failedMsg('Please enter valid email');
        return errLoginDiv.prepend(showMsg);
    }

    // Third validation on user data exists in local storage or not


    // get user information from local storage by entered email
    let userInfo = getUserInfo(userEmail);

    // check entered email and password with email and password in local storage
    if (userEmail != userInfo.useremail || userPass != userInfo.userpassword) {
        failedMsg('Wrong email or password');
        return errLoginDiv.prepend(showMsg);
    }

    successMsg('Login Successfully');
    errLoginDiv.prepend(showMsg);
    sessionStorage.setItem('user', JSON.stringify(userInfo)); // save user info to session 
    redirect('/index.html', 500);

} // end login function

function addNewUser(event) {
    event.preventDefault();
    // get form input values
    newUserName = document.getElementById('name').value;
    newUserEmail = document.getElementById('email').value;
    newUserPass = document.getElementById('password').value;
    confirmPass = document.getElementById('password-confirm').value;

    // First validation on empty fields
    let emptyResult = checkEmptyFields(newUserName, newUserEmail, newUserPass, confirmPass);
    if (!emptyResult) {
        return errRegDiv.prepend(showMsg);
    }

    // Second validation on inputs regex
    let resultNameRegex = validateName(newUserName); //name input
    if (!resultNameRegex) {
        failedMsg('Please enter valid name');
        return errRegDiv.prepend(showMsg);
    }

    let resultEmailRegex = validateEmail(newUserEmail); //email input
    if (!resultEmailRegex) {
        failedMsg('Please enter valid email');
        return errRegDiv.prepend(showMsg);
    }

    let resultPassRegex = validatePass(newUserPass); //password input
    if (!resultPassRegex) {
        let errMsg = "Password shouldn't be less than 8 characters and should contain small, capital letters and numbers";
        failedMsg(errMsg);
        return errRegDiv.prepend(showMsg);
    }

    // Third validation on matching password and confirm password
    if (newUserPass != confirmPass) {
        failedMsg("Password and confirm password doesn't match");
        return errRegDiv.prepend(showMsg);
    }

    // Fourth validation on if user email already exists or not
    let resultUserExists = getUserInfo(newUserEmail);
    if (resultUserExists) {
        failedMsg("This email already exists");
        return errRegDiv.prepend(showMsg);
    }

    // insert user information to local storage
    let userData = {
        username: newUserName,
        useremail: newUserEmail,
        userpassword: newUserPass
    };
    users.push(userData);
    localStorage.setItem('Users', JSON.stringify(users)); // save user info to local storage
    sessionStorage.setItem('user', JSON.stringify(userData)); // save user info to session
    successMsg("Registeration Success,<br/> Please wait unitll redirect to home page");
    errRegDiv.appendChild(showMsg);
    // redirect to home page
    return redirect('/index.html', 1500);
} // end add new user function

function checkEmptyFields(...inputs) {
    for (let input of inputs) {
        if (input.length == 0) {
            failedMsg('All Fields Required');
            return false;
        }
    }
    return true;
} // end check empty fields function

function validateName(name) {
    let nameRegex = /^([a-zA-Z ]){3,30}$/
    if (nameRegex.test(name)) {
        return true;
    } else {
        false
    }
} // end name validation function

function validateEmail(email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailRegex.test(email)) {
        return true;
    } else {
        false
    }
} // end email validation function

function validatePass(password) {
    let passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (passRegex.test(password)) {
        return true;
    } else {
        false
    }
} // end name password function

function redirect(href, time) {
    setTimeout(() => {
        location.href = href;
    }, time);
} // end redirect to another page function

function failedMsg(msg) {
    showMsg.classList.remove('alert-success');
    showMsg.classList.add('text-center', 'alert', 'alert-danger', 'mt-4');
    showMsg.setAttribute('role', 'alert');
    showMsg.innerHTML = msg;
} // end failed message function

function successMsg(msg) {
    showMsg.classList.remove('alert-danger');
    showMsg.classList.add('text-center', 'alert', 'alert-success', 'mt-4');
    showMsg.setAttribute('role', 'alert');
    showMsg.innerHTML = msg;
} // end success message function

function getUserInfo(email) {
    for (let user of users) {
        if (user.useremail == email) {
            return {
                username: user.username,
                useremail: user.useremail,
                userpassword: user.userpassword
            }
        }
    }
    return false;

} // end check user if exists function


/* /////////////////////////////// END USER LOGIN & REGISTER VAlIDATION /////////////////////////////// */

/* /////////////////////////////// Home, Shop and Single Products Pages/////////////////////////////// */

// document.addEventListener("DOMContentLoaded", function(){
//     window.addEventListener('scroll', function() {
//         if (window.scrollY > 50) {
//           document.getElementById('navbar_top').classList.add('fixed-top');
//           navbar_height = document.querySelector('.navbar').offsetHeight;
//           document.body.style.paddingTop = navbar_height + 'px';
//         } else {
//           document.getElementById('navbar_top').classList.remove('fixed-top');
//           document.body.style.paddingTop = '0';
//         } 
//     });
//   });


// let nav_about = document.getElementById("#navabout");

// nav_about.addEventListener("click",function(e){
//     e.preventDefault();
//     document.getElementById("#about-us").scrollIntoView({
//         behavior: "smooth"
//     });
// });


let carts = document.querySelectorAll(".add-cart");
let products = [
    {
        name : ' Grey Tshirt ' ,
        tag : ' greytshirt ' ,
        price : 15 ,
        inCart : 0
    } ,
    {
        name : " Grey Hoddie " ,
        tag : " greyhoddie " ,
        price : 20 ,
        inCart : 0
    } ,
    {
        name : " Black Tshirt " ,
        tag : " blacktshirt " ,
        price : 15 ,
        inCart : 0
    } ,
    {
        name : " Black Hoddie " ,
        tag : " blackhoddie " ,
        price : 20 ,
        inCart : 0
    } 
]

// console.log(products[1]);
// console.log("runningnad");
for(let i=0; i< carts.length; i++){
    carts[i].addEventListener("click",()=>{
        // console.log("added to cart "+i);
        cartNumbers(products[i])
        totalCost(products[i])
    })
}

function onLoadCartNumbers () {
    let productNumbers = localStorage.getItem ("cartNumbers") ;
    if (productNumbers) {
        document.querySelector (".nav-cart span").textContent = productNumbers ;
   }
}
function cartNumbers (product) {
    // console.log("The prduct clicked is",product);
    let productNumbers = localStorage.getItem ("cartNumbers") ;
    productNumbers = parseInt ( productNumbers ) ;
    if (productNumbers) {
        localStorage.setItem ("cartNumbers", productNumbers + 1 );
        document.querySelector(".nav-cart span").textContent = productNumbers + 1;
    }else{
        localStorage.setItem ("cartNumbers", 1 );
        document.querySelector(".nav-cart span").textContent =  1;
    }
    setItems(product);
}

function setItems(product){
    // console.log("Inside of SetItems function");
    // console.log("My product is ", product);
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    // console.log("My cartItems are",cartItems);
    if(cartItems != null){
        // cartItems
        if(cartItems[product.tag] == undefined){
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
    }else{
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }   
    } 
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product){
    // console.log("The product price is ",product.price);
    let cartCost = localStorage.getItem("totalCost") ;
    // console.log ( " My cartCost is " , cartCost ) ;
    // console.log ( typeof cartCost ) ;
    if (cartCost != null) {
        cartCost = parseInt ( cartCost ) ;
        localStorage.setItem ( "totalCost" , cartCost + product.price ) ;
    }else{
        localStorage.setItem ( "totalCost" , product.price ) ;
    }
}

// setInterval(()=>{
//     onLoadCartNumbers();
//     carts = document.querySelectorAll(".add-cart");
// }, 5000);
onLoadCartNumbers();



// const element = document.getElementById(".contact-container");
// const navabout = document.getElementById("#nav-about");

// navabout.addEventListener("click", () => {
//     element.scrollIntoView({
//         behavior: "smooth"
//     });
// })
