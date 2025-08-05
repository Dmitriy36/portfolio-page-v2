function SwitchTheme() {
  let darkMode = localStorage.getItem("darkMode");
  darkMode !== "active" ? EnableDarkMode() : DisableDarkMode();
}

function EnableDarkMode() {
  const btnTheme = document.getElementById("theme-switcher");
  // document.body.classList.remove('lightmode');
  document.body.classList.add("darkmode");
  localStorage.setItem("darkMode", "active"); // local storage can only store strings
  btnTheme.innerHTML = "Light Mode";
}

function DisableDarkMode() {
  const btnTheme = document.getElementById("theme-switcher");
  document.body.classList.remove("darkmode");
  // document.body.classList.add('lightmode');
  localStorage.setItem("darkMode", null);
  btnTheme.innerHTML = "Dark Mode";
}
