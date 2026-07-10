const API_BASE = "http://localhost:5000";

const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.success) {
      // remember who's logged in so the task board can greet them
      sessionStorage.setItem("tb_username", data.user?.username || username);
      window.location.href = "task_management.html";
    } else {
      errorMsg.textContent = data.message || "Login failed.";
    }
  } catch (err) {
    errorMsg.textContent = "Could not reach the server. Is the backend running?";
  }
});
