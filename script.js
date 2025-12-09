let ribbon = document.getElementById("ribbon");
let letter = document.getElementById("letter");
let music = document.getElementById("music");

ribbon.addEventListener("click", () => {
    ribbon.style.opacity = "0";
    ribbon.style.transform = "translateY(-30px)";
    setTimeout(() => ribbon.style.display = "none", 400);

    music.play();

    setTimeout(() => {
        letter.style.height = "350px";
    }, 600);
});
