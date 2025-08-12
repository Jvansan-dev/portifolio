// Importar Three.js via CDN (será carregado no HTML)

// Variáveis globais
let scene, camera, renderer, model;
let particles = [];

// Detectar quando o DOM está carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar animações e efeitos
    initScrollAnimations();
    initMobileMenu();
    initHeaderScroll();
    initSkillsAnimation();
    initCounters();
    
    // Inicializar Three.js se o elemento existe
    if (document.querySelector('.hero-3d-container')) {
        initThreeJS();
    }
    
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

// Inicializar Three.js
function initThreeJS() {
    const container = document.querySelector('.hero-3d-container');
    
    // Verificar se Three.js está disponível
    if (typeof THREE === 'undefined') {
        console.error('Three.js não está carregado');
        return;
    }
    
    // Configurar cena
    scene = new THREE.Scene();
    
    // Configurar câmera
    const aspectRatio = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.z = 5;
    
    // Configurar renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Adicionar luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00ffc3, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x6e00ff, 1);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    // Criar geometria abstrata (esfera com vértices distorcidos)
    const geometry = new THREE.IcosahedronGeometry(2, 4);
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        emissive: 0x6e00ff,
        emissiveIntensity: 0.2,
        shininess: 100
    });
    
    model = new THREE.Mesh(geometry, material);
    scene.add(model);
    
    // Adicionar partículas
    addParticles();
    
    // Adicionar evento de redimensionamento
    window.addEventListener('resize', onWindowResize);
    
    // Iniciar animação
    animate();
}

// Adicionar partículas ao redor do modelo 3D
function addParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x00ffc3);
    const color2 = new THREE.Color(0x6e00ff);
    
    for (let i = 0; i < particleCount; i++) {
        // Posição aleatória em uma esfera
        const radius = 5 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Cor gradiente entre duas cores
        const mixedColor = color1.clone().lerp(color2, Math.random());
        
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
        
        // Armazenar dados da partícula para animação
        particles.push({
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            ),
            index: i * 3
        });
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
}

// Redimensionar Three.js quando a janela é redimensionada
function onWindowResize() {
    const container = document.querySelector('.hero-3d-container');
    
    if (container && camera && renderer) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }
}

// Animar cena Three.js
function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        // Rotação lenta do modelo
        model.rotation.x += 0.003;
        model.rotation.y += 0.005;
        
        // Pulsar o modelo
        const pulseFactor = Math.sin(Date.now() * 0.001) * 0.05 + 1;
        model.scale.set(pulseFactor, pulseFactor, pulseFactor);
    }
    
    // Animar partículas
    if (particles.length > 0 && scene.children.length > 3) { // modelo + 2 luzes + partículas
        const particleSystem = scene.children[4]; // Índice do sistema de partículas
        const positions = particleSystem.geometry.attributes.position.array;
        
        particles.forEach(particle => {
            // Mover partícula
            positions[particle.index] += particle.velocity.x;
            positions[particle.index + 1] += particle.velocity.y;
            positions[particle.index + 2] += particle.velocity.z;
            
            // Limitar distância
            const distance = Math.sqrt(
                positions[particle.index] ** 2 +
                positions[particle.index + 1] ** 2 +
                positions[particle.index + 2] ** 2
            );
            
            if (distance > 15) {
                // Resetar para uma posição mais próxima
                const factor = 5 / distance;
                positions[particle.index] *= factor;
                positions[particle.index + 1] *= factor;
                positions[particle.index + 2] *= factor;
            }
        });
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    if (renderer) {
        renderer.render(scene, camera);
    }
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
