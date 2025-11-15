const API_URL = "https://illusia-backend.onrender.com/story";

const storyForm = document.getElementById("story-form");
const storyRoutesContainer = document.getElementById("story-routes-container");
const cancelEditBtn = document.getElementById("cancel-edit");
const formTitle = document.getElementById("form-title");

let next = "";

document.getElementById("background").value = "../picture/background_story/";

function renderRoute(container, route, startId) {
    const routeWrapper = document.createElement('div');
    routeWrapper.className = 'mb-6 border border-gray-300 rounded-lg shadow-sm';
    
    // ส่วนหัวของเส้นทาง
    const title = document.createElement('h3');
    title.className = 'text-lg font-bold p-3 bg-gray-100 rounded-t-lg border-b';
    title.innerHTML = `▶️ เส้นทางเริ่มต้นที่: <span class="font-mono text-indigo-600">${startId}</span>`;
    routeWrapper.appendChild(title);
    
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'overflow-x-auto';
    
    const table = document.createElement('table');
    table.className = 'w-full text-sm';
    table.innerHTML = `
        <thead class="bg-gray-50">
            <tr class="text-left">
                <th class="p-2 border-b">Scene ID</th>
                <th class="p-2 border-b">Text</th>
                <th class="p-2 border-b">Flow / Next</th>
                <th class="p-2 border-b" style="min-width: 100px;">Action</th>
            </tr>
        </thead>
    `;
    
    const tbody = document.createElement('tbody');
    route.forEach((story) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 last:border-b-0 hover:bg-gray-50';
        
        const text = story.text ? story.text.substring(0, 50) + (story.text.length > 50 ? "..." : "") : "-";
        
        // สร้าง Cell สำหรับแสดง Flow (Next หรือ Choices)
        let flowHtml = '';
        if (story.choice1_text || story.choice2_text) {
            // นี่คือฉากที่มีตัวเลือก (จุดแตกแขนง)
            if (story.choice1_next) {
                flowHtml += `<div class="my-1 p-1.5 bg-green-100 rounded border border-green-300"><strong>Choice 1:</strong> ${story.choice1_text || ''} 🎯 <strong class="font-mono text-green-700">${story.choice1_next}</strong></div>`;
            }
            if (story.choice2_next) {
                flowHtml += `<div class="my-1 p-1.5 bg-green-100 rounded border border-green-300"><strong>Choice 2:</strong> ${story.choice2_text || ''} 🎯 <strong class="font-mono text-green-700">${story.choice2_next}</strong></div>`;
            }
        } else if (story.next) {
            // นี่คือฉากที่ไปต่อแบบเส้นตรง
            flowHtml = `⬇️ <strong class="font-mono text-blue-700">${story.next}</strong>`;
        } else {
            // นี่คือฉากจบ (ไม่มี next หรือ choice)
            flowHtml = '<span class="font-bold text-red-600">-- END --</span>';
        }
        
        row.innerHTML = `
            <td class="p-2 font-mono align-top">${story.scene_id}</td>
            <td class="p-2 align-top" style="min-width: 200px;">${text}</td>
            <td class="p-2 align-top" style="min-width: 250px;">${flowHtml}</td>
            <td class="p-2 align-top text-center">
                <button onclick="editStory('${story.scene_id}')" class="bg-yellow-400 px-2 py-1 rounded text-xs hover:bg-yellow-500">✏️ แก้ไข</button>
                <button onclick="deleteStory('${story.scene_id}')" class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 mt-1">🗑️ ลบ</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    routeWrapper.appendChild(tableWrapper);
    container.appendChild(routeWrapper);
}

// โหลดฉากทั้งหมด
async function loadStories() {
    const res = await fetch(API_URL);
    const stories = await res.json();
    
    storyRoutesContainer.innerHTML = ""; // ล้าง Container
    if (stories.length === 0) {
        storyRoutesContainer.innerHTML = "<p>ยังไม่มีฉากในระบบ</p>";
        return;
    }

    // 1. สร้าง Map เพื่อให้ค้นหาฉากด้วย ID ได้เร็วขึ้น
    const storyMap = new Map();
    stories.forEach(story => storyMap.set(story.scene_id, story));

    // 2. ค้นหา "จุดเริ่มต้น" ของทุกเส้นทาง
    const routeStartIds = new Set();
    const allTargets = new Set(); // Set ของฉากทั้งหมดที่มีคนชี้มา

    stories.forEach(s => {
        if (s.next) allTargets.add(s.next);
        if (s.choice1_next) allTargets.add(s.choice1_next);
        if (s.choice2_next) allTargets.add(s.choice2_next);
    });

    // 2a. "Root" (ฉากที่ไม่มีใครชี้มาเลย) ถือเป็นจุดเริ่มต้น
    stories.forEach(s => {
        if (!allTargets.has(s.scene_id)) {
            routeStartIds.add(s.scene_id);
        }
    });

    // 2b. "เป้าหมายของ Choice" ทั้งหมด ถือเป็นจุดเริ่มต้นของเส้นทางใหม่
    stories.forEach(story => {
        if (story.choice1_next && storyMap.has(story.choice1_next)) {
            routeStartIds.add(story.choice1_next);
        }
        if (story.choice2_next && storyMap.has(story.choice2_next)) {
            routeStartIds.add(story.choice2_next);
        }
    });
    
    // 3. วาดแต่ละเส้นทาง
    const renderedSceneIds = new Set(); // เก็บฉากที่วาดไปแล้ว กันการวาดซ้ำ
    
    // เรียงลำดับ ID เพื่อให้แสดงผลคงที่
    const sortedStartIds = Array.from(routeStartIds).sort();

    for (const startId of sortedStartIds) {
        // ถ้าฉากนี้ถูกวาดไปแล้ว (เป็นส่วนหนึ่งของเส้นทางอื่น) ให้ข้ามไป
        if (renderedSceneIds.has(startId)) {
            continue;
        }
        
        const route = [];
        let currentId = startId;
        
        // 4. "ไล่ตาม" เส้นทาง (Trace) ไปเรื่อยๆ
        while (currentId && storyMap.has(currentId)) {
            
            if (renderedSceneIds.has(currentId)) {
                // ถ้าวนมาเจอฉากที่เคยวาดแล้ว ให้หยุด
                break;
            }
            
            const currentScene = storyMap.get(currentId);
            route.push(currentScene);
            renderedSceneIds.add(currentId); // มาร์คว่าวาดแล้ว

            // ถ้าฉากนี้มี Choice ให้หยุดเส้นทางนี้ (เพราะ Choice จะไปเริ่มเส้นทางใหม่)
            if (currentScene.choice1_text || currentScene.choice2_text) {
                break;
            }
            
            // ไปยังฉากถัดไปในสาย
            currentId = currentScene.next;
        }
        
        // 5. วาดกลุ่มของเส้นทางนี้
        if (route.length > 0) {
            renderRoute(storyRoutesContainer, route, startId);
        }
    }
}

// เพิ่มหรือแก้ไขฉาก
storyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const delayValue = document.getElementById("delay").value;

  next = document.getElementById("next").value.trim();
  
  const data = {
    scene_id: document.getElementById("scene_id").value.trim(),
    text: document.getElementById("text").value.trim() || null,
    music: document.getElementById("music").value.trim() || null,
    sfx: document.getElementById("sfx").value.trim() || null,
    background: document.getElementById("background").value.trim() || null,
    character: document.getElementById("character").value.trim() || null,
    character_left: document.getElementById("character_left").value.trim() || null,
    character_right: document.getElementById("character_right").value.trim() || null,
    delay: delayValue ? parseInt(delayValue, 10) : null, // เพิ่ม delay
    diarytext: document.getElementById("diarytext").value.trim() || null, // เพิ่ม diarytext
    choice1_text: document.getElementById("choice1_text").value.trim() || null,
    choice1_next: document.getElementById("choice1_next").value.trim() || null,
    choice2_text: document.getElementById("choice2_text").value.trim() || null,
    choice2_next: document.getElementById("choice2_next").value.trim() || null,
    choice_position_top1: document.getElementById("choice_position_top1").value.trim() || null, // เพิ่ม
    choice_position_left1: document.getElementById("choice_position_left1").value.trim() || null, // เพิ่ม
    choice_position_top2: document.getElementById("choice_position_top2").value.trim() || null, // เพิ่ม
    choice_position_left2: document.getElementById("choice_position_left2").value.trim() || null, // เพิ่ม
    next: document.getElementById("next").value.trim() || null,
  };

  const editId = document.getElementById("edit-scene-id").value;
  const method = editId ? "PUT" : "POST";
  const url = editId ? `${API_URL}/${editId}` : API_URL;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    alert(editId ? "✅ แก้ไขฉากเรียบร้อย" : "✅ เพิ่มฉากใหม่เรียบร้อย");
    storyForm.reset();
    document.getElementById("edit-scene-id").value = "";
    document.getElementById("scene_id").value = next;
    document.getElementById("background").value = "../picture/background_story/";
    formTitle.textContent = "➕ เพิ่มฉากใหม่";
    cancelEditBtn.classList.add("hidden");
    loadStories();
  } else {
    alert("❌ เกิดข้อผิดพลาดในการบันทึก");
  }
});

// แก้ไขฉาก
async function editStory(scene_id) {
  const res = await fetch(`${API_URL}/${scene_id}`);
  const story = await res.json();

  document.getElementById("scene_id").value = story.scene_id;
  document.getElementById("text").value = story.text || "";
  document.getElementById("music").value = story.music || "";
  document.getElementById("sfx").value = story.sfx || "";
  document.getElementById("background").value = story.background || "../picture/background_story/";
  document.getElementById("character").value = story.character || ""; // เพิ่ม
  document.getElementById("character_left").value = story.character_left || "";
  document.getElementById("character_right").value = story.character_right || "";
  document.getElementById("delay").value = story.delay || ""; // เพิ่ม
  document.getElementById("diarytext").value = story.diarytext || ""; // เพิ่ม
  document.getElementById("choice1_text").value = story.choice1_text || "";
  document.getElementById("choice1_next").value = story.choice1_next || "";
  document.getElementById("choice2_text").value = story.choice2_text || "";
  document.getElementById("choice2_next").value = story.choice2_next || "";
  document.getElementById("choice_position_top1").value = story.choice_position_top1 || ""; // เพิ่ม
  document.getElementById("choice_position_left1").value = story.choice_position_left1 || ""; // เพิ่ม
  document.getElementById("choice_position_top2").value = story.choice_position_top2 || ""; // เพิ่ม
  document.getElementById("choice_position_left2").value = story.choice_position_left2 || ""; // เพิ่ม
  document.getElementById("next").value = story.next || "";

  document.getElementById("edit-scene-id").value = story.scene_id;
  formTitle.textContent = `✏️ แก้ไขฉาก ${story.scene_id}`;
  cancelEditBtn.classList.remove("hidden");
}

// ลบฉาก
async function deleteStory(scene_id) {
  if (!confirm(`⚠️ ต้องการลบฉาก ${scene_id} จริงหรือไม่?`)) return;
  const res = await fetch(`${API_URL}/${scene_id}`, { method: "DELETE" });
  if (res.ok) {
    alert("🗑️ ลบฉากเรียบร้อย");
    loadStories();
  } else {
    alert("❌ ลบไม่สำเร็จ");
  }
}

// ยกเลิกแก้ไข
cancelEditBtn.addEventListener("click", () => {
  storyForm.reset();
  document.getElementById("edit-scene-id").value = "";
  formTitle.textContent = "➕ เพิ่มฉากใหม่";
  cancelEditBtn.classList.add("hidden");
});

// โหลดข้อมูลตอนเริ่มต้น
loadStories();