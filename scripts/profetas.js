// 1. Declaração das constantes obrigatórias do enunciado
const url = 'https://byui-cse.github.io/cse-ww-program-pt/data/profetas-dos-ultimos-dias.json';
const cartoes = document.querySelector('#cartoes');

// 2. Função assíncrona para buscar os dados JSON externos
async function obterDadosDeProfetas() {
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error("Falha na requisição dos dados.");
        }
        const dados = await resposta.json();
        
        // Exibe os dados em formato de tabela no console do desenvolvedor para validação
        // console.table(dados.profetas); 
        
        // Enviamos dados.profetas porque a função espera receber a lista (array) interna
        exibirProfetas(dados.profetas);
    } catch (erro) {
        console.error("Erro ao obter dados de profetas:", erro);
        cartoes.innerHTML = "<p class='erro'>Não foi possível carregar os dados dos profetas.</p>";
    }
}

// 3. Arrow Function responsável por processar e renderizar os cards na tela
const exibirProfetas = (profetas) => {
    profetas.forEach((profeta) => {
        // Criação dos elementos estruturais de cada cartão
        const cartao = document.createElement("section");
        const nomeCompleto = document.createElement("h2");
        const dataNascimento = document.createElement("p");
        const localNascimento = document.createElement("p");
        const retrato = document.createElement("img");

        // Preenche o cabeçalho h2 combinando nome e sobrenome com template string
        nomeCompleto.textContent = `${profeta.nome} ${profeta.sobrenome}`;
        
        // Adiciona os dados complementares solicitados nas capturas de tela do enunciado
        dataNascimento.innerHTML = `<strong>Data de Nascimento:</strong> ${profeta.nascimento}`;
        localNascimento.innerHTML = `<strong>Local de Nascimento:</strong> ${profeta.localNascimento}`;

        // Define os atributos da tag img usando o método setAttribute()
        retrato.setAttribute("src", profeta.urlImagem);
        retrato.setAttribute("alt", `Retrato do Presidente ${profeta.nome} ${profeta.sobrenome} - número de ordem: ${profeta.ordem}`);
        retrato.setAttribute("loading", "lazy");
        retrato.setAttribute("width", "340");
        retrato.setAttribute("height", "440");

        // Vincula as tags de texto e imagem dentro da section do cartão
        cartao.appendChild(nomeCompleto);
        cartao.appendChild(dataNascimento);
        cartao.appendChild(localNascimento);
        cartao.appendChild(retrato);

        // Insere a seção do cartão completa no container div#cartoes
        cartoes.appendChild(cartao);
    });
};

// 4. Chamada de linha principal para executar o carregamento ao abrir a página
obterDadosDeProfetas();