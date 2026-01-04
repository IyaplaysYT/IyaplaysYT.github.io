function toggleDarkMode() {
    console.log("Dark mode toggled");
    document.body.classList.toggle("dark-mode");
    document.getElementById("darkmode").classList.toggle("dark-mode-button");
    document.getElementById("dmimg").classList.toggle("dark-mode-image");
}