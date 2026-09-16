// Substitua pela sua chave real gerada no site da OpenWeatherMap
const apiKey = "0a59278cf31517d98d52e9f464783609"; 
// Coordenadas geográficas oficiais de Natal/RN
const lat = "-5.7945";
const lon = "-35.2110";

const urlClimaAtual = `https://openweathermap.org{lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
const urlPrevisao = `https://openweathermap.org{lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
const urlMembros = "dados/membros.json";

/* ==========================================================================
   1. Integração Meteorológica (OpenWeatherMap)
   ========================================================================= */
async function carregarDadosClima() {
    try {
        // Busca o clima em tempo real
        const resAtual = await fetch(urlClimaAtual);
        if (!resAtual.ok) throw new Error("Falha ao obter clima atual.");
        const dadosClima = await resAtual.json();
        
        // Exibe o clima atual na tela
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

        // Busca a previsão de 3 dias
        const resPrevisao = await fetch(urlPrevisao);
        if (!resPrevisao.ok) throw new Error("Falha ao obter previsão.");
        const dadosPrevisao = await resPrevisao.json();
        
        const containerPrevisao = document.getElementById("previsao-3dias");
        containerPrevisao.innerHTML = "";

        // Filtra os dados capturando apenas um registro do meio do dia (12:00) para os próximos dias
        const listaFiltrada = dadosPrevisao.list.filter(item => item.dt_txt.includes("12:00:00"));

        // Renderiza apenas os 3 primeiros dias da previsão filtrada
        for (let i = 0; i < 3; i++) {
            const previsaoDia = listaFiltrada[i];
            if (!previsaoDia) break;

            const dataObjeto = new Date(previsaoDia.dt * 1000);
            // Formata o dia para exibir as 3 primeiras letras em português (ex: Qua, Qui)
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
        document.getElementById("clima-atual").innerHTML = "<p>Serviço de clima indisponível.</p>";
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

        // Filtra apenas membros de nível Prata (2) ou Ouro (3)
        const qualificados = membros.filter(m => m.level === 2 || m.level === 3);

        // Algoritmo de embaralhamento randômico (Fisher-Yates)
        for (let i = qualificados.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [qualificados[i], qualificados[j]] = [qualificados[j], qualificados[i]];
        }

        // Seleciona os 3 primeiros membros do array embaralhado
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

/* ==========================================================================
   3. Menu Hambúrguer e Metadados do Rodapé
   ========================================================================= */
const botaoMenu = document.getElementById("menu-hamburguer");
const menuPrincipal = document.getElementById("menu-principal");

botaoMenu.addEventListener("click", () => {
    menuPrincipal.classList.toggle("open");
    botaoMenu.textContent = menuPrincipal.classList.contains("open") ? "❌" : "☰";
});

document.getElementById("ano-atual").textContent = new Date().getFullYear();
document.getElementById("ultimaModificacao").innerHTML = `Última modificação: ${document.lastModified}`;

// Inicialização automática das cargas de rede
carregarDadosClima();
carregarDestaques();