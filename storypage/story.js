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

const sfx = document.getElementById("sfx");
const music = document.getElementById("music");

let sceneHistory = [];
let gameVariables = {};
let currentScene = "1";
let activeSaveSlot = null;
let autoSaveTimer = null;
let endscene = ["BadEnd", "DeathEnd", "TrueEnd"];

let typeInterval = null;
let all_text = "";
let isTyping = false;
let advanceLock = false;
let hasFinishedTyping = false;
let pause = false;

const imageCache = {};

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
                sfx: scene.sfx,
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


function getNextSceneIds(sceneId, depth = 4) {
    const nextIds = new Set();
    let queue = [sceneId];

    // กันพลาดเผื่อ story ยังไม่โหลด
    if (!story || Object.keys(story).length === 0) return [];

    for (let i = 0; i < depth; i++) {
        const nextQueue = [];
        for (const id of queue) {
            const scene = story[id];
            if (scene) {
                if (scene.next) nextQueue.push(scene.next);
                if (scene.choice1_next) nextQueue.push(scene.choice1_next);
                if (scene.choice2_next) nextQueue.push(scene.choice2_next);
            }
        }
        nextQueue.forEach(id => nextIds.add(id));
        queue = [...new Set(nextQueue)]; // เอาตัวซ้ำออก
    }
    return [...nextIds];
}

function preloadScenes(sceneIds, onProgress, onComplete) {
    if (!story) {
        onComplete?.();
        return;
    }

    const imagesToLoad = new Set();
    const uniqueSceneIds = [...new Set(sceneIds)]; // กันฉากซ้ำ

    uniqueSceneIds.forEach(sceneId => {
        const scene = story[sceneId];
        if (scene) {
            if (scene.background) imagesToLoad.add(scene.background);
            if (scene.characterleft) imagesToLoad.add(scene.characterleft);
            if (scene.characterright) imagesToLoad.add(scene.characterright);
        }
    });

    // กรองเอาเฉพาะรูปที่ยังไม่อยู่ใน cache
    const newImages = [...imagesToLoad].filter(src => !imageCache[src]);

    if (newImages.length === 0) {
        onProgress?.(1, 1);
        onComplete?.();
        return;
    }

    let loaded = 0;
    const total = newImages.length;

    newImages.forEach(src => {
        const img = new Image();
        img.src = src;
        imageCache[src] = img; // 👈 [สำคัญ] เก็บเข้า cache ทันที

        img.onload = img.onerror = () => {
            loaded++;
            onProgress?.(loaded, total);
            if (loaded === total) {
                onComplete?.();
            }
        };
    });
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
        music.play();
    }

    if(sceneData.sfx){
        sfx.src = sceneData.sfx;
        sfx.currentTime = 0;
        sfx.play();
    }

    if (endscene.includes(currentScene)) {
        mapBtn.style.display = "flex";
        readBtn.style.display = "flex";
        pauseBtn.style.display = "flex";
        return;
    }

    triggerAutoSave();

    const nextScenesToPreload = getNextSceneIds(scene, 2);
    if (nextScenesToPreload.length > 0) {
        preloadScenes(nextScenesToPreload); 
    }

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

    if (endscene.includes(currentScene)) {
        return;
    }

    if (sceneData.choice1 || sceneData.choice2) {
        choiceSetup(sceneData);
    } else if (sceneData.next) {
        advanceLock = true;
        sfx.pause();
        loadScene(sceneData.next);
    }
}

function generateFlowchart() {
    // 1. เคลียร์ Map เก่า
    mapContainer.innerHTML = "";

    // 2. 🚀 [ใหม่] วนลูปตามประวัติการเล่น (sceneHistory)
    // เราจะแสดงเฉพาะฉากที่ผู้เล่นเคยผ่านมาแล้วเท่านั้น
    for (let i = 0; i < sceneHistory.length; i++) {
        const sceneId = sceneHistory[i];
        const scene = story[sceneId];

        // 3. ถ้าไม่มีฉาก หรือฉากไม่มีรูปพื้นหลัง ก็ข้ามไป
        // (เราสนใจเฉพาะฉากที่มีรูปภาพ)
        if (!scene || !scene.background) {
            continue;
        }

        // 4. สร้าง Node (รูปภาพ)
        const node = document.createElement("div");
        node.className = "flow-node visited"; // ใช้ class เดิมเพื่อให้ CSS ทำงาน
        node.style.backgroundImage = `url(${scene.background})`;

        // 5. 🚀 [สำคัญ] เพิ่ม Node ลงใน mapContainer โดยตรง
        mapContainer.appendChild(node);

        // 6. 🚀 [ใหม่] เพิ่มเส้นเชื่อม (Line) ระหว่าง Node
        // (ตราบใดที่นี่ไม่ใช่ Node สุดท้าย)
        if (i < sceneHistory.length - 1) {
            
            // เช็กซ้ำอีกทีว่าฉากถัดไปในประวัติมีรูปไหม ถ้าไม่มีก็ไม่ต้องลากเส้น
            const nextSceneId = sceneHistory[i + 1];
            const nextScene = story[nextSceneId];
            
            if (nextScene && nextScene.background) {
                const line = document.createElement("div");
                line.className = "flow-line";
                mapContainer.appendChild(line);
            }
        }
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

function findLastMusicInHistory() {
    // ตรวจสอบว่ามี story และ sceneHistory พร้อมใช้งานหรือไม่
    if (!story || !sceneHistory || sceneHistory.length === 0) {
        return null;
    }

    // วนลูปย้อนหลังในประวัติทั้งหมด (รวมฉากปัจจุบันด้วย)
    for (let i = sceneHistory.length - 1; i >= 0; i--) {
        const sceneId = sceneHistory[i];
        const sceneData = story[sceneId];

        // ถ้าเจอฉากที่มี music, ให้คืนค่า URL ของเพลงนั้นทันที
        if (sceneData && sceneData.music) {
            return sceneData.music;
        }
    }
    
    // ถ้าวนจนหมดแล้วไม่เจอเพลงเลย, คืนค่า null
    return null;
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
    background.style.display = "flex";
    allTextBox.style.display = "flex";
});

exitTextBtn.addEventListener("click", () => {
    pause = false;
    background.style.display = "none";
    allTextBox.style.display = "none";
});

background.addEventListener("click", () => {
    music.play();
    pause = false;
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
    const savedSFXVolume = localStorage.getItem('sfxVolume') || 60;
    music.volume = savedMusicVolume / 100;
    sfx.volume = savedSFXVolume / 100;

    let initialScenesToLoad = getNextSceneIds(currentScene, 2); 
    initialScenesToLoad.push(currentScene);
    initialScenesToLoad.push("1");

    preloadScenes(
        initialScenesToLoad,
        (loaded, total) => {
            // [ใหม่] อัปเดต Loading Bar
            const percent = Math.round((loaded / total) * 100) || 0;
            preloadBar.style.width = percent + "%";
            preloadPercent.textContent = percent + "%";
        },
        () => {
            // [ใหม่] เมื่อโหลดเสร็จ (เหมือนใน preloadAllImages)
            setTimeout(() => {
                loadingScreen.style.display = "none";

                // 3. แสดงหน้า Warning (เหมือนเดิม)
                warningContainer.style.display = "flex";
                warningConfirm.addEventListener("click", () => {
                    if (saveLoaded) {
                    const lastMusic = findLastMusicInHistory();
                    if (lastMusic) {
                        music.src = lastMusic;
                        }
                    }

                    loadScene(currentScene, saveLoaded);
                    music.play();
                    sfx.play();
                    warningContainer.style.display = "none";
                });

            }, 500);
        }
    );
});