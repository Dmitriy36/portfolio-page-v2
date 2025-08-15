const mainBar = document.querySelector(".immovableBar");

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
  const mainBar = document.querySelector(".immovableBar");

  mainBar.classList.remove("blurred");
  sideBar.classList.add("blurred");
  sideBar.style.display = "block";
}

function hideSidebar() {
  const sideBar = document.querySelector(".sidebar");
  const mainBar = document.querySelector(".immovableBar");

  sideBar.style.display = "none";
  sideBar.classList.remove("blurred");
  mainBar.classList.add("blurred");
}
