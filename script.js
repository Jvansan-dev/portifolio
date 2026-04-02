// Variáveis globais
const EMAILJS_ENABLED = true;
const EMAILJS_SERVICE_ID = 'service_00utrnh';
const EMAILJS_TEMPLATE_ID = 'template_bllk4pi';
const EMAILJS_PUBLIC_KEY = 'NrFsiKVMN1nurfHim';
const EMAILJS_TO_EMAIL = 'jvansan.dev@gmail.com';

// Detectar quando o DOM está carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar animações e efeitos
    initScrollAnimations();
    initMobileMenu();
    initHeaderScroll();
    initSkillsAnimation();
    initCounters();
    initEmailJS();
    console.log('[EmailJS] Enabled:', EMAILJS_ENABLED, 'Service:', EMAILJS_SERVICE_ID, 'Template:', EMAILJS_TEMPLATE_ID);



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
        const submitBtn = contactForm.querySelector('.form-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const statusEl = contactForm.querySelector('.form-status');

        // Capturar dados
        const name = contactForm.querySelector('#name')?.value?.trim() || '';
        const email = contactForm.querySelector('#email')?.value?.trim() || '';
        const subject = contactForm.querySelector('#subject')?.value?.trim() || '';
        const message = contactForm.querySelector('#message')?.value?.trim() || '';

        // Validação simples
        if (!name || !email || !subject || !message) {
            if (statusEl) {
                statusEl.textContent = 'Por favor, preencha todos os campos.';
                statusEl.classList.remove('success');
                statusEl.classList.add('error');
            }
            return;
        }

        // Estado de loading
        const originalText = btnText ? btnText.textContent : submitBtn.textContent;
        if (btnText) btnText.textContent = 'Enviando...'; else submitBtn.textContent = 'Enviando...';
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        if (statusEl) {
            statusEl.textContent = 'Enviando sua mensagem...';
            statusEl.classList.remove('error', 'success');
        }

        // Enviar via EmailJS; salvar no localStorage como fallback
        const payload = { name, email, subject, message };
        console.log('[EmailJS] Sending payload:', payload);
        sendViaEmailJS(payload)
            .then(() => {
                if (statusEl) {
                    statusEl.textContent = '';
                    statusEl.classList.remove('error', 'success');
                }
                contactForm.reset();
                showSuccessModal();
            })
            .catch((err) => {
                console.error('[EmailJS] Send error:', err);
                const entry = { name, email, subject, message, timestamp: new Date().toISOString() };
                const existing = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                existing.push(entry);
                localStorage.setItem('contactMessages', JSON.stringify(existing));
                if (statusEl) {
                    const detail = err?.text || err?.message || '';
                    statusEl.textContent = 'Não foi possível enviar agora. Mensagem salva localmente. ' + detail;
                    statusEl.classList.remove('success');
                    statusEl.classList.add('error');
                }
            })
            .finally(() => {
                if (btnText) btnText.textContent = originalText; else submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
    });
}
// Modal de sucesso
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (!modal) return;
    const confirmBtn = modal.querySelector('.modal-confirm');

    const close = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKeyDown);
        modal.removeEventListener('click', onBackdrop);
        if (confirmBtn) confirmBtn.removeEventListener('click', close);
    };
    const onKeyDown = (ev) => { if (ev.key === 'Escape') close(); };
    const onBackdrop = (ev) => { if (ev.target === modal) close(); };

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    modal.addEventListener('click', onBackdrop);
    if (confirmBtn) confirmBtn.addEventListener('click', close);
}
function initEmailJS() {
    if (EMAILJS_ENABLED && window.emailjs && EMAILJS_PUBLIC_KEY) {
        try { window.emailjs.init(EMAILJS_PUBLIC_KEY); console.log('[EmailJS] Initialized with PUBLIC_KEY'); } catch (e) { console.error('[EmailJS] Init error:', e); }
    }
}

function sendViaEmailJS(params) {
    if (!(EMAILJS_ENABLED && window.emailjs && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY)) {
        return Promise.reject(new Error('EmailJS não configurado'));
    }
    // Mapear exatamente como está no seu template:
    // Subject usa {{title}}, From Name usa {{name}}, Reply To usa {{email}}, conteúdo usa {{message}}
    const templateParams = {
        title: params.subject || 'Contato',
        name: params.name,
        email: params.email,
        reply_to: params.email,
        message: params.message,
        to_email: EMAILJS_TO_EMAIL,
        time: new Date().toLocaleString('pt-BR')
    };
    console.log('[EmailJS] Sending with params:', templateParams);
    return window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}
