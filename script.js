let menuButton = document.getElementById("menuBurger");
let sideBar = document.querySelector(".sidebar");
document.addEventListener("click", (e) => {
  if (!sideBar.contains(e.target) && e.target !== menuButton) {
    hideSidebar();
  }
});
menuButton.addEventListener("click", (e) => {
  e.stopPropagation();
});

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
  const menuButton = document.getElementById("menuBurger");
  let listenerPresent = false;
  mainBar.classList.remove("blurred");
  sideBar.classList.add("blurred");
  sideBar.style.display = "block";

  // menuButton.addEventListener("click", (e) => {
  //   e.stopPropagation();
  // });

  //   document.addEventListener("click", (e) => {
  //     if (!sideBar.contains(e.target) && e.target !== menuButton) {
  //       hideSidebar();
  //     }
  //   });

  if (sideBar.style.display == "block") {
    console.log("side menu was just shown.");
  }
}

function hideSidebar() {
  const sideBar = document.querySelector(".sidebar");
  const mainBar = document.querySelector(".immovableBar");

  sideBar.style.display = "none";
  if (sideBar.style.display == "none") {
    console.log("side menu was just hidden");
  }
  sideBar.classList.remove("blurred");
  mainBar.classList.add("blurred");
}
