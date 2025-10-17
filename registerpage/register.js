const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const backgroundAlert = document.getElementById('alert-background');
const successAlert = document.getElementById('success-alert');
const failFillAlert = document.getElementById('fail-fill-alert');
const failPasswordAlert = document.getElementById('fail-password-alert');
const failLenghtAlert = document.getElementById('fail-lenght-alert');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const openPassword = document.getElementById('open-password');
const closePassword = document.getElementById('close-password');
const openConfirmPassword = document.getElementById('open-confirm-password');
const closeConfirmPassword = document.getElementById('close-confirm-password');


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // ✅ ตรวจสอบค่าว่าง
    if (!username || !email || !password || !confirmPassword) {
        backgroundAlert.style.display = "flex";
        failFillAlert.style.display = "flex";

        setTimeout(() => {
            backgroundAlert.style.display = "none";
            failFillAlert.style.display = "none";
        }, 3000);
        return;
    }

    // ✅ ตรวจสอบ password match
    if (password !== confirmPassword) {
        backgroundAlert.style.display = "flex";
        failPasswordAlert.style.display = "flex";

        setTimeout(() => {
            backgroundAlert.style.display = "none";
            failPasswordAlert.style.display = "none";
        }, 3000);
        return;
    }

    // ✅ ตรวจสอบความยาวขั้นต่ำ
    if (password.length < 6) {
        backgroundAlert.style.display = "flex";
        failLenghtAlert.style.display = "flex";

        setTimeout(() => {
            backgroundAlert.style.display = "none";
            failLenghtAlert.style.display = "none";
        }, 3000);
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
            backgroundAlert.style.display = "flex";
            successAlert.style.display = "flex";

            setTimeout(() => {
                backgroundAlert.style.display = "none";
                successAlert = "none";
            }, 3000);
            window.location.href = "../loginpage/login.html";
        } else {
            alert('Registration failed: ' + (data.error || 'Unknown error'));
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred. Please try again.');
    }
    
});

openPassword.addEventListener('click', ()=>{
    closePassword.style.display = "flex";
    openPassword.style.display = "none";
    password.type = "password";
})

closePassword.addEventListener('click', ()=>{
    closePassword.style.display = "none";
    openPassword.style.display = "flex";
    password.type = "text";
})

openConfirmPassword.addEventListener('click', ()=>{
    closeConfirmPassword.style.display = "flex";
    openConfirmPassword.style.display = "none";
    confirmPassword.type = "password";
})

closeConfirmPassword.addEventListener('click', ()=>{
    closeConfirmPassword.style.display = "none";
    openConfirmPassword.style.display = "flex";
    confirmPassword.type = "text";
})