// const SERVER_URL = "http://localhost:3000";
const SERVER_URL = "https://cleaning-schedule-extension.onrender.com";

function showLoading() {
  document.getElementById("loading").style.display = "block";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

function saveCredentials(user, password) {
  localStorage.setItem("user", user);
  localStorage.setItem("password", password);
}

function getCredentials() {
  return {
    user: localStorage.getItem("user"),
    password: localStorage.getItem("password"),
  };
}

async function fetchMembers() {
  showLoading();
  const response = await fetch(SERVER_URL + "/getMembers", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const members = await response.json();
  hideLoading();
  return members;
}

async function saveMembers(members) {
  showLoading();

  const credentials = getCredentials();
  // console.log(credentials);
  await fetch(SERVER_URL + "/saveMembers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      credentials: JSON.stringify(credentials),
    },
    body: JSON.stringify({ members }),
  });
  hideLoading();
}

async function addMember() {
  const memberName = document.getElementById("memberName").value;
  if (memberName) {
    const members = await fetchMembers();
    members.push({ name: memberName });
    await saveMembers(members);
    document.getElementById("memberName").value = "";
    renderMembers();
  }
}

async function removeMember(index) {
  const members = await fetchMembers();
  members.splice(index, 1);
  await saveMembers(members);
  renderMembers();
}

function enableDragAndDrop() {
  const listItems = document.querySelectorAll("#members li");
  let draggedItem = null;

  listItems.forEach((item) => {
    item.addEventListener("dragstart", function () {
      draggedItem = item;
      setTimeout(() => (item.style.display = "none"), 0);
    });

    item.addEventListener("dragend", function () {
      setTimeout(() => {
        draggedItem.style.display = "flex";
        draggedItem = null;
      }, 0);
    });

    item.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    item.addEventListener("dragenter", function (e) {
      e.preventDefault();
      this.style.backgroundColor = "#ccc";
    });

    item.addEventListener("dragleave", function () {
      this.style.backgroundColor = "#eee";
    });

    item.addEventListener("drop", function () {
      this.style.backgroundColor = "#eee";
      if (draggedItem) {
        const draggedIndex = parseInt(draggedItem.getAttribute("data-index"));
        const targetIndex = parseInt(this.getAttribute("data-index"));
        moveMember(draggedIndex, targetIndex);
      }
    });
  });
}

async function moveMember(fromIndex, toIndex) {
  const members = await fetchMembers();
  const [movedMember] = members.splice(fromIndex, 1);
  members.splice(toIndex, 0, movedMember);
  await saveMembers(members);
  renderMembers();
}

async function importMembers(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const members = JSON.parse(e.target.result);
        if (Array.isArray(members)) {
          await saveMembers(members);
          renderMembers();
        } else {
          alert("Dữ liệu không hợp lệ");
        }
      } catch (e) {
        alert("Dữ liệu không hợp lệ");
      }
    };
    reader.readAsText(file);
  }
}

async function exportMembers() {
  showLoading();
  const members = await fetchMembers();
  const blob = new Blob([JSON.stringify(members, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "members.json";
  a.click();
  URL.revokeObjectURL(url);
  hideLoading();
}

async function clearMembers() {
  await saveMembers([]);
  renderMembers();
}

async function renderMembers() {
  showLoading();
  const members = await fetchMembers();
  const membersList = document.getElementById("members");
  membersList.innerHTML = "";
  members.forEach((member, index) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", true);
    li.setAttribute("data-index", index);
    const div = document.createElement("div");
    div.className = "li-content";
    div.innerHTML = `<span>${member.name}</span>`;
    const button = document.createElement("button");
    button.textContent = "Xóa";
    button.onclick = () => removeMember(index);
    li.appendChild(div);
    li.appendChild(button);
    membersList.appendChild(li);
  });

  enableDragAndDrop();
  hideLoading();
}

document.addEventListener("DOMContentLoaded", () => {
  // Load saved credentials
  const credentials = getCredentials();
  if (credentials.user) {
    document.getElementById("user").value = credentials.user;
  }
  if (credentials.password) {
    document.getElementById("password").value = credentials.password;
  }

  document.getElementById("addMemberBtn").addEventListener("click", addMember);
  document
    .getElementById("importFile")
    .addEventListener("change", importMembers);
  document
    .getElementById("exportMembersBtn")
    .addEventListener("click", exportMembers);
  document
    .getElementById("clearMembersBtn")
    .addEventListener("click", clearMembers);
  document
    .getElementById("saveCredentialsBtn")
    .addEventListener("click", () => {
      const user = document.getElementById("user").value;
      const password = document.getElementById("password").value;
      saveCredentials(user, password);
      alert("Đã lưu tài khoản quản lý");
    });

  document.getElementById("togglePassword").addEventListener("click", () => {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  });

  renderMembers();
});
