function startGame() {
  document.getElementById("homePage").style.display = "none";
  document.querySelector(".button-group").style.display = "none";
  document.getElementById("settingsModal").style.display = "none";
  document.getElementById("customizeModal").style.display = "none";
  document.getElementById("game").style.display = "block";
}

function openSettings() {
  document.getElementById("homePage").style.display = "none";
  document.querySelector(".button-group").style.display = "none";
  document.getElementById("settingsModal").style.display = "block";
}

function closeSettings() {
  document.getElementById("settingsModal").style.display = "none";
  document.getElementById("homePage").style.display = "block";
  document.querySelector(".button-group").style.display = "flex";
}

function openCustomize() {
  document.getElementById("homePage").style.display = "none";
  document.querySelector(".button-group").style.display = "none";
  document.getElementById("customizeModal").style.display = "block";
}

function closeCustomize() {
  document.getElementById("customizeModal").style.display = "none";
  document.getElementById("homePage").style.display = "block";
  document.querySelector(".button-group").style.display = "flex";
}
