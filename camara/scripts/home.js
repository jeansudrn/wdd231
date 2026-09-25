
const apiKey = "0a59278cf31517d98d52e9f464783609";
const lat = "-5.7945";
const lon = "-35.2110";

const urlClimaAtual =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

const urlPrevisao =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

const urlMembros = "dados/membros.json";

// Seletores de Elementos da Página Inicial (Home)
const containerAtual = document.getElementById("clima-atual");
const containerPrevisao = document.getElementById("previsao-3dias");
const containerDestaques = document.getElementById("destaques-container");

// Seletores de Elementos da Página do Diretório
const containerDiretorio = document.getElementById("membros-container");
const btnGrade = document.getElementById("btn-grade");
const btnLista = document.getElementById("btn-lista");

/* ==========================================================================
   1. LÓGICA DA PÁGINA INICIAL (HOME) - Clima e Previsão
   ========================================================================= */
async function carregarDadosClima() {
    // Só executa se os containers de clima existirem na página atual (Home)
    if (!containerAtual || !containerPrevisao) return; 
    
    try {
        const resAtual = await fetch(urlClimaAtual);
        if (!resAtual.ok) throw new Error(`Erro HTTP Clima: ${resAtual.status}`);
        const dadosClima = await resAtual.json();
        
        const icone = dadosClima.weather[0].icon; 
        const descricao = dadosClima.weather[0].description;
        
        containerAtual.innerHTML = `
            <div class="tempo-info">
                <img src="https://openweathermap.org/img/wn/${icone}@2x.png" alt="${descricao}">
                <div>
                    <div class="tempo-graus">${Math.round(dadosClima.main.temp)}°C</div>
                    <div class="tempo-desc">${descricao}</div>
                </div>
            </div>
        `;

        const resPrevisao = await fetch(urlPrevisao);
        if (!resPrevisao.ok) throw new Error(`Erro HTTP Previsão: ${resPrevisao.status}`);
        const dadosPrevisao = await resPrevisao.json();
        
        containerPrevisao.innerHTML = "";
        const listaFiltrada = dadosPrevisao.list.filter(item => item.dt_txt.includes("12:00:00"));

        for (let i = 0; i < 3; i++) {
            const previsaoDia = listaFiltrada[i];
            if (!previsaoDia) break;

            const dataObjeto = new Date(previsaoDia.dt * 1000);
            const diaSemana = dataObjeto.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");

            const divDia = document.createElement("div");
            divDia.classList.add("previsao-dia");
            divDia.innerHTML = `
                <h4>${diaSemana.toUpperCase()}</h4>
                <p>${Math.round(previsaoDia.main.temp)}°C</p>
            `;
            containerPrevisao.appendChild(divDia);
        }
    } catch (erro) {
        console.error("Erro na API de Clima:", erro);
        containerAtual.innerHTML = `<p style="color: #e53e3e; font-weight: bold;">Serviço de clima indisponível.</p>`;
    }
}

async function carregarDestaques(membros) {
    // Só executa se o container de destaques existir na página atual (Home)
    if (!containerDestaques) return; 

    const qualificados = membros.filter(m => m.level === 2 || m.level === 3);
    
    // Algoritmo Fisher-Yates para embaralhar as empresas de Natal
    for (let i = qualificados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [qualificados[i], qualificados[j]] = [qualificados[j], qualificados[i]];
    }

    const selecionados = qualificados.slice(0, 3);
    containerDestaques.innerHTML = "";

    selecionados.forEach(empresa => {
        const card = document.createElement("div");
        card.classList.add("destaque-card");
        let badge = empresa.level === 3 ? "Destaque Ouro 🥇" : "Destaque Prata 🥈";

        card.innerHTML = `
            <img src="imagens/${empresa.image}" alt="Logo de ${empresa.name}" loading="lazy">
            <h3>${empresa.name}</h3>
            <p><strong>${badge}</strong></p>
            <p>${empresa.address}</p>
            <p>📞 ${empresa.phone}</p>
            <a href="${empresa.website}" target="_blank" rel="noopener">Acessar Site</a>
        `;
        containerDestaques.appendChild(card);
    });
}

/* ==========================================================================
   2. 🆕 ADICIONADO: LÓGICA DA PÁGINA DO DIRETÓRIO (Lista Completa de Empresas)
   ========================================================================= */
function carregarDiretorioCompleto(membros) {
    // Só executa se o container do diretório existir na página atual (Diretório)
    if (!containerDiretorio) return; 
    containerDiretorio.innerHTML = "";
    
    membros.forEach(membro => {
        const card = document.createElement("section");
        card.classList.add("membro-card");
        
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
        containerDiretorio.appendChild(card);
    });
}

/* ==========================================================================
   3. FUNÇÃO MESTRE PARA BUSCAR O JSON LOCAL (Fetch)
   ========================================================================= */
async function inicializarDadosMembros() {
    try {
        const resposta = await fetch(urlMembros);
        if (!resposta.ok) throw new Error(`Erro HTTP JSON: ${resposta.status}`);
        const membros = await resposta.json();

        // Dispara as funções. Elas possuem travas internas para rodar apenas na página certa!
        carregarDestaques(membros);
        carregarDiretorioCompleto(membros);
    } catch (erro) {
        console.error("Erro ao carregar membros do JSON:", erro);
        if (containerDiretorio) {
            containerDiretorio.innerHTML = `<p style="color: #e53e3e; font-weight: bold; text-align: center; grid-column: 1/-1;">Erro ao carregar as empresas parceiras.</p>`;
        }
    }
}

/* ==========================================================================
   4. INTERATIVIDADE E EVENTOS DO USUÁRIO (Menu Hambúrguer e Abas Grid/Lista)
   ========================================================================= */
if (btnGrade && btnLista && containerDiretorio) {
    btnGrade.addEventListener("click", () => {
        containerDiretorio.classList.remove("list-mode");
        containerDiretorio.classList.add("grid-mode");
        btnGrade.classList.add("active");
        btnLista.classList.remove("active");
    });

    btnLista.addEventListener("click", () => {
        containerDiretorio.classList.remove("grid-mode");
        containerDiretorio.classList.add("list-mode");
        btnLista.classList.add("active");
        btnGrade.classList.remove("active");
    });
}

const botaoMenu = document.getElementById("menu-hamburguer");
const menuPrincipal = document.getElementById("menu-principal");
if (botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener("click", () => {
        menuPrincipal.classList.toggle("open");
        botaoMenu.textContent = menuPrincipal.classList.contains("open") ? "❌" : "☰";
    });
}

// Elementos automáticos de data do Rodapé
const anoAtualElement = document.getElementById("ano-atual");
const ultimaModificacaoElement = document.getElementById("ultimaModificacao");

if (anoAtualElement) anoAtualElement.textContent = new Date().getFullYear();
if (ultimaModificacaoElement) {
    ultimaModificacaoElement.innerHTML = `Última modificação: ${document.lastModified}`;
}

/* ==========================================================================
   5. EXECUÇÃO AUTOMÁTICA DAS REDES
   ========================================================================= */
carregarDadosClima();
inicializarDadosMembros();

/* ==========================================================================
   🆕 ADICIONADO: GERENCIAMENTO DE FORMULÁRIO E MODAIS (SUBSCRIÇÃO)
   ========================================================================= */
const campoTimestamp = document.getElementById("form-timestamp");
const botoesAbrirModal = document.querySelectorAll(".btn-modal-open");
const botoesFecharModal = document.querySelectorAll(".btn-modal-close");

// 1. Injeta automaticamente a data e hora atuais em milissegundos no campo oculto
if (campoTimestamp) {
    campoTimestamp.value = new Date().toISOString();
}

// 2. Controla a abertura dos modais nativos usando .showModal()
botoesAbrirModal.forEach(botao => {
    botao.addEventListener("click", () => {
        const idModal = botao.getAttribute("data-modal");
        const modalAlvo = document.getElementById(idModal);
        if (modalAlvo) {
            modalAlvo.showModal(); // Abre acima de tudo e tranca o fundo
        }
    });
});

// 3. Controla o fechamento dos modais usando .close()
botoesFecharModal.forEach(botao => {
    botao.addEventListener("click", () => {
        const modalAberto = botao.closest("dialog");
        if (modalAberto) {
            modalAberto.close(); // Fecha e destranca a tela
        }
    });
});