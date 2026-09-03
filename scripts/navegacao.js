const botaoMenu = document.getElementById("menu-hamburguer");
const menuPrincipal = document.getElementById("menu-principal");

botaoMenu.addEventListener("click", () => {
    menuPrincipal.classList.toggle("open");
    // Alterna o ícone entre hambúrguer (☰) e fechar (X)
    if (menuPrincipal.classList.contains("open")) {
        botaoMenu.textContent = "❌";
    } else {
        botaoMenu.textContent = "☰";
    }
});