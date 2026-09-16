const apiKey = "0a59278cf31517d98d52e9f464783609"; 
const lat = "-5.7945";
const lon = "-35.2110";

const urlClimaAtual = `https://openweathermap.org{lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
const urlPrevisao = `https://openweathermap.org{lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
const urlMembros = "dados/membros.json";

/* ==========================================================================
   1. Integração Meteorológica (OpenWeatherMap API)
   ========================================================================= */
async function carregarDadosClima() {
    try {
        const resAtual = await fetch(urlClimaAtual);
        if (!resAtual.ok) throw new Error(`Erro HTTP Clima: ${resAtual.status}`);
        const dadosClima = await resAtual.json();
        
        const containerAtual = document.getElementById("clima-atual");
        const icone = dadosClima.weather[0].icon; 
        
        containerAtual.innerHTML = `
            <div class="tempo-info">
                <img src="https://openweathermap.org{icone}@2x.png" alt="${dadosClima.weather[0].description}">
                <div>
                    <div class="tempo-graus">${Math.round(dadosClima.main.temp)}°C</div>
                    <div class="tempo-desc">${dadosClima.weather[0].description}</div>
                </div>
            </div>
        `;

        const resPrevisao = await fetch(urlPrevisao);
        if (!resPrevisao.ok) throw new Error(`Erro HTTP Previsão: ${resPrevisao.status}`);
        const dadosPrevisao = await resPrevisao.json();
        
        const containerPrevisao = document.getElementById("previsao-3dias");
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
        document.getElementById("clima-atual").innerHTML = `<p style="color: #e53e3e; font-weight: bold;">Serviço de clima indisponível.</p>`;
    }
}

/* ==========================================================================
   2. Sistema de Destaques de Empresas Randômicos (JSON)
   ========================================================================= */
async function carregarDestaques() {
    try {
        const resposta = await fetch(urlMembros);
        if (!resposta.ok) throw new Error("Falha ao ler dados dos membros.");
        const membros = await resposta.json();

        // Filtra membros Prata (2) ou Ouro (3)
        const qualificados = membros.filter(m => m.level === 2 || m.level === 3);

        // Algoritmo Fisher-Yates para embaralhar
        for (let i = qualificados.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [qualificados[i], qualificados[j]] = [qualificados[j], qualificados[i]];
        }

        const selecionados = qualificados.slice(0, 3);
        const containerDestaques = document.getElementById("destaques-container");
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

    } catch (erro) {
        console.error("Erro ao carregar os anúncios em destaque:", erro);
    }
}

// Menu Hambúrguer e Rodapé
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

carregarDadosClima();
carregarDestaques();