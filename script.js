// Variáveis globais

// Detectar quando o DOM está carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar animações e efeitos
    initScrollAnimations();
    initMobileMenu();
    initHeaderScroll();
    initSkillsAnimation();
    initCounters();



    // Efeito de digitação para o hero
    if (document.querySelector('.hero-title span')) {
        initTypingEffect();
    }
});

// Animações de scroll
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Menu mobile
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        const navItems = document.querySelectorAll('.nav-links li a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// Header scroll
function initHeaderScroll() {
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Animação das habilidades
function initSkillsAnimation() {
    const skillElements = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percentage = progressBar.getAttribute('data-percentage');
                progressBar.style.width = `${percentage}%`;
            }
        });
    }, {
        threshold: 0.5
    });

    skillElements.forEach(element => {
        observer.observe(element);
    });
}

// Contadores animados
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                const duration = 2000; // 2 segundos
                const interval = duration / target;

                const timer = setInterval(() => {
                    count++;
                    counter.textContent = count;

                    if (count >= target) {
                        clearInterval(timer);
                        counter.textContent = target;
                    }
                }, interval);

                // Desconectar o observer após iniciar a animação
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}





// Efeito de digitação
function initTypingEffect() {
    const element = document.querySelector('.hero-title span');
    const text = element.getAttribute('data-text');
    element.textContent = '';

    let i = 0;
    const typingSpeed = 100;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, typingSpeed);
        } else {
            // Adicionar cursor piscante após a digitação
            element.classList.add('typing-done');
        }
    }

    setTimeout(() => {
        type();
    }, 1000);
}









// Formulário de contato
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Aqui você adicionaria a lógica para enviar o formulário
        // Por enquanto, apenas simulamos o envio
        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Mensagem enviada com sucesso!');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}
