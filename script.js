const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");
let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

if (cursor && cursorRing) {
  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.style.left = `${mouseX - 4}px`;
    cursor.style.top = `${mouseY - 4}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX - 18) * 0.12;
    ringY += (mouseY - ringY - 18) * 0.12;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }

  animateRing();

  document
    .querySelectorAll("a, button, .service-card, .project-card, .skill-card, .portfolio-access-card")
    .forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(3)";
        cursorRing.style.transform = "scale(1.5)";
        cursorRing.style.opacity = "0.3";
      });

      element.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)";
        cursorRing.style.transform = "scale(1)";
        cursorRing.style.opacity = "0.6";
      });
    });
}

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (!navbar) {
    return;
  }

  if (window.scrollY > 80) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

const parallaxBg = document.getElementById("parallaxBg");
const parallaxSection = document.getElementById("parallax");
window.addEventListener("scroll", () => {
  if (!parallaxBg || !parallaxSection) {
    return;
  }

  const rect = parallaxSection.getBoundingClientRect();
  const progress = -rect.top / (rect.height + window.innerHeight);
  parallaxBg.style.transform = `translateY(${progress * 60}px)`;
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
);

reveals.forEach((element) => observer.observe(element));

const heroContent = document.querySelector(".hero-content");
const heroImg = document.querySelector(".hero-image-float img");
window.addEventListener("scroll", () => {
  const scrollAmount = window.scrollY;

  if (scrollAmount < window.innerHeight && heroContent) {
    heroContent.style.transform = `translateY(${scrollAmount * 0.25}px)`;
  }

  if (scrollAmount < window.innerHeight && heroImg) {
    heroImg.style.transform = `scale(1.1) translateY(${scrollAmount * 0.12}px)`;
  }
});

function animateCounter(element, target) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    element.textContent = `${Math.round(current)}${element.dataset.suffix || ""}`;
  }, 16);
}

const statsSection = document.querySelector(".philosophy-stats");
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.animated) {
        return;
      }

      entry.target.dataset.animated = "true";

      const numbers = entry.target.querySelectorAll(".stat-num");
      numbers.forEach((numberElement) => {
        const text = numberElement.textContent.trim();

        if (!/\d/.test(text)) {
          return;
        }

        const number = parseInt(text, 10);
        const suffix = text.replace(/\d+/g, "");

        if (Number.isNaN(number)) {
          return;
        }

        numberElement.dataset.suffix = suffix;
        animateCounter(numberElement, number);
      });
    });
  },
  { threshold: 0.5 }
);

if (statsSection) {
  statsObserver.observe(statsSection);
}

const contactForm = document.getElementById("contactForm");
const formNextUrl = document.getElementById("formNextUrl");
const formStatus = document.getElementById("formStatus");

if (contactForm && formNextUrl) {
  const successUrl = new URL(window.location.href);
  successUrl.hash = "contato";
  successUrl.searchParams.set("enviado", "1");
  formNextUrl.value = successUrl.toString();

  contactForm.addEventListener("submit", (event) => {
    if (window.location.protocol === "file:") {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const recipient = contactForm.action.replace("https://formsubmit.co/", "").trim();
      const name = formData.get("Nome") || "";
      const email = formData.get("email") || "";
      const phone = formData.get("Telefone") || "";
      const projectType = formData.get("Tipo de Projeto") || "";
      const message = formData.get("Mensagem") || "";
      const subject = "Teste de contato pelo site - Cintia Bergamasco";
      const bodyLines = [
        "Novo contato pelo site:",
        "",
        `Nome: ${name}`,
        `Email: ${email}`,
        `Telefone: ${phone}`,
        `Tipo de Projeto: ${projectType}`,
        "",
        "Mensagem:",
        message
      ];
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

      if (formStatus) {
        formStatus.textContent = "Teste local detectado. Vamos abrir seu aplicativo de e-mail com a mensagem preenchida.";
        formStatus.classList.add("is-visible");
      }

      window.location.href = mailtoUrl;
      return;
    }

    const submitButton = contactForm.querySelector(".form-submit");

    if (submitButton) {
      submitButton.textContent = "Enviando...";
      submitButton.disabled = true;
    }
  });
}

if (formStatus) {
  const params = new URLSearchParams(window.location.search);
  const wasSent = params.get("enviado");

  if (wasSent === "1") {
    formStatus.textContent = "Mensagem enviada com sucesso. A Cintia recebera o contato no e-mail cadastrado.";
    formStatus.classList.add("is-visible", "is-success");

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("enviado");
    window.history.replaceState({}, "", cleanUrl.toString());
  } else if (window.location.protocol === "file:") {
    formStatus.textContent = "Modo de teste local ativo. Ao enviar, o site abrira seu aplicativo de e-mail com a mensagem pronta.";
    formStatus.classList.add("is-visible");
  }
}

// Substitua a lógica antiga do adminBtn por esta:

const adminModal = document.getElementById('adminModal');
const projectModal = document.getElementById('projectModal');
const adminForm = document.getElementById('adminForm');
const projectGrid = document.querySelector('.project-grid');

// Função para fechar os modais
const closeModals = () => {
  adminModal.style.display = 'none';
  projectModal.style.display = 'none';
  
  // Limpa a URL para esconder o parâmetro admin após fechar, se desejar
  const url = new URL(window.location);
  url.searchParams.delete('admin');
  window.history.pushState({}, '', url);
};

// Verificação de Segurança Básica (Apenas Front-end)
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('admin') === 'true') {
    // Pede a senha usando um prompt padrão do navegador
    const senhaDigitada = prompt("Acesso Restrito. Digite a senha do administrador:");
    
    // DEFINA SUA SENHA AQUI (Lembre-se: visível no código-fonte)
    const senhaCorreta = "CintiaDesign2026"; 
    
    if (senhaDigitada === senhaCorreta) {
      adminModal.style.display = 'flex';
    } else {
      alert("Senha incorreta. Acesso negado.");
      closeModals(); // Limpa a URL e não abre nada
    }
  }
});

// Fechar nos "X" ou clicando fora
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', closeModals);
});

window.addEventListener('click', (e) => {
  if (e.target === adminModal || e.target === projectModal) {
    closeModals();
  }
});

// Carregar projetos salvos
let customProjects = JSON.parse(localStorage.getItem('projetosPortifolio')) || [];

function renderCustomProjects() {
  // Remove apenas os gerados dinamicamente para atualizar a lista
  document.querySelectorAll('.custom-project').forEach(el => el.remove());
  
  customProjects.forEach((proj) => {
    const card = document.createElement('a');
    card.className = 'project-card custom-project reveal visible';
    card.href = '#';
    card.innerHTML = `
      <div class="project-card-media">
        <img src="${proj.images[0]}" alt="${proj.title}">
      </div>
      <div class="project-card-body">
        <span class="project-index">Novo</span>
        <h3>${proj.title}</h3>
        <p>${proj.desc}</p>
        <span class="project-page">Abrir Detalhes</span>
      </div>
    `;
    
    // Abrir o Modal de Projeto ao clicar
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal(proj);
    });
    
    // Insere no grid existente
    if (projectGrid) {
      projectGrid.appendChild(card);
    }
  });
}

// Salvar um novo Projeto
if (adminForm) {
  adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const imagesStr = document.getElementById('projImages').value;
    
    const newProject = {
      title: document.getElementById('projTitle').value,
      desc: document.getElementById('projDesc').value,
      info: document.getElementById('projInfo').value,
      link: document.getElementById('projLink').value,
      images: imagesStr.split(',').map(s => s.trim()).filter(s => s !== '')
    };
    
    customProjects.push(newProject);
    localStorage.setItem('projetosPortifolio', JSON.stringify(customProjects));
    
    adminForm.reset();
    closeModals();
    renderCustomProjects();
  });
}

// Lógica de Renderização do Modal e Carrossel
function openProjectModal(proj) {
  document.getElementById('modalProjTitle').innerHTML = proj.title;
  document.getElementById('modalProjInfo').innerHTML = proj.info.replace(/\n/g, '<br>');
  
  const linkBtn = document.getElementById('modalProjLink');
  if(proj.link) {
    linkBtn.style.display = 'inline-flex';
    linkBtn.href = proj.link;
  } else {
    linkBtn.style.display = 'none';
  }

  const mainImg = document.getElementById('mainCarouselImg');
  const thumbContainer = document.getElementById('carouselThumbnails');
  
  mainImg.src = proj.images[0] || '';
  thumbContainer.innerHTML = '';
  
  proj.images.forEach((imgUrl, idx) => {
    const thumb = document.createElement('img');
    thumb.src = imgUrl;
    if(idx === 0) thumb.classList.add('active');
    
    thumb.addEventListener('click', () => {
      mainImg.src = imgUrl;
      document.querySelectorAll('.thumbnails img').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
    
    thumbContainer.appendChild(thumb);
  });

  projectModal.style.display = 'flex';
}

// Inicializar projetos criados pelo Admin
renderCustomProjects();
