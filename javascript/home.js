document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username") || "Guest";
  document.getElementById("username").textContent = username;

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
});
