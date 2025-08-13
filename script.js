function SwitchTheme() {
  // let darkMode = localStorage.getItem("darkMode");
  document.body.className !== "darkmode" ? EnableDarkMode() : DisableDarkMode();
  // darkMode !== "active" ? EnableDarkMode() : DisableDarkMode();
}

function EnableDarkMode() {
  const btnTheme = document.getElementById("theme-switcher");
  document.body.classList.add("darkmode");
  const imgTheme = document.getElementById("theme-image");
  imgTheme.src = "images/sun.png";
  // localStorage.setItem("darkMode", "active"); // local storage can only store strings
}

function DisableDarkMode() {
  const btnTheme = document.getElementById("theme-switcher");
  document.body.classList.remove("darkmode");
  const imgTheme = document.getElementById("theme-image");
  imgTheme.src = "images/moon.png";
  // localStorage.setItem("darkMode", null);
}

function showSidebar() {
  const sideBar = document.querySelector(".sidebar");
  sideBar.style.display = "flex";
}

function hideSidebar() {
  const sideBar = document.querySelector(".sidebar");
  sideBar.style.display = "none";
}
