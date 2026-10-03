import { dadosPraias } from '../dados/praias.mjs';

const praiasContainer = document.getElementById("praias-container");
const msgTempoContainer = document.getElementById("mensagem-tempo");
const reciboContainer = document.getElementById("dados-usuario-recibo");

/* ==========================================================================
   1. FUNÇÃO ASSÍNCRONA COM TRY/CATCH PARA RENDERIZAR AS 15 PRAIAS
   ========================================================================== */
async function inicializarMonitoramento() {
    if (!praiasContainer) return;

    try {
        const carregarRegistros = () => new Promise(resolve => setTimeout(() => resolve(dadosPraias), 50));
        const listaPraias = await carregarRegistros();
        
        praiasContainer.innerHTML = "";
        
        listaPraias.forEach(praia => {
            const card = document.createElement("section");
            card.classList.add("card-praia");
            
            const classeSelo = praia.balneabilidade === "Própria" ? "selo-propria" : "selo-inapropriada";

            card.innerHTML = `
                <h3>${praia.nome}</h3>
                <p><strong>Região:</strong> ${praia.zona}</p>
                <p><strong>Status:</strong> <span class="selo-status ${classeSelo}">${praia.balneabilidade}</span></p>
                <button type="button" class="btn-abrir-modal" data-id="${praia.id}">Mais Informações &rarr;</button>
            `;
            praiasContainer.appendChild(card);
        });

        configurarEventosModal(listaPraias);

    } catch (erro) {
        console.error("Falha ao renderizar a malha de praias:", erro);
        praiasContainer.innerHTML = `<p class="erro-texto">Erro ao processar o banco de dados de balneabilidade costeira.</p>`;
    }
}

/* ==========================================================================
   2. GERENCIAMENTO DO DIÁLOGO MODAL NATIVO COM INJEÇÃO DE IMAGEM
   ========================================================================== */
function configurarEventosModal(lista) {
    const modal = document.getElementById("modal-info");
    const fecharBtn = document.getElementById("modal-fechar-btn");
    const botoesAbrir = document.querySelectorAll(".btn-abrir-modal");
    const modalImagem = document.getElementById("modal-imagem");

    if (!modal || !fecharBtn) return;

    botoesAbrir.forEach(botao => {
        botao.addEventListener("click", () => {
            const idPraia = botao.getAttribute("data-id");
            const praiaSelecionada = lista.find(p => p.id === idPraia);

            if (praiaSelecionada) {
                document.getElementById("modal-titulo").textContent = praiaSelecionada.nome;
                document.getElementById("modal-zona").innerHTML = `<strong>Região Litorânea:</strong> ${praiaSelecionada.zona}`;
                document.getElementById("modal-status").innerHTML = `<strong>Balneabilidade:</strong> ${praiaSelecionada.balneabilidade}`;
                document.getElementById("modal-lixo").innerHTML = `<strong>Presença de Resíduos:</strong> ${praiaSelecionada.nivelLixo}`;
                document.getElementById("modal-texto").innerHTML = `<strong>Análise Técnica:</strong> ${praiaSelecionada.descricao}`;
                
                // 🟢 CONFIGURAÇÃO ATUALIZADA: Aponta direto para a pasta de imagens do projeto
                if (modalImagem) {
                    modalImagem.src = `imagens/${praiaSelecionada.imagem}`;
                    modalImagem.alt = `Fotografia panorâmica de ${praiaSelecionada.nome}`;
                }
                
                modal.showModal(); 
            }
        });
    });

    fecharBtn.addEventListener("click", () => {
        modal.close();
    });
}

/* ==========================================================================
   3. ARMAZENAMENTO LOCAL (LocalStorage)
   ========================================================================== */
function verificarHistoricoVisitas() {
    if (!msgTempoContainer) return;

    const agora = Date.now();
    const ultimaVisita = localStorage.getItem("ecosurf-ultimo-acesso");

    if (!ultimaVisita) {
        msgTempoContainer.textContent = "Boas-vindas! Entre em contato conosco caso tenha alguma dúvida. 🌊";
    } else {
        const diferencaTempo = agora - parseInt(ultimaVisita);
        const umDiaMilissegundos = 24 * 60 * 60 * 1000;
        const diasInclusos = Math.floor(diferencaTempo / umDiaMilissegundos);

        if (diferencaTempo < umDiaMilissegundos) {
            msgTempoContainer.textContent = "Já voltou? Que legal! 🏄‍♂️";
        } else {
            msgTempoContainer.textContent = diasInclusos === 1 
                ? "Seu último acesso foi há 1 dia." 
                : `Seu último acesso foi há ${diasInclusos} dias.`;
        }
    }
    localStorage.setItem("ecosurf-ultimo-acesso", agora.toString());
}

/* ==========================================================================
   4. DECODIFICAÇÃO DE PARÂMETROS DE RECIBO
   ========================================================================== */
function processarParametrosFormulario() {
    if (!reciboContainer) return;

    const query = new URLSearchParams(window.location.search);
    const dataIso = query.get("entryDate");
    const dataFormatada = dataIso ? new Date(dataIso).toLocaleString("pt-BR") : "Não identificada";

    reciboContainer.innerHTML = `
        <div class="linha-recibo"><strong>Nome Registrado:</strong> <span>${query.get("firstName") || ""} ${query.get("lastName") || ""}</span></div>
        <div class="linha-recibo"><strong>E-mail de Contato:</strong> <span>${query.get("userEmail") || ""}</span></div>
        <div class="linha-recibo"><strong>ID Único do Surfista:</strong> <span class="destaque-code">${query.get("surfId") || ""}</span></div>
        <div class="linha-recibo"><strong>Horário do Protocolo (Timestamp):</strong> <span>${dataFormatada}</span></div>
    `;
}

/* ==========================================================================
   5. CONTROLES DE INTERATIVIDADE COMUM
   ========================================================================== */
const hamburguerBtn = document.getElementById("menu-hamburguer");
const menuPrincipal = document.getElementById("menu-principal");

if (hamburguerBtn && menuPrincipal) {
    hamburguerBtn.addEventListener("click", () => {
        menuPrincipal.classList.toggle("open");
        hamburguerBtn.textContent = menuPrincipal.classList.contains("open") ? "❌" : "☰";
    });
}

const gridBtn = document.getElementById("grid-btn");
const listBtn = document.getElementById("list-btn");

if (gridBtn && listBtn && praiasContainer) {
    gridBtn.addEventListener("click", () => {
        praiasContainer.className = "layout-grade";
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
    });
    listBtn.addEventListener("click", () => {
        praiasContainer.className = "layout-lista";
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
    });
}

const hiddenDateInput = document.getElementById("hidden-date");
if (hiddenDateInput) {
    hiddenDateInput.value = new Date().toISOString();
}

const anoAtualElement = document.getElementById("ano-atual");
const ultimaModificacaoElement = document.getElementById("ultimaModificacao");

if (anoAtualElement) anoAtualElement.textContent = new Date().getFullYear();
if (ultimaModificacaoElement) {
    ultimaModificacaoElement.innerHTML = `Última modificação: ${document.lastModified}`;
}

verificarHistoricoVisitas();
inicializarMonitoramento();
processarParametrosFormulario();