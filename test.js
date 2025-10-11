const userContainer = document.getElementById("user-container");
const updateForm = document.getElementById("update-form");

const API_URL = "http://localhost:3000/users";

// ฟังก์ชันดึงข้อมูลจาก backend
function fetchUsers() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            console.log(data); // เช็กว่าได้อะไรจริง ๆ
            const users = Array.isArray(data) ? data : data.users; // ถ้า backend ส่ง {users: [...]}
            if (!Array.isArray(users)) {
                console.error("Expected array, got:", users);
                return;
            }
            userContainer.innerHTML = "";
            users.forEach(u => {
                const div = document.createElement("div");
                div.className = "user-card";
                div.innerHTML = `ID: ${u.id} <br> Username: ${u.username} <br> Password: ${u.password} <br> Email: ${u.email}`;
                userContainer.appendChild(div);
            });
        })
        .catch(err => console.error("Error fetching users:", err));
}

// เรียกครั้งแรกตอนโหลดหน้า
fetchUsers();

// ฟังก์ชันแก้ไขข้อมูล
updateForm.addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("user-id").value;
    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;
    const email = document.getElementById("new-email").value;

    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || "Updated!");
        fetchUsers(); // รีเฟรชข้อมูลหลังแก้ไข
    })
    .catch(err => console.error("Error updating user:", err));
});