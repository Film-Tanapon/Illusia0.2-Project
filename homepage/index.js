const loadBtn = document.getElementById("load-btn");
const startBtn = document.getElementById("start-btn");
const settingBtn = document.getElementById("setting-btn");
const quitBtn = document.getElementById("quit-btn");
const loginText = document.getElementById("login");

const username = localStorage.getItem('username') || '';

startBtn.addEventListener("click", () =>{
    window.location.href = "storypage/story.html";
})

quitBtn.addEventListener("click", () =>{
    window.location.href = "https://www.google.com"; 
  });

document.getElementById("setting-btn").addEventListener("click", () => {
    window.location.href = "settingpage/setting.html";
});

window.addEventListener("load", () => {
    if (username){
        loginText.textContent = username;
        loadBtn.style.display = "block";
        startBtn.style.marginTop = "0";
        startBtn.textContent = "New Game";
        startBtn.style.top = "57%"; 
        settingBtn.style.top = "69%";
        quitBtn.style.top = "81%" ;
        loadBtn.style.fontSize = "200%";
        startBtn.style.fontSize = "200%";
        settingBtn.style.fontSize = "200%";
        quitBtn.style.fontSize = "200%";
    }
});