// Importa o array de atrativos do arquivo de dados de módulo (.mjs)
import { atrativosNatal } from '../dados/atrativos.mjs';

const gridContainer = document.getElementById("grid-areas-container");

/* ==========================================================================
   1. Renderização dos 8 Cartões com IDs para as Áreas de Grade
   ========================================================================== */
function renderizarGaleria() {
    if (!gridContainer) return;
    gridContainer.innerHTML = "";

    atrativosNatal.forEach(local => {
        const card = document.createElement("section");
        card.classList.add("cartao-atrativo");
        // Atribui um estilo inline com a propriedade id mapeando para a área do CSS
        card.style.gridArea = local.id;

        card.innerHTML = `
            <h2>${local.title}</h2>
            <figure>
                <img src="imagens/${local.image}" alt="Fotografia de ${local.title}" loading="lazy" width="300" height="200">
            </figure>
            <address>📍 ${local.address}</address>
            <p>${local.desc}</p>
            <button type="button" class="btn-saiba-mais">Saiba Mais</button>
        `;
        gridContainer.appendChild(card);
    });
}

/* ==========================================================================
   2. Sistema Inteligente de Mensagens por Tempo de Visita (LocalStorage)
   ========================================================================== */
function processarMensagemVisita() {
    const elementoMensagem = document.getElementById("mensagem-visita");
    if (!elementoMensagem) return;

    const agora = Date.now(); // Data atual em milissegundos
    const ultimaVisita = localStorage.getItem("ultima-visita-camara");

    if (!ultimaVisita) {
        // Cenário A: Primeiro Acesso
        elementoMensagem.textContent = "Boas-vindas! Entre em contato conosco caso tenha alguma dúvida.";
    } else {
        const diferencaMilissegundos = agora - parseInt(ultimaVisita);
        const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
        const diasPassados = Math.floor(diferencaMilissegundos / umDiaEmMilissegundos);

        if (diferencaMilissegundos < umDiaEmMilissegundos) {
            // Cenário B: Menos de um dia
            elementoMensagem.textContent = "Já voltou? Que legal!";
        } else {
            // Cenário C: Um ou mais dias passados
            if (diasPassados === 1) {
                elementoMensagem.textContent = "Seu último acesso foi há 1 dia.";
            } else {
                elementoMensagem.textContent = `Seu último acesso foi há ${diasPassados} dias.`;
            }
        }
    }

    // Salva a data atualizada do acesso corrente no LocalStorage
    localStorage.setItem("ultima-visita-camara", agora.toString());
}

/* ==========================================================================
   3. Menu Hambúrguer e Rodapé
   ========================================================================== */
const botaoMenu = document.getElementById("menu-hamburguer");
const menuPrincipal = document.getElementById("menu-principal");

if (botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener("click", () => {
        menuPrincipal.classList.toggle("open");
        botaoMenu.textContent = menuPrincipal.classList.contains("open") ? "❌" : "☰";
    });
}

document.getElementById("ano-atual").textContent = new Date().getFullYear();
document.getElementById("ultimaModificacao").innerHTML = `Última modificação: ${document.lastModified}`;

// Inicialização das execuções
renderizarGaleria();
processarMensagemVisita();
