const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const backgroundAlert = document.getElementById('alert-background');
const successAlert = document.getElementById('success-alert');
const failAlert = document.getElementById('fail-alert');
const openPassword = document.getElementById('open-password');
const closePassword = document.getElementById('close-password');
const openConfirmPassword = document.getElementById('open-confirm-password');
const closeConfirmPassword = document.getElementById('close-confirm-password');

const usernameError = document.getElementById('username-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    usernameError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";
    confirmPasswordError.style.display = "none";

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    const showAlert = (message) => {
        backgroundAlert.style.display = "flex";
        failAlert.innerHTML = `${message}<i class='bx bx-x'></i>`;
        failAlert.style.display = "flex";

        setTimeout(() => {
            backgroundAlert.style.display = "none";
            failAlert.innerHTML = "";
            failAlert.style.display = "none";
        }, 3000);
    };

    // ✅ ตรวจสอบค่าว่าง
    if (!username || !email || !password || !confirmPassword) {
        if(!username){
            usernameError.innerHTML = "<i class='bx bx-x'></i>Please enter your username.";
            usernameError.style.display = "flex";
        }

        if(!email){
            emailError.innerHTML = "<i class='bx bx-x'></i>Please enter your email.";
            emailError.style.display = "flex";
        }

        if(!password){
            passwordError.innerHTML = "<i class='bx bx-x'></i>Please enter your password.";
            passwordError.style.display = "flex";
        }
        if(!confirmPassword){
            confirmPasswordError.innerHTML = "<i class='bx bx-x'></i>Please enter your confirm password.";
            confirmPasswordError.style.display = "flex";
        }
        return;
    }
    
    // ✅ ตรวจสอบว่า email มี @ กี่ตัว (0, 1, 2, ...)
    const atCount = email.split('@').length - 1;
    if (atCount !== 1) {
        emailError.innerHTML = "<i class='bx bx-x'></i>Email must contain exactly one '@' symbol."
        emailError.style.display = "flex";
        return;
    }
    
    const passwordRegex = /^(?=.*[A-Z]).{6,}$/; //เป็นการบอกว่าต้องมีพิมพ์ใหญ๋ และความยาวอยู่ที่ 6 ตัวขึ้นไป
    if (!passwordRegex.test(password)) {
        passwordError.innerHTML = "<i class='bx bx-x'></i>Password must match the required format."
        passwordError.style.display = "flex";
        return;
    }

    if (password !== confirmPassword) {
        passwordError.innerHTML = "<i class='bx bx-x'></i>Please ensure both passwords are the same."
        passwordError.style.display = "flex";
        return;
    }

    try {
        const res = await fetch("https://illusia-backend.onrender.com/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (data.success) {
            failAlert.style.display = "none"; 
            failAlert.innerHTML = "";

            backgroundAlert.style.display = "flex";
            successAlert.style.display = "flex";

            setTimeout(() => {
                backgroundAlert.style.display = "none";
                successAlert.style.display = "none";
                window.location.href = "../loginpage/login.html";
            }, 2500);
            
        } else if(data.error === "Username already taken."){
            usernameError.innerHTML = "<i class='bx bx-x'></i>This Username is already taken."
            usernameError.style.display = "flex";
        }else if(data.error === "Email already taken."){
            emailError.innerHTML = "<i class='bx bx-x'></i>This Email is already taken."
            emailError.style.display = "flex";
        }
    } catch (err) {
        console.error(err);
        showAlert('Failed to retrieve data. Please try again.');
    }
    
});

openPassword.addEventListener('click', ()=>{
    closePassword.style.display = "flex";
    openPassword.style.display = "none";
    passwordInput.type = "password";
})

closePassword.addEventListener('click', ()=>{
    closePassword.style.display = "none";
    openPassword.style.display = "flex";
    passwordInput.type = "text";
})

openConfirmPassword.addEventListener('click', ()=>{
    closeConfirmPassword.style.display = "flex";
    openConfirmPassword.style.display = "none";
    confirmPasswordInput.type = "password";
})

closeConfirmPassword.addEventListener('click', ()=>{
    closeConfirmPassword.style.display = "none";
    openConfirmPassword.style.display = "flex";
    confirmPasswordInput.type = "text";
})