// Function to save text to localStorage
function saveText(event) {
    event.preventDefault(); // Prevent form submission
    var name = document.getElementById("name").value;
    var location = document.getElementById("location").value;
    var exp = document.getElementById("exp").value;
    localStorage.setItem("name", name);
    localStorage.setItem("location", location);
    localStorage.setItem("exp", exp);
    document.getElementById("output").innerText += "\nName: " + name + "\nLocation: " + location + "\n Experience:\n" + exp;
}

// Check if there's saved text on page load
window.onload = function() {
    var name = localStorage.getItem("name");
    var location = localStorage.getItem("name");
    var exp = localStorage.getItem("name");
    if(name) {
        document.getElementById("output").innerText += "\nName: " + name + "\nLocation: " + location + "\n Experience:\n" + exp;
    }
}

// Add event listener to form submission
document.getElementById("textForum").addEventListener("submit", saveText);
