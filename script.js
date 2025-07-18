// Animações ao rolar
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-section');
        }
    });
}, {
    threshold: 0.2
});

sections.forEach(section => {
    section.classList.add('hidden-section');
    observer.observe(section);
});
// Efeito de digitação
const text = "Olá, eu sou o João";
let i = 0;

function type() {
    if (i < text.length) {
        document.getElementById("typed").innerHTML += text.charAt(i);
        i++;
        setTimeout(type, 120); // velocidade da digitação
    }
}
type();
