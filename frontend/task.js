const API_BASE = "http://localhost:5000";

const taskForm = document.getElementById("taskForm");
const statusMsg = document.getElementById("statusMsg");
const taskIdField = document.getElementById("taskId");
const taskListEl = document.getElementById("taskList");
const taskCountEl = document.getElementById("taskCount");
const whoAmIEl = document.getElementById("whoAmI");
const logoutLink = document.getElementById("logoutLink");

// Greet whoever logged in (falls back to "Admin" if opened directly)
whoAmIEl.textContent = sessionStorage.getItem("tb_username") || "Admin";

logoutLink.addEventListener("click", () => {
  sessionStorage.removeItem("tb_username");
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function renderTasks(tasks) {
  taskCountEl.textContent = `${tasks.length} total`;

  if (!tasks.length) {
    taskListEl.innerHTML = `
      <div class="empty-state">
        <span class="glyph">&#128203;</span>
        No tasks yet — the ones you save above will show up here.
      </div>`;
    return;
  }

  taskListEl.innerHTML = tasks.map((t) => {
    const isDone = String(t.completed) === "true";
    return `
      <div class="task-row ${isDone ? "is-done" : "is-pending"}">
        <span class="tid">#${escapeHtml(t.task_id)}</span>
        <span class="emp">${escapeHtml(t.employee_name)}</span>
        <span class="title">${escapeHtml(t.task_title)}</span>
        <span class="status-cell">
          <span class="pill ${isDone ? "done" : "pending"}">
            <span class="dot"></span>${isDone ? "Done" : "Pending"}
          </span>
        </span>
      </div>`;
  }).join("");
}

async function loadTasks() {
  try {
    const res = await fetch(`${API_BASE}/api/tasks`);
    const data = await res.json();
    if (data.success) renderTasks(data.tasks);
  } catch (err) {
    // Backend not reachable yet — leave the empty state showing.
  }
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusMsg.textContent = "";
  statusMsg.className = "status";

  const employee_name = document.getElementById("employeeName").value.trim();
  const task_title = document.getElementById("taskTitle").value;
  const completed = document.getElementById("completed").value;

  try {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_name, task_title, completed }),
    });
    const data = await res.json();

    if (data.success) {
      // MySQL AUTO_INCREMENT generated this task_id - the frontend never sets it
      taskIdField.textContent = `#${data.task_id}`;
      statusMsg.textContent = `Saved as task #${data.task_id}`;
      statusMsg.style.color = "#0a4f4c";
      taskForm.reset();
      loadTasks();
    } else {
      statusMsg.textContent = data.message || "Could not save task.";
      statusMsg.style.color = "#c0432f";
    }
  } catch (err) {
    statusMsg.textContent = "Could not reach the server. Is the backend running?";
    statusMsg.style.color = "#c0432f";
  }
});

loadTasks();
