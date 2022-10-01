/* /////////////////////////////// START USER LOGIN & REGISTER VAlIDATION /////////////////////////////// */

// get users from local storags
var users = JSON.parse(localStorage.getItem("Users")) || [];
var showMsg = document.createElement("div");

function loadUserData() {
  var user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    document.getElementById("user").innerHTML = user.username;
    document.getElementById("user_login").innerHTML = "profile";
    document.getElementById("user_login").href = "/src/Pages/profile.html";
    document.getElementById("user_register").innerHTML = "logout";
    document.getElementById("user_register").href = "/src/Pages/logout.html";
  }
} // if user logged in show info in navbar

function profileInfo() {
  var user = JSON.parse(sessionStorage.getItem("user"));
  document.getElementById("profile_username").value = user.username;
  document.getElementById("profile_email").value = user.useremail;
  document
    .getElementById("profile_logout")
    .addEventListener("click", function () {
      location.replace("/src/Pages/logout.html");
    });
} // user profile page

// Registeration form
var newUserName;
var newUserEmail;
var newUserPass;
var confirmPass;
const registeration = document.getElementById("registeration");
if (registeration) {
  registeration.addEventListener("submit", addNewUser);
} // when user submit to register
const regName = document.getElementById("name");
const regEmail = document.getElementById("email");
const regPass = document.getElementById("password");
const regConfirm = document.getElementById("password-confirm");
if (regName) {
  regName.addEventListener("keyup", function () {
    validateName(document.getElementById("name").value);
  });
} //name validation

if (regEmail) {
  regEmail.addEventListener("keyup", function () {
    validateEmail(document.getElementById("email").value);
  });
} //email validation

if (regPass) {
  regPass.addEventListener("keyup", function () {
    validatePass(document.getElementById("password").value);
  });
} //password validation

if (regConfirm) {
  regConfirm.addEventListener("keyup", function () {
    let pass = document.getElementById("password").value;
    let confirm = document.getElementById("password-confirm").value;
    validateMatchPass(pass, confirm);
  });
} //password and confirm password validation

function addNewUser(event) {
  event.preventDefault();
  // get form input values
  newUserName = document.getElementById("name").value;
  newUserEmail = document.getElementById("email").value;
  newUserPass = document.getElementById("password").value;
  confirmPass = document.getElementById("password-confirm").value;

  // First validation on empty fields
  let emptyResult = checkEmptyFields(
    newUserName,
    newUserEmail,
    newUserPass,
    confirmPass
  );
  if (!emptyResult) {
    return errRegDiv.prepend(showMsg);
  }

  // Second validation on inputs regex
  let resultNameRegex = validateName(newUserName); //name input
  if (!resultNameRegex) {
    failedMsg("Name should be at least 3 characters");
    return errRegDiv.prepend(showMsg);
  }

  let resultEmailRegex = validateEmail(newUserEmail); //email input
  if (!resultEmailRegex) {
    failedMsg("Please enter valid email");
    return errRegDiv.prepend(showMsg);
  }

  let resultPassRegex = validatePass(newUserPass); //password input
  if (!resultPassRegex) {
    let errMsg = `<div>
                            <p class="my-0">Password should contains:</p>
                            <p class="my-0">Min 8 characters</p>
                            <p class="my-0">Max 16 characters</p>
                            <p class="my-0">Min 1 lowercase letter</p>
                            <p class="my-0">Min 1 uppercase letter</p>
                            <p class="my-0">Min 1 special character</p>
                            <p class="my-0">Min 1 number</p>
                      </div>`;
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
    userpassword: newUserPass,
  };
  users.push(userData);
  localStorage.setItem("Users", JSON.stringify(users)); // save user info to local storage
  sessionStorage.setItem("user", JSON.stringify(userData)); // save user info to session
  successMsg(
    "Registeration Success,<br/> Please wait unitll redirect to home page"
  );
  errRegDiv.appendChild(showMsg);
  // redirect to home page
  return redirect("/index.html", 1500);
} // end add new user function

// login form
var userEmail;
var userPass;
const errRegDiv = document.getElementById("registerErrors");
const errLoginDiv = document.getElementById("loginErrors");
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", login);
} // when user submit to login

function login(event) {
  event.preventDefault();
  // get form input values
  userEmail = document.getElementById("email").value;
  userPass = document.getElementById("password").value;

  // First validation on empty fields
  let emptyResult = checkEmptyFields(userEmail, userPass);
  if (!emptyResult) {
    return errLoginDiv.prepend(showMsg);
  }

  // Second validation on inputs regex
  let resultEmailRegex = validateEmail(userEmail); //email input
  if (!resultEmailRegex) {
    failedMsg("Please enter valid email");
    return errLoginDiv.prepend(showMsg);
  }

  // Third validation on user data exists in local storage or not

  // get user information from local storage by entered email
  let userInfo = getUserInfo(userEmail);

  // check entered email and password with email and password in local storage
  if (userEmail != userInfo.useremail || userPass != userInfo.userpassword) {
    failedMsg("Wrong email or password");
    return errLoginDiv.prepend(showMsg);
  }

  successMsg("Login Successfully");
  errLoginDiv.prepend(showMsg);
  sessionStorage.setItem("user", JSON.stringify(userInfo)); // save user info to session
  redirect("/index.html", 500);
} // end login function

function checkEmptyFields(...inputs) {
  for (let input of inputs) {
    if (input.length == 0) {
      failedMsg("All Fields Required");
      return false;
    }
  }
  return true;
} // end check empty fields function

function validateName(name) {
  let nameRegex = /^([a-zA-Z ]){3,30}$/;
  if (nameRegex.test(name)) {
    document.getElementById("name_error").innerHTML =
      '<i class="fa-regular fa-circle-check text-success"></i>';
    return true;
  } else {
    document.getElementById("name_error").innerHTML =
      '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    return false;
  }
} // end name validation function

function validateEmail(email) {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailRegex.test(email)) {
    if (document.getElementById("email_error")) {
      document.getElementById("email_error").innerHTML =
        '<i class="fa-regular fa-circle-check text-success"></i>';
    }
    return true;
  } else {
    if (document.getElementById("email_error")) {
      document.getElementById("email_error").innerHTML =
        '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    }
    return false;
  }
} // end email validation function

function validatePass(password) {
  let passRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
  if (passRegex.test(password)) {
    if (document.getElementById("password_error")) {
      document.getElementById("password_error").innerHTML =
        '<i class="fa-regular fa-circle-check text-success"></i>';
    }
    return true;
  } else {
    if (document.getElementById("password_error")) {
      document.getElementById("password_error").innerHTML =
        '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    }
    return false;
  }
} // end name password function

function validateMatchPass(p, c) {
  if (c.length == 0) {
    document.getElementById("password-confirm_error").innerHTML =
      '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    return false;
  }
  if (p == c) {
    document.getElementById("password-confirm_error").innerHTML =
      '<i class="fa-regular fa-circle-check text-success"></i>';
    return true;
  } else {
    document.getElementById("password-confirm_error").innerHTML =
      '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    return false;
  }
} // end match password function

function redirect(href, time) {
  setTimeout(() => {
    location.href = href;
  }, time);
} // end redirect to another page function

function failedMsg(msg) {
  showMsg.classList.remove("alert-success");
  showMsg.classList.add("text-center", "alert", "alert-danger", "mt-4");
  showMsg.setAttribute("role", "alert");
  showMsg.innerHTML = msg;
} // end failed message function

function successMsg(msg) {
  showMsg.classList.remove("alert-danger");
  showMsg.classList.add("text-center", "alert", "alert-success", "mt-4");
  showMsg.setAttribute("role", "alert");
  showMsg.innerHTML = msg;
} // end success message function

function getUserInfo(email) {
  for (let user of users) {
    if (user.useremail == email) {
      return {
        username: user.username,
        useremail: user.useremail,
        userpassword: user.userpassword,
      };
    }
  }
  return false;
} // end check user if exists function

/* /////////////////////////////// END USER LOGIN & REGISTER VAlIDATION /////////////////////////////// */

/* /////////////////////////////// PRODUCTS /////////////////////////////// */

let pro = document.querySelector("#product .container .row");
let notify = document.querySelector(".nav-item .nav-link .noti");
let product=document.querySelector("#pPRODUCT")



let req = new XMLHttpRequest();
req.open("GET", "https://dummyjson.com/products");
req.send();

//let jsfromjson = JSON.parse(req.responseText);
req.onreadystatechange = function () {
  if ((this.readyState === 4) & (this.status === 200)) {
    let jsfromjson = JSON.parse(this.responseText);
    let prouducts = jsfromjson.products;
    function CreatProuduct() {
      let p = prouducts.map((elm) => {
        let des = `<div class="card" style="width: 15rem;">
                <a href="/src/Pages/prouduct.html"onclick="ProuductSelect(${elm.id})">
                <img src="${elm.images[0]}" class="card-img-top" alt="...">
                <div class="card-body">
                <h4 class="card-title">${elm.title}</h4>
                <h5 class="card-title">${elm.category}</h5>
                <p class="card-text">${elm.description}</p>
                <a id="addtocart" class="btn btn-primary" onclick="clickOnCartButton(${elm.id})" >ADD TO CART</a>
                </div>
                </a>
                </div>`;
        return des;
      });
      if (pro) {
        pro.innerHTML = p.join(" ");
      }
    }
    CreatProuduct();
  }
};

function ProuductSelect(id){
  //location.replace('/src/Pages/prouduct.html')
  let jsfromjson = JSON.parse(req.responseText);
  let prouducts = jsfromjson.products;
  //console.log(prouducts)
  let arrr=prouducts.filter((elm)=>{
    return elm.id===id
  });
  localStorage.setItem('details',JSON.stringify(arrr))
 // console.log(arrfil);
}

if(product){
  desOnProuduct();
}
function desOnProuduct(){
  let arrfilq=localStorage.getItem('details')
  let arrfil=JSON.parse(arrfilq)[0];  
  let desc=`<div class="container mt-5 mb-5">
  <div class="row d-flex justify-content-center">
      <div class="col-md-10">
          <div class="card">
              <div class="row">
                  <div class="col-md-6">
                      <div class="images p-3">
                          <div class="text-center p-4"> <img id="main-image" src="${arrfil.images[0]}" width="250" /> </div>
                          <div class="thumbnail text-center"> <img onclick="change_image(this)" src="${arrfil.images[1]}" width="70"> <img onclick="change_image(this)" src="${arrfil.images[2]}" width="70"> </div>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="product p-4">
                          <div class="d-flex justify-content-between align-items-center">
                             <a href='/index.html'> <div class="d-flex align-items-center"> <i class="fa fa-long-arrow-left"></i> <span class="ml-1">Back</span> </div> <i class="fa fa-shopping-cart text-muted"></i>
                          </div>
                          <div class="mt-4 mb-3"> <span class="text-uppercase text-muted brand">${arrfil.brand}</span>
                              <h5 class="text-uppercase">${arrfil.title}</h5>
                              <div class="price d-flex flex-row align-items-center"> <span class="act-price">${arrfil.price}</span>
                                  <div class="ml-2"> <small class="dis-price">$59</small> <span>${arrfil.discountPercentage}%</span> </div>
                              </div>
                          </div>
                          <p class="about">${arrfil.description}</p>
                          <div class="sizes mt-5">
                              <h6 class="text-uppercase">Size</h6> <label class="radio"> <input type="radio" name="size" value="S" checked> <span>S</span> </label> <label class="radio"> <input type="radio" name="size" value="M"> <span>M</span> </label> <label class="radio"> <input type="radio" name="size" value="L"> <span>L</span> </label> <label class="radio"> <input type="radio" name="size" value="XL"> <span>XL</span> </label> <label class="radio"> <input type="radio" name="size" value="XXL"> <span>XXL</span> </label>
                          </div>
                          <div class="cart mt-4 align-items-center"> <button class="btn btn-danger text-uppercase mr-2 px-4 onclick="clickOnCartButton(${arrfil.id})">Add to cart</button> <i class="fa fa-heart text-muted"></i> <i class="fa fa-share-alt text-muted"></i> </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>`

product.innerHTML=desc;

}
function change_image(image){

  var container = document.getElementById("main-image");

 container.src = image.src;
}
document.addEventListener("DOMContentLoaded", function(event) {
});
/* /////////////////////////////// PRODUCTS /////////////////////////////// */

/* /////////////////////////////// CART /////////////////////////////// */
let cardProductDom = document.querySelector(".prouduct-cart");
var counter = 0;
let items = [];
let storage = JSON.parse(localStorage.getItem("products"));

if (storage) {
  items = storage;
} else {
  items = [];
}
//print values on popup cart
let popup = storage.map((elm) => {
  let designcart = `
  <div class="card mb-2 id=${elm.id}">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div class="d-flex flex-row align-items-center">
            <div>
              <img
                src="${elm.images[0]}"
                class="img-fluid rounded-3" alt="Shopping item" style="width: 65px;">
            </div>
            <div class="ms-3">
              <h6>${elm.title}</h6>
              <p class="small mb-0">256GB, Navy Blue</p>
            </div>
          </div>
          <div class="d-flex flex-row align-items-center">
            <div style="width: 50px;">
              <h5 class="fw-normal mb-0">2</h5>
            </div>
            <div style="width: 80px;">
              <h5 class="mb-0">${elm.price}</h5>
            </div>
            <a href="#!" style="color: #cecece;"><i class="fas fa-trash-alt"></i></a>
          </div>
        </div>
      </div>
    </div>    
  `;
  if (cardProductDom) {
    cardProductDom.innerHTML += designcart;
  }
});
function clickOnCartButton(id) {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((res) => {
      let arr = res.products;
      let truiTem = arr.find((elm) => elm.id === id);
      items.push(truiTem);
      localStorage.setItem("products", JSON.stringify(items));

      let designcart = `
  <div class="card mb-2 id=${truiTem.id}">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div class="d-flex flex-row align-items-center">
            <div>
              <img
                src="${truiTem.images[0]}"
                class="img-fluid rounded-3" alt="Shopping item" style="width: 65px;">
            </div>
            <div class="ms-3">
              <h6>${truiTem.title}</h6>
              <p class="small mb-0">256GB, Navy Blue</p>
            </div>
          </div>
          <div class="d-flex flex-row align-items-center">
            <div style="width: 50px;">
              <h5 class="fw-normal mb-0">2</h5>
            </div>
            <div style="width: 80px;">
              <h5 class="mb-0">${truiTem.price}</h5>
            </div>
            <a href="#!" style="color: #cecece;"><i class="fas fa-trash-alt"></i></a>
          </div>
        </div>
      </div>
    </div>    
  `;
      cardProductDom.innerHTML += designcart;
    });
  notify.innerHTML = items.length + 1;
}
if (notify) {
  notify.innerHTML = items.length;
}
//pop up for cart button
function menu() {
  var user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    location.replace("/src/Pages/login.html");
  } // guest user can't enter this page
  else {
    if (cardProductDom.innerHTML != "") {
      if (cardProductDom.style.display == "block") {
        cardProductDom.style.display = "none";
      } else {
        cardProductDom.style.display = "block";
      }
    }
  }
}

let locationINcart = document.querySelector(".container .card .productss");

if (storage) {
  cartPage();
} else {
  ``;
}
function cartPage() {
  let item = storage.map((elm) => {
    let produ = `<div class="card mb-3">
<div class="card-body">
  <div class="d-flex justify-content-between">
    <div class="d-flex flex-row align-items-center">
      <div>
        <img
          src="${elm.images[0]}"
          class="img-fluid rounded-3" alt="Shopping item" style="width: 65px;">
      </div>
      <div class="ms-3">
        <h5>${elm.title}</h5>
        <p class="small mb-0">${elm.description}</p>
      </div>
    </div>
    <div class="d-flex flex-row align-items-center">
      <div style="width: 50px;">
        <h5 class="fw-normal mb-0">2</h5>
      </div>
      <div style="width: 80px;">
        <h5 class="mb-0">${elm.price}</h5>
      </div>
      <a href="#!" style="color: #cecece;" onclick='removeItemfromCart(${elm.id})'><i class="fas fa-trash-alt"></i></a>
    </div>
  </div>
</div>
</div>`;
    if (locationINcart) {
      locationINcart.innerHTML += produ;
    }
  });
}
//removeItemfromCart();
function removeItemfromCart(id) {
  if (storage) {
    console.log(storage);
    let iitemes = storage.filter((elm) => elm.id !== id);
    console.log(iitemes);
    localStorage.setItem("products", JSON.stringify(iitemes));
  } else {
  }
}
let countOfitemInCart = document.querySelector(".countItem");
if (countOfitemInCart) {
  countOfitemInCart.innerHTML = `You have <span>${items.length}</span> items in your cart`;
}
//let getcartbutton=document.getElementById('addtocart');
//getcartbutton.addEventListener('click',function (){console.log("Hello")})
/* /////////////////////////////// CART /////////////////////////////// */
