const loadBtn = document.getElementById("load-btn");
const startBtn = document.getElementById("start-btn");
const settingBtn = document.getElementById("setting-btn");
const quitBtn = document.getElementById("quit-btn");
const loadGameFrame = document.getElementById("load-game-frame");

const login = document.getElementById("login");
const dropdownContent = document.getElementById("dropdown-content");
const logoutBtn = document.getElementById("logout");

const saveNameModalStart = document.getElementById("save-name-modal-start");
const saveNameFormStart = document.getElementById("save-name-form-start");
const saveNameInputStart = document.getElementById("save-name-input-start");
const saveModalCancelStart = document.getElementById("save-modal-cancel-start");
const saveModalSubmitStart = document.getElementById("save-modal-submit-start");

const deleteContainer = document.getElementById("delete-container");
const cancelDelete = document.getElementById("cancel-del");
const confirmDelete = document.getElementById("confirm-del");

const username = localStorage.getItem('username') || '';

const API_URL = "https://illusia-backend.onrender.com";

let dropdown = "close";
let saveToDelete = null;
let slotToDelete = null;

async function createNewSave(saveName) {
    const userId = localStorage.getItem('user_id');
    if (!userId) return null; // ถ้าไม่มี user_id ก็ไม่ต้องทำ

    // ข้อมูลสำหรับเกมใหม่
    const newSaveData = {
        user_id: parseInt(userId),
        save_name: saveName, // ชื่อเซฟใหม่
        current_scene: "1",
        scene_history: JSON.stringify(["1"]), // ประวัติเริ่มที่ 1
        variables: JSON.stringify({}) // ตัวแปรว่าง
    };

    try {
        const res = await fetch(`${API_URL}/saves`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSaveData)
        });
        const data = await res.json();

        if (data.success) {
            console.log("New game save created:", data.save);
            // 🚀 ส่งข้อมูลเซฟใหม่ (ที่ได้จาก backend) กลับไป
            return data.save;
        } else {
            throw new Error(data.error);
        }
    } catch (err) {
        console.error("Failed to create new save:", err);
        alert("Error creating new save file. Starting game without saving.");
        return null;
    }
}

async function fetchAndDisplaySaves() {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
        alert("ไม่สามารถโหลดเซฟได้: ไม่พบ User ID (กรุณา Login ใหม่)");
        return;
    }

    loadGameFrame.style.display = "flex";
    loadGameFrame.innerHTML = `<h2>Loading saves...</h2>`;

    try {
        const API_URL = "https://illusia-backend.onrender.com";
        const res = await fetch(`${API_URL}/saves/${userId}`);

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const saves = await res.json();

        buildSaveSlotsUI(saves);

    } catch (err) {
        console.error("Failed to fetch saves:", err);
        loadGameFrame.innerHTML = `
            <h2>Error Loading Saves</h2>
            <p>${err.message}</p>
            <button id="close-load-frame">Close</button>
        `;

        document.getElementById("close-load-frame").addEventListener("click", () => {
            loadGameFrame.style.display = "none";
        });
    }
}

function buildSaveSlotsUI(saves) {
    // เคลียร์ค่าเก่า
    loadGameFrame.innerHTML = "";

    // ⭐️ (1) สร้างปุ่มปิด (Close Button) อย่างถูกต้อง
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-load-frame";
    closeBtn.innerHTML = "&times;"; // (สัญลักษณ์ X)
    closeBtn.onclick = () => {
        loadGameFrame.style.display = "none";
    };
    loadGameFrame.appendChild(closeBtn); // ⭐️ (2) ใช้ตัวแปร closeBtn ที่สร้างแล้ว

    // สร้าง Title
    const title = document.createElement("h2");
    title.textContent = "Load Game";
    loadGameFrame.appendChild(title);

    // สร้าง Container
    const slotsContainer = document.createElement("div");
    slotsContainer.className = "save-slots-container";

    if (saves.length === 0) {
        slotsContainer.innerHTML = "<p>No save files found.</p>";
    } else {
        saves.forEach(save => {
            // (1) สร้างกรอบหลักของช่องเซฟ
            const slot = document.createElement("div");
            slot.className = "save-slot-item";

            // (2) สร้างส่วนข้อมูล (ที่กดแล้วโหลดเกม)
            const infoDiv = document.createElement("div");
            infoDiv.className = "save-slot-info"; // 👈 คลาสใหม่
            
            const saveTime = new Date(save.save_time).toLocaleString('th-TH');
            infoDiv.innerHTML = `
                <strong>${save.save_name || 'Auto Save'}</strong>
                <p>Scene: ${save.current_scene}</p>
                <p>Time: ${saveTime}</p>
            `;

            // 4. นี่คือส่วนสำคัญ: เมื่อคลิก "ส่วนข้อมูล"
            infoDiv.addEventListener("click", () => {
                localStorage.setItem('selected_save', JSON.stringify(save));
                window.location.href = "storypage/story.html";
            });
            
            // (3) สร้างปุ่มลบ (🗑️)
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "save-slot-delete-btn"; // 👈 คลาสใหม่
            // *** ใช้ Boxicons ถังขยะ ตามที่คุณต้องการ ***
            deleteBtn.innerHTML = '<i class="bx bx-trash"></i>'; 

            // 5. เมื่อคลิก "ปุ่มลบ"
            deleteBtn.addEventListener("click", (e) => {
                // 🛑 ป้องกันไม่ให้ Event วิ่งทะลุไปที่ infoDiv (กันโหลดเกม)
                e.stopPropagation();
                saveToDelete = save.id;
                slotToDelete = slot;
                deleteContainer.style.display = "flex";
            });

            // (6) ประกอบร่าง: นำ info และปุ่มลบ ใส่ใน slot
            slot.appendChild(infoDiv);
            slot.appendChild(deleteBtn);
            slotsContainer.appendChild(slot);
        });
        
        confirmDelete.addEventListener("click", () => {
            deleteSaveFile(saveToDelete, slotToDelete);
            saveToDelete = null;
            slotToDelete = null;
            deleteContainer.style.display = "none";
        });

        cancelDelete.addEventListener("click", () => {
            deleteContainer.style.display = "none";
        });
    }

    loadGameFrame.appendChild(slotsContainer);
}




// 👈 แก้ไข: ทำให้ปุ่ม startBtn เป็น async
startBtn.addEventListener("click", () => {
    // 1. ตรวจสอบว่า login หรือยัง
    loadGameFrame.style.display = "none";
    const userId = localStorage.getItem('user_id');

    if (userId) {
        // 1. ถ้า login แล้ว -> เปิด Modal ให้ตั้งชื่อ
        saveNameInputStart.value = ""; // เคลียร์ค่าเก่า
        saveNameModalStart.style.display = "flex";
        saveNameInputStart.focus(); // ให้เคอร์เซอร์ไปรอ
    } else {
        // 2. ถ้ายังไม่ login (เล่นแบบ Guest) -> ไปหน้าเกมเลย (ไม่มีเซฟ)
        localStorage.removeItem('selected_save'); // เคลียร์ค่าเก่าเผื่อค้าง
        window.location.href = "storypage/story.html";
    }
    // (ถ้า newSave เป็น null เกมก็จะเริ่มโดยไม่มี auto-save)
});

saveModalCancelStart.addEventListener("click", () => {
    saveNameModalStart.style.display = "none";
});

saveNameFormStart.addEventListener("submit", async (e) => {
    e.preventDefault(); // 2. กดยืนยัน (Start Game)
    
    const saveName = saveNameInputStart.value.trim();
    if (!saveName) {
        alert("กรุณาตั้งชื่อไฟล์เซฟ");
        return;
    }

    // (เพิ่ม Feedback)
    saveModalSubmitStart.disabled = true;
    saveModalSubmitStart.textContent = "กำลังสร้าง...";

    // 3. เรียกใช้ฟังก์ชันสร้างเซฟ (ส่งชื่อไปด้วย)
    const newSave = await createNewSave(saveName);

    // (คืนค่า Feedback)
    saveModalSubmitStart.disabled = false;
    saveModalSubmitStart.textContent = "Start Game";

    if (newSave) {
        // 4. ถ้าสร้างเซฟสำเร็จ -> เก็บข้อมูลเซฟ
        localStorage.setItem('selected_save', JSON.stringify(newSave));
        // 5. ไปหน้าเกม
        window.location.href = "storypage/story.html";
    }
    // (ถ้า newSave เป็น null, ฟังก์ชัน createNewSave จะ alert แจ้งเตือนเอง)
});

async function deleteSaveFile(saveId, slotElement) {
    // 1. ส่งคำขอ DELETE ไปยัง backend
    // (เดาว่า endpoint คือ /saves/:id ตามหลัก REST API)
    try {
        const res = await fetch(`${API_URL}/saves/${saveId}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            // ถ้าลบไม่สำเร็จ (เช่น Server ล่ม)
            throw new Error("Server failed to delete.");
        }

        // 2. ถ้าลบสำเร็จ ให้ลบช่องเซฟนี้ออกจากหน้าจอ
        slotElement.remove();

        // 3. (ทางเลือก) ตรวจสอบว่าถ้าไม่เหลือเซฟเลย ให้แสดงข้อความ
        const container = document.querySelector(".save-slots-container");
        if (container && container.childElementCount === 0) {
            container.innerHTML = "<p>No save files found.</p>";
        }

    } catch (err) {
        console.error("Error deleting save:", err);
        alert("เกิดข้อผิดพลาดในการลบไฟล์เซฟ");
    }
}

async function wakeUpAPI() {
    const API_URL = "https://illusia-backend.onrender.com/users";
    console.log("Attempting to wake up the API...");

    try {
        const res = await fetch(API_URL);
        // We only care if the request was successful enough to reach the server (res.ok)
        // and get some response back, even if it's not a JSON endpoint.
        if (res.ok) {
            console.log("API wake-up successful! Status:", res.status);
        } else {
             // Handle cases where the server is up but returns an error/unhandled route (e.g., 404)
            console.warn(`API wake-up request returned a non-ok status: ${res.status}`);
        }
    } catch (err) {
        // Handle network errors (e.g., server is still spinning up or is down)
        console.error("Failed to wake up API (Network Error or Server Unresponsive):", err.message);
    }
}

quitBtn.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
});

settingBtn.addEventListener("click", () => {
    window.location.href = "settingpage/setting.html";
});

loadBtn.addEventListener("click", () => {
    saveNameModalStart.style.display = "none";
    fetchAndDisplaySaves();
});

login.addEventListener("click", () => {
    if(username){
        if(dropdown == "show"){
            dropdownContent.style.display = "none";
            dropdown = "close";
        }else{
            dropdownContent.style.display = "block";
            dropdown = "show";
        }
    }else{
        window.location.href = "loginpage/login.html";
    }
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('selected_save');
    window.location.reload();
});

window.addEventListener("load", () => {
    wakeUpAPI();

    if (username) {
        login.textContent = username;
        
        window.addEventListener("click", (e) => {
            // เช็คว่าไม่ได้คลิกที่ปุ่ม login หรือภายใน login-container
            if (!login.contains(e.target) && !dropdownContent.contains(e.target)) {
                dropdownContent.style.display = "none";
            }
        });

        loadBtn.style.display = "block";
        loadBtn.style.fontSize = "200%";
        startBtn.style.marginTop = "0";
        startBtn.textContent = "New Game";
        startBtn.style.fontSize = "200%";
        settingBtn.style.fontSize = "200%";
        quitBtn.style.fontSize = "200%";
    }
});

