const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const successAlert = document.getElementById('login-success-alert');
const failAlert = document.getElementById('login-fail-alert');
const alertBg = document.getElementById('alert-background');
const passwordDisplay = document.getElementById('password');
const openPassword = document.getElementById('open-password');
const closePassword = document.getElementById('close-password');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch("https://illusia-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      // ✅ save username ลง LocalStorage
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("username", data.user.username);

      showAlert(successAlert);

      // redirect ไปหน้าอื่น (เช่น home)
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);

    } else {
      showAlert(failAlert);
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert(failAlert);
  }
});

function showAlert(alertBox) {
    alertBg.style.display = 'block';   // ใช้ alertBg ที่เราประกาศแล้ว
    alertBox.style.display = 'flex';

    setTimeout(() => {
        alertBox.style.display = 'none';
        alertBg.style.display = 'none';
    }, 2000);
}

openPassword.addEventListener('click', ()=>{
    closePassword.style.display = "flex";
    openPassword.style.display = "none";
    passwordDisplay.type = "password";
})

closePassword.addEventListener('click', ()=>{
    closePassword.style.display = "none";
    openPassword.style.display = "flex";
    passwordDisplay.type = "text";
})