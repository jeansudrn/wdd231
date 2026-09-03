// Preenche o ano atual dinamicamente
document.getElementById("ano-atual").textContent = new Date().getFullYear();

// Preenche a data de última modificação
document.getElementById("ultimaModificacao").innerHTML = `Última modificação: ${document.lastModified}`;