const screen = document.getElementById("screen");
const readBtn = document.getElementById("read-btn");
const pauseBtn = document.getElementById("pause-btn");
const characterBoxLeft = document.getElementById("character-box-left");
const characterBoxRight = document.getElementById("character-box-right");
const textBox = document.getElementById("text-box");
const storyText = document.getElementById("story-text");
const contiText = document.getElementById("conti-text");
const readbook_container = document.getElementById("readbook-container");
const book_text = document.getElementById("book-text");
const choices = document.getElementById("choices");
const choiceBtn1 = document.getElementById("choice-1");
const choiceBtn2 = document.getElementById("choice-2");
const background = document.getElementById("background");
const allTextBox = document.getElementById("alltext-box");
const allText = document.getElementById("all-text");
const exitTextBtn = document.getElementById("exit-text-btn");

const pauseMenu = document.getElementById("pause-menu");
const resumeBtn = document.getElementById("resume-btn");
const restartBtn = document.getElementById("restart-btn");
const mainBtn = document.getElementById("main-btn");

const warningContainer = document.getElementById("warning-container");
const warningCancel = document.getElementById("cancel-warning");
const warningConfirm = document.getElementById("confirm-warning");

const loadingScreen = document.getElementById("load-image");
const preloadPercent = document.getElementById("preload-percent");
const preloadBar = document.getElementById("preload-bar");

const mapBtn = document.getElementById("map-btn");
const mapFrame = document.getElementById("map-frame");
const mapContainer = document.getElementById("scene-block");
const closeMapBtn = document.getElementById("close-map-btn");

const music = document.getElementById("music");

let sceneHistory = [];
let gameVariables = {};
let currentScene = "1";
let activeSaveSlot = null;
let autoSaveTimer = null;

let typeInterval = null;
let all_text = "";
let isTyping = false;
let advanceLock = false;
let hasFinishedTyping = false;
let pause = false;

let story = {}
const API_URL = "https://illusia-backend.onrender.com";
async function loadStoryFromBackend() {
    try {
        const res = await fetch("https://illusia-backend.onrender.com/story");
        const data = await res.json();

        // แปลง array จาก DB → object แบบ story[scene_id] = {...}
        data.forEach(scene => {
            story[scene.scene_id] = {
                text: scene.text,
                music: scene.music,
                background: scene.background,
                character: scene.character,
                characterleft: scene.character_left,
                characterright: scene.character_right,
                delay: scene.delay,
                diarytext: scene.diarytext,
                choice1: scene.choice1_text,
                choice1_next: scene.choice1_next,
                choice2: scene.choice2_text,
                choice2_next: scene.choice2_next,
                choice_position_top1: scene.choice_position_top1,
                choice_position_left1: scene.choice_position_left1,
                choice_position_top2: scene.choice_position_top2,
                choice_position_left2: scene.choice_position_left2,
                next: scene.next
            };
        });

        console.log("✅ Story loaded:", story);
    } catch (err) {
        console.error("❌ Failed to load story:", err);
    }
}


function preloadAllImages(storyObj, callback) {
    const images = [];
    for (const key in storyObj) {
        const scene = storyObj[key];
        if (scene.background) images.push(scene.background);
        if (scene.characterleft) images.push(scene.characterleft);
        if (scene.characterright) images.push(scene.characterright);
    }

    const total = images.length;
    let loaded = 0;

    images.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = img.onerror = () => {
            loaded++;
            const percent = Math.round((loaded / total) * 100);
            preloadBar.style.width = percent + "%";
            preloadPercent.textContent = percent + "%";

            if (loaded === total) {
                setTimeout(() => {
                    loadingScreen.style.display = "none";
                    callback();
                }, 500);
            }
        };
    });

    if (images.length === 0) {
        loadingScreen.style.display = "none";
        callback();
    }
}

function loadScene(scene, skipHistoryPush = false) {
    currentScene = scene;
    const sceneData = story[scene];
    storyText.textContent = "";

    mapBtn.style.display = "none";
    readbook_container.style.display = "none";
    readBtn.style.display = "none";
    pauseBtn.style.display = "none";
    textBox.style.display = "none";
    contiText.style.display = "none";
    characterBoxLeft.style.display = "none";
    characterBoxRight.style.display = "none";
    choiceBtn1.style.display = "none";
    choiceBtn2.style.display = "none";

    document.body.style.backgroundImage = `url(${sceneData.background})`;

    if (!skipHistoryPush) {
        // ถ้าไม่ได้สั่งข้าม (เช่น เล่นปกติ) ให้เก็บประวัติ
        sceneHistory.push(scene);
    }

    if(sceneData.music){
        music.src = sceneData.music;
    }

    triggerAutoSave();

    if (sceneData.delay) {
        setTimeout(() => {
            if (sceneData.next) loadScene(sceneData.next);
        }, sceneData.delay);
        return;
    }

    if (sceneData.characterleft) {
        setTimeout(() => {
            characterBoxLeft.style.backgroundImage = `url(${sceneData.characterleft})`;
            characterBoxLeft.style.display = "flex";
        }, sceneData.delay || 500);
    }

    if (sceneData.characterright) {
        setTimeout(() => {
            characterBoxRight.style.backgroundImage = `url(${sceneData.characterright})`;
            characterBoxRight.style.display = "flex";
        }, sceneData.delay || 500);
    }

    if (sceneData.text) {
        setTimeout(() => {
            readBtn.style.display = "flex";
            pauseBtn.style.display = "flex";
            mapBtn.style.display = "flex";

            advanceLock = false;

            if (skipHistoryPush) {
                hasFinishedTyping = true; 
            }

            advanceLock = false;
            typeWriter(sceneData.text, () => {
                contiText.style.display = "flex";
            });
        }, sceneData.delay || 500);
    }

    if (sceneData.diarytext) {
        advanceLock = false;
        readbook_container.style.display = "flex";
        book_text.innerHTML = sceneData.diarytext.replace(/\n/g, "<br>").replace(/\\n/g, "<br>");
    }

    if(sceneData.choice1 && sceneData.choice2){
        choiceSetup(sceneData);
    }
}


function typeWriter(text, callback) {
    let i = 0;
    storyText.textContent = "";
    isTyping = true;
    hasFinishedTyping = false;
    textBox.style.display = "flex";
    let textSpeed = localStorage.getItem('textSpeed') || 5;
    let delayLetter = 60;
    if (textSpeed == 1) {
        delayLetter = 120;
    } else if (textSpeed == 2) {
        delayLetter = 60;
    } else if (textSpeed == 3) {
        delayLetter = 30;
    }

    typeInterval = setInterval(() => {
        if (text.charAt(i) === "\n") {
            storyText.innerHTML += "<br>";
        } else if (text.charAt(i) === '\\' && text.charAt(i + 1) === 'n') {
            storyText.innerHTML += "<br>";
            i++;
        } else {
            storyText.innerHTML += text.charAt(i);
        }
        i++;
        if (i >= text.length) {
            clearInterval(typeInterval);
            isTyping = false;
            if (!hasFinishedTyping) {
                allText.innerHTML += storyText.innerHTML.replace(/\n/g, "<br>") + "<br><br>";
                hasFinishedTyping = true;
            }
            callback?.();
        }
    }, delayLetter)
}

function fullText(text) {
    clearInterval(typeInterval);
    isTyping = false;

    storyText.innerHTML = text.replace(/\n/g, "<br>").replace(/\\n/g, "<br>");
    if (!hasFinishedTyping) {
        allText.innerHTML += text.replace(/\n/g, "<br>").replace(/\\n/g, "<br>") + "<br><br>";
        hasFinishedTyping = true;
    }
    contiText.style.display = "flex";
}

function rebuildTextLog() {
    console.log("Rebuilding text log from history...");
    allText.innerHTML = ""; // เคลียร์ log เก่า (ถ้ามี)

    //ไม่เอาฉากท้ายสุด
    const historyToLog = sceneHistory.slice(0, -1);

    // 1. วนลูปตามประวัติฉากที่เล่นมาทั้งหมด
    for (const sceneId of historyToLog) {
        const sceneData = story[sceneId];

        // 2. เช็กว่าฉากนี้มี 'text' หรือไม่
        if (sceneData && sceneData.text) {
            
            // 3. (สำคัญ) เพิ่มข้อความลงใน 'allText'
            // เราใช้ .replace() เพื่อจัดรูปแบบ \n ให้เป็น <br>
            // เหมือนกับที่ทำในฟังก์ชัน fullText
            const formattedText = sceneData.text.replace(/\n/g, "<br>").replace(/\\n/g, "<br>");
            allText.innerHTML += formattedText + "<br><br>";
        }   
    }
    console.log("✅ Text log rebuilt.");
}

function choiceSetup(sceneData) {
    advanceLock = false;
    textBox.style.display = "none";
    contiText.style.display = "none";
    characterBoxLeft.style.display = "none";
    characterBoxRight.style.display = "none";

    if (sceneData.choice1) {
        choiceBtn1.style.display = "flex";
        choiceBtn1.innerHTML = sceneData.choice1;
        choiceBtn1.style.top = sceneData.choice_position_top1;
        choiceBtn1.style.left = sceneData.choice_position_left1;
        choiceBtn1.onclick = () => {
            if (advanceLock) return;
            advanceLock = true;
            loadScene(sceneData.choice1_next);
        };
    }
    if (sceneData.choice2) {
        choiceBtn2.style.display = "flex";
        choiceBtn2.innerHTML = sceneData.choice2;
        choiceBtn2.style.top = sceneData.choice_position_top2;
        choiceBtn2.style.left = sceneData.choice_position_left2;
        choiceBtn2.onclick = () => {
            if (advanceLock) return;
            advanceLock = true;
            loadScene(sceneData.choice2_next);
        };
    }
}

function proceedStory() {
    if(pause) return;
    if (advanceLock || isTyping) return;
    const sceneData = story[currentScene];

    if (currentScene === "end") {
        window.location.href = "index.html";
        return;
    }

    if (sceneData.choice1 || sceneData.choice2) {
        choiceSetup(sceneData);
    } else if (sceneData.next) {
        advanceLock = true;
        loadScene(sceneData.next);
    }
}

/**
 * สร้างและแสดงผล Flowchart
 * 🚀 [แก้ไข: แสดงเฉพาะฉากที่เคยเล่นถึง (Visited)]
 */
function generateFlowchart() {
    // เคลียร์ Map เก่า
    mapContainer.innerHTML = "";

    // 1. 🚀 (สำคัญ) เอา 'knownScenes' และ 'for loop' ออก
    // เราต้องการแค่ Set ของฉากที่เคยไปแล้ว
    const visitedScenes = new Set(sceneHistory);

    // 2. ใช้อัลกอริทึม BFS สร้าง Map ทีละแถว (เหมือนเดิม)
    const allNodes = new Set();
    let queue = ["1"];

    while (queue.length > 0) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "flow-row";

        const nextQueue = [];
        let nextRowHasVisitedNodes = false; // 👈 [เพิ่ม] เช็กว่าแถวถัดไปมี Node ที่เราเคยไปไหม

        // 3. วนลูปสร้าง Node ทั้งหมดในแถวปัจจุบัน
        for (const sceneId of queue) {
            if (allNodes.has(sceneId)) continue;

            const scene = story[sceneId];
            if (!scene) continue;

            allNodes.add(sceneId);

            // 4. สร้าง Node
            const node = document.createElement("div");
            node.className = "flow-node";

            // 🚀 [เพิ่ม] ตั้งค่ารูปภาพ (จากโค้ดก่อนหน้า)
            if (scene.background) {
                node.style.backgroundImage = `url(${scene.background})`;
            } else {
                node.textContent = sceneId;
                node.style.backgroundColor = "#111";
            }

            // 5. 🚀 [แก้ไข] กำหนดสถานะ
            if (visitedScenes.has(sceneId)) {
                node.classList.add("visited");
            } else {
                // ถ้ายังไม่เคยไป ให้ซ่อนเลย
                node.classList.add("unknown"); // (CSS สั่ง display: none)
            }

            // 🚀 [สำคัญ] เราต้อง appendChild 'ทุก' Node 
            // (แม้แต่ Node ที่ซ่อนอยู่) เพื่อรักษา Layout ของ Flexbox
            rowDiv.appendChild(node);

            // 6. เพิ่มฉากถัดไป (Next/Choices) ลงในคิว (เหมือนเดิม)
            if (scene.next && !allNodes.has(scene.next)) {
                nextQueue.push(scene.next);
                // 🚀 [เพิ่ม] เช็กว่าฉากถัดไปที่เราจะไปต่อนั้น 'เคยไป' หรือไม่
                if (visitedScenes.has(scene.next)) nextRowHasVisitedNodes = true;
            }
            if (scene.choice1_next && !allNodes.has(scene.choice1_next)) {
                nextQueue.push(scene.choice1_next);
                if (visitedScenes.has(scene.choice1_next)) nextRowHasVisitedNodes = true;
            }
            if (scene.choice2_next && !allNodes.has(scene.choice2_next)) {
                nextQueue.push(scene.choice2_next);
                if (visitedScenes.has(scene.choice2_next)) nextRowHasVisitedNodes = true;
            }
        }

        // 7. เพิ่มแถว (Row) ลงใน Map
        mapContainer.appendChild(rowDiv);

        // 8. 🚀 [แก้ไข] เพิ่มเส้นเชื่อม (Line)
        // ต่อเมื่อ 'แถวถัดไป' มี Node ที่เรา 'เคยไป' เท่านั้น
        if (nextQueue.length > 0 && nextRowHasVisitedNodes) {
            const line = document.createElement("div");
            line.className = "flow-line";
            mapContainer.appendChild(line);
        }

        // 9. อัปเดตคิว (เหมือนเดิม)
        queue = [...new Set(nextQueue)];
    }
}

function preloadNextImages(currentScene, count = 5) {
    const keys = Object.keys(story);
    const index = keys.indexOf(currentScene);

    if (index === -1) return;

    const nextKeys = keys.slice(index + 1, index + 1 + count);

    nextKeys.forEach(key => {
        const scene = story[key];
        if (scene.background) {
            const img = new Image();
            img.src = scene.background;
        }
        if (scene.characterleft) {
            const img = new Image();
            img.src = scene.characterleft;
        }
        if (scene.characterright) {
            const img = new Image();
            img.src = scene.characterright;
        }
    });
}

// 🚀 เพิ่ม: ฟังก์ชันตรวจสอบและโหลดเซฟ (จาก Homepage)
function checkAndLoadSave() {
    const saveDataString = localStorage.getItem('selected_save');

    if (saveDataString) {
        try {
            const save = JSON.parse(saveDataString);

            // 1. 🚀 กู้คืนข้อมูลสำคัญ
            activeSaveSlot = save; // 👈 เก็บข้อมูลเซฟไว้ (สำคัญมาก)
            sceneHistory = JSON.parse(save.scene_history);
            gameVariables = JSON.parse(save.variables || "{}");

            // 2. ตั้งค่าฉากปัจจุบัน (ฉากสุดท้ายในประวัติ)
            currentScene = sceneHistory[sceneHistory.length - 1];

            // 3. ลบไฟล์เซฟชั่วคราวทิ้ง
            localStorage.removeItem('selected_save');

            console.log("✅ Save file loaded:", activeSaveSlot.id);
            return true; // โหลดสำเร็จ

        } catch (err) {
            console.error("❌ Failed to parse save file:", err);
            localStorage.removeItem('selected_save');
            return false;
        }
    }
    // ถ้าไม่เจอ 'selected_save' (เช่น ไม่ได้ login หรือแค่กด Start)
    // ให้เริ่มเกมใหม่ปกติ
    sceneHistory = ["1"]; // 👈 เริ่มประวัติใหม่
    currentScene = "1";
    return false; // ไม่มีการโหลด
}

function triggerAutoSave() {
    // ถ้าไม่มีเซฟที่กำลังเล่นอยู่ (เช่น ไม่ได้ login) ก็ไม่ต้องทำอะไร
    if (!activeSaveSlot) {
        return;
    }

    // ล้าง timer เก่า (ถ้ามี)
    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
    }

    // ตั้งเวลาใหม่: ให้รอ 2 วินาทีหลังจากฉากเปลี่ยน ค่อยเซฟ
    autoSaveTimer = setTimeout(autoSaveGame, 2000);
}

// 🚀 เพิ่ม: ฟังก์ชัน Auto-save (ตัวจริง)
async function autoSaveGame() {
    if (!activeSaveSlot) return; // ยืนยันอีกครั้ง

    console.log("Auto-saving game...");

    // รวบรวมข้อมูลปัจจุบัน
    const saveData = {
        current_scene: currentScene,
        scene_history: JSON.stringify(sceneHistory),
        variables: JSON.stringify(gameVariables)
        // เราจะส่ง 3 อย่างนี้ไปให้ API
    };

    try {
        const res = await fetch(`${API_URL}/saves/${activeSaveSlot.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saveData)
        });

        const data = await res.json();
        if (data.success) {
            console.log("✅ Auto-save successful.");
        } else {
            console.warn("Auto-save failed:", data.error);
        }
    } catch (err) {
        console.error("Auto-save connection error:", err);
    }
}

readbook_container.addEventListener("click", () => {
    if (advanceLock) return;
    readbook_container.style.display = "none";
    proceedStory();
});

textBox.addEventListener("click", () => {
    if (advanceLock) return;
    if (isTyping) {
        fullText(story[currentScene].text);
    } else {
        proceedStory();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        if (advanceLock) return;
        if (isTyping) {
            fullText(story[currentScene].text);
        } else {
            proceedStory();
        }
    }
});

readBtn.addEventListener("click", () => {
    pause = true;
    music.pause();
    background.style.display = "flex";
    allTextBox.style.display = "flex";
});

exitTextBtn.addEventListener("click", () => {
    pause = false;
    background.style.display = "none";
    allTextBox.style.display = "none";
    music.play();
});

background.addEventListener("click", () => {
    music.play();
    background.style.display = "none";
    allTextBox.style.display = "none";
    pauseMenu.style.display = "none";
});

pauseBtn.addEventListener("click", () => {
    music.pause();
    pause = true;
    background.style.display = "flex";
    pauseMenu.style.display = "flex";
});

mapBtn.addEventListener("click", () => {
    music.pause();
});

resumeBtn.addEventListener("click", () => {
    music.play();
    pause = false;
    background.style.display = "none";
    pauseMenu.style.display = "none";
});

restartBtn.addEventListener("click", () => {
    window.location.reload();
});

mainBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
});

mapBtn.addEventListener("click", () => {
    pause = true;
    // สร้าง Map ใหม่ทุกครั้ง
    generateFlowchart();
    // แสดง Map
    mapFrame.style.display = "block";
});

// เพิ่มปุ่มปิด Map
closeMapBtn.addEventListener("click", () => {
    pause = false;
    music.play();
    mapFrame.style.display = "none";
});

warningCancel.addEventListener("click", () =>{
    window.location.href = "../index.html";
});

window.addEventListener("load", async () => {
    let textsize = localStorage.getItem("textSize") || 'medium';

    if(textsize === 'small'){
        storyText.style.fontSize = '16px';
        allText.style.fontSize = '16px';
        readbook_container.style.fontSize = '16px';
    }else if(textsize === 'large'){
        storyText.style.fontSize = '22px';
        allText.style.fontSize = '22px';
        readbook_container.style.fontSize = '22px';
    }else{
        storyText.style.fontSize = '18px';
        allText.style.fontSize = '18px';
        readbook_container.style.fontSize = '18px';
    }
    
    const saveLoaded = checkAndLoadSave();
    await loadStoryFromBackend();

    if (saveLoaded) {
        rebuildTextLog();
    }
    const savedMusicVolume = localStorage.getItem('musicVolume') || 50;
    music.volume = savedMusicVolume / 100;

    preloadAllImages(story, () => {
        warningContainer.style.display = "flex";
        warningConfirm.addEventListener("click",() =>{
            loadScene(currentScene, saveLoaded);
            music.play();
            warningContainer.style.display = "none";
        });
    });
});