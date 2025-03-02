async function fetchMembers() {
  const response = await fetch("http://localhost:3000/getMembers");
  const members = await response.json();
  return members;
}

function renderSchedule() {
  const scheduleTable = document.getElementById("scheduleTable");
  scheduleTable.innerHTML = "";
  const headerRow = scheduleTable.insertRow();
  const headers = ["Ngày", "Thành viên"];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
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
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSchedule();
});
