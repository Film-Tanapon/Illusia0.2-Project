const startBtn = document.getElementById("start-btn");
const settingBtn = document.getElementById("setting-btn");
const quitBtn = document.getElementById("quit-btn");



startBtn.addEventListener("click", () =>{
    window.location.href = "story.html";
})

quitBtn.addEventListener("click", () =>{
    window.location.href = "https://www.google.com"; 
  });

document.getElementById("setting-btn").addEventListener("click", () => {
    window.location.href = "setting.html";
});