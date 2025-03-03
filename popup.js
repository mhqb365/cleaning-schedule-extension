// const SERVER_URL = "http://localhost:3000";
const SERVER_URL = "https://cleaning-schedule-extension.onrender.com"

async function fetchMembers() {
  const response = await fetch(SERVER_URL + "/getMembers");
  const members = await response.json();
  return members;
}

function renderSchedule() {
  const scheduleTable = document.getElementById("scheduleTable");
  const loadingElement = document.getElementById("loading");
  scheduleTable.innerHTML = "";
  const headerRow = scheduleTable.insertRow();
  const headers = ["Ngày", "Thành viên"];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  loadingElement.style.display = "block"; // Show loading effect
  fetchMembers().then((members) => {
    const today = new Date();
    let date = new Date(today);
    date.setDate(date.getDate() + (6 - date.getDay())); // Bắt đầu từ thứ Bảy của tuần hiện tại
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 3); // Kết thúc sau 3 tháng
    while (date <= endDate) {
      const row = scheduleTable.insertRow();
      const cellDate = row.insertCell(0);
      const cellMember = row.insertCell(1);
      cellDate.textContent = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      cellMember.textContent =
        members[
          Math.floor((date - today) / (7 * 24 * 60 * 60 * 1000)) %
            members.length
        ]?.name || "Chưa phân công";
      date.setDate(date.getDate() + 7);
    }
    loadingElement.style.display = "none"; // Hide loading effect
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSchedule();
});
