/* ==========================================================================
   Configurações Iniciais e Seletores do DOM
   ========================================================================== */
const urlJson = "data/membros.json";
const container = document.getElementById("membros-container");

const btnGrade = document.getElementById("btn-grade");
const btnLista = document.getElementById("btn-lista");

/* ==========================================================================
   1. Requisição Assíncrona dos Dados (Fetch + Async/Await)
   ========================================================================== */
async function obterMembros() {
    try {
        const resposta = await fetch(urlJson);
        if (!resposta.ok) {
            throw new Error("Não foi possível ler o arquivo de dados JSON.");
        }
        const dadosMembros = await resposta.json();
        exibirMembros(dadosMembros);
    } catch (erro) {
        console.error("Erro ao buscar os membros da câmara:", erro);
        container.innerHTML = `<p class="erro-mensagem">Desculpe, ocorreu um erro ao carregar o diretório de empresas parceiras.</p>`;
    }
}

/* ==========================================================================
   2. Renderização dos Membros na Tela
   ========================================================================== */
function exibirMembros(membros) {
    container.innerHTML = ""; // Limpa o container para evitar duplicações
    
    membros.forEach(membro => {
        const card = document.createElement("section");
        card.classList.add("membro-card");
        
        // Traduz e estiliza textualmente o nível de associação (1, 2 ou 3)
        let tipoAssociacao = "Membro Padrão";
        if (membro.level === 2) tipoAssociacao = "Membro Prata 🥈";
        if (membro.level === 3) tipoAssociacao = "Membro Ouro 🥇";

        card.innerHTML = `
            <img src="imagens/${membro.image}" alt="Logotipo da empresa ${membro.name}" loading="lazy" width="100" height="100">
            <h3>${membro.name}</h3>
            <p class="endereco">${membro.address}</p>
            <p class="telefone">${membro.phone}</p>
            <p class="associacao level-${membro.level}">${tipoAssociacao}</p>
            <a href="${membro.website}" target="_blank" rel="noopener">Visitar Website</a>
        `;
        
        container.appendChild(card);
    });
}

/* ==========================================================================
   3. Controle de Alternância de Visualização (Grid vs List)
   ========================================================================== */
btnGrade.addEventListener("click", () => {
    container.classList.remove("list-mode");
    container.classList.add("grid-mode");
    btnGrade.classList.add("active");
    btnLista.classList.remove("active");
});

btnLista.addEventListener("click", () => {
    container.classList.remove("grid-mode");
    container.classList.add("list-mode");
    btnLista.classList.add("active");
    btnGrade.classList.remove("active");
});

/* ==========================================================================
   4. Menu de Navegação Responsivo (Hambúrguer)
   ========================================================================== */
const botaoMenu = document.getElementById("menu-hamburguer");
const menuPrincipal = document.getElementById("menu-principal");

botaoMenu.addEventListener("click", () => {
    menuPrincipal.classList.toggle("open");
    // Alterna o símbolo visual do botão
    if (menuPrincipal.classList.contains("open")) {
        botaoMenu.textContent = "❌";
    } else {
        botaoMenu.textContent = "☰";
    }
});

/* ==========================================================================
   5. Atualização Automática de Datas no Rodapé
   ========================================================================== */
document.getElementById("ano-atual").textContent = new Date().getFullYear();
document.getElementById("ultimaModificacao").innerHTML = `Última modificação: ${document.lastModified}`;

/* ==========================================================================
   Execução Inicial
   ========================================================================== */
obterMembros();