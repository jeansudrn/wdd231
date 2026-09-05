const botaoMenu = document.getElementById("menu-hamburguer");
const menuPrincipal = document.getElementById("menu-principal");

botaoMenu.addEventListener("click", () => {
    menuPrincipal.classList.toggle("open");
    if (menuPrincipal.classList.contains("open")) {
        botaoMenu.textContent = "❌";
    } else {
        botaoMenu.textContent = "☰";
    }
});