const API_URL = "https://illusia-backend.onrender.com/story";

const storyForm = document.getElementById("story-form");
const storyTable = document.getElementById("story-table");
const cancelEditBtn = document.getElementById("cancel-edit");
const formTitle = document.getElementById("form-title");

// โหลดฉากทั้งหมด
async function loadStories() {
  const res = await fetch(API_URL);
  const stories = await res.json();

  storyTable.innerHTML = "";
  stories.forEach(story => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border p-2">${story.scene_id}</td>
      <td class="border p-2">${story.background || "-"}</td>
      <td class="border p-2">${story.next || "-"}</td>
      <td class="border p-2">${story.character_left || "-"}</td>
      <td class="border p-2">${story.character_right || "-"}</td>
      <td class="border p-2">${story.text ? story.text.substring(0, 40) + "..." : "-"}</td>
      <td class="border p-2 text-center">
        <button onclick="editStory('${story.scene_id}')" class="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">✏️</button>
        <button onclick="deleteStory('${story.scene_id}')" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">🗑️</button>
      </td>
    `;
    storyTable.appendChild(row);
  });
}

// เพิ่มหรือแก้ไขฉาก
storyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const delayValue = document.getElementById("delay").value;
  
  const data = {
    scene_id: document.getElementById("scene_id").value.trim(),
    text: document.getElementById("text").value.trim() || null,
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
  document.getElementById("background").value = story.background || "";
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