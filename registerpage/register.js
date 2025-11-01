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


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

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
        }, 2000); // ยืดเวลาเป็น 2 วิ
    };

    // ✅ ตรวจสอบค่าว่าง
    if (!username || !email || !password || !confirmPassword) {
        showAlert("Please fill in all fields.");
        return;
    }
    
    // ✅ ตรวจสอบว่า email มี @ กี่ตัว (0, 1, 2, ...)
    const atCount = email.split('@').length - 1;
    if (atCount !== 1) {
        showAlert("Email must contain exactly one '@' symbol.");
        return;
    }
    
    // ✅ ตรวจสอบ password match
    if (password !== confirmPassword) {
        showAlert("Passwords do not match. Please ensure both passwords are the same.");
        return;
    }

    //ตรวจสอบพาสเวิด ความปลอดภัย
    const passwordRegex = /^(?=.*[A-Z]).{6,}$/; //เป็นการบอกว่าต้องมีพิมพ์ใหญ๋ และความยาวอยู่ที่ 6 ตัวขึ้นไป
    if (!passwordRegex.test(password)) {
        showAlert("Password must be at least 6 characters and contain 1 uppercase letter.");
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
                successAlert.style.display = "none";
                window.location.href = "../loginpage/login.html";
            }, 1500);
            
        } else {
            showAlert('Registration failed: ' + (data.error || 'Username or email may already exist.'));
        }
    } catch (err) {
        console.error(err);
        showAlert('An error occurred. Please try again.');
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