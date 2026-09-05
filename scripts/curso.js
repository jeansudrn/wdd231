const cursos = [
    { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 3, completed: false },
    { subject: 'WDD', number: 131, title: 'Web Frontend Development I', credits: 3, completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 3, completed: false },
    { subject: 'WDD', number: 231, title: 'Web Frontend Development II', credits: 3, completed: false }
];

const container = document.getElementById("cursos-container");
const totalCreditosSpan = document.getElementById("total-creditos");

function renderizarCursos(listaFiltrada) {
    container.innerHTML = "";
    
    listaFiltrada.forEach(curso => {
        const card = document.createElement("div");
        card.classList.add("curso-card");
        
        if (curso.completed) {
            card.classList.add("concluido");
        }
        
        card.innerHTML = `<strong>${curso.subject} ${curso.number} - ${curso.title}</strong>`;
        container.appendChild(card);
    });

    const totalCreditos = listaFiltrada.reduce((soma, curso) => soma + curso.credits, 0);
    totalCreditosSpan.textContent = totalCreditos;
}

const botoesFiltro = document.querySelectorAll(".filtros button");
botoesFiltro.forEach(botao => {
    botao.addEventListener("click", (e) => {
        botoesFiltro.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
    });
});

document.getElementById("btn-all").addEventListener("click", () => renderizarCursos(cursos));
document.getElementById("btn-wdd").addEventListener("click", () => renderizarCursos(cursos.filter(c => c.subject === 'WDD')));
document.getElementById("btn-cse").addEventListener("click", () => renderizarCursos(cursos.filter(c => c.subject === 'CSE')));

renderizarCursos(cursos);