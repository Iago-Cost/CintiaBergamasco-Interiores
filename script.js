// ===== Cursor personalizado (mantido) =====
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

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

  document.querySelectorAll("a, button, .service-card, .project-card, .skill-card, .portfolio-access-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(3)";
        cursorRing.style.transform = "scale(1.5)";
        cursorRing.style.opacity = "0.3";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)";
        cursorRing.style.transform = "scale(1)";
        cursorRing.style.opacity = "0.6";
      });
    });
}

// ===== Navbar scroll =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 80);
});

// ===== Parallax =====
const parallaxBg = document.getElementById("parallaxBg");
const parallaxSection = document.getElementById("parallax");
window.addEventListener("scroll", () => {
  if (!parallaxBg || !parallaxSection) return;
  const rect = parallaxSection.getBoundingClientRect();
  const progress = -rect.top / (rect.height + window.innerHeight);
  parallaxBg.style.transform = `translateY(${progress * 60}px)`;
});

// ===== Reveal animations =====
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
);
reveals.forEach(el => observer.observe(el));

// ===== Hero scroll effect =====
const heroContent = document.querySelector(".hero-content");
const heroImg = document.querySelector(".hero-image-float img");
window.addEventListener("scroll", () => {
  const s = window.scrollY;
  if (s < window.innerHeight && heroContent) {
    heroContent.style.transform = `translateY(${s * 0.25}px)`;
  }
  if (s < window.innerHeight && heroImg) {
    heroImg.style.transform = `scale(1.1) translateY(${s * 0.12}px)`;
  }
});

// ===== Contador de estatísticas (mantido) =====
function animateCounter(el, target) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = `${Math.round(current)}${el.dataset.suffix || ""}`;
  }, 16);
}
const statsSection = document.querySelector(".philosophy-stats");
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.animated) return;
      entry.target.dataset.animated = "true";
      entry.target.querySelectorAll(".stat-num").forEach(num => {
        const text = num.textContent.trim();
        if (!/\d/.test(text)) return;
        const number = parseInt(text, 10);
        const suffix = text.replace(/\d+/g, "");
        if (isNaN(number)) return;
        num.dataset.suffix = suffix;
        animateCounter(num, number);
      });
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

// ===== Formulário de contato (mantido) =====
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
      const fd = new FormData(contactForm);
      const recipient = contactForm.action.replace("https://formsubmit.co/", "").trim();
      const subject = "Teste de contato pelo site - Cintia Bergamasco";
      const body = `Nome: ${fd.get("Nome")}\nEmail: ${fd.get("email")}\nTelefone: ${fd.get("Telefone")}\nTipo: ${fd.get("Tipo de Projeto")}\n\nMensagem:\n${fd.get("Mensagem")}`;
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (formStatus) {
        formStatus.textContent = "Teste local: seu aplicativo de e-mail será aberto.";
        formStatus.classList.add("is-visible");
      }
      return;
    }
    const btn = contactForm.querySelector(".form-submit");
    if (btn) { btn.textContent = "Enviando..."; btn.disabled = true; }
  });
}
if (formStatus) {
  const params = new URLSearchParams(window.location.search);
  if (params.get("enviado") === "1") {
    formStatus.textContent = "Mensagem enviada com sucesso. A Cintia receberá o contato no e-mail cadastrado.";
    formStatus.classList.add("is-visible", "is-success");
    const clean = new URL(window.location.href);
    clean.searchParams.delete("enviado");
    window.history.replaceState({}, "", clean);
  } else if (window.location.protocol === "file:") {
    formStatus.textContent = "Modo de teste local ativo. Ao enviar, o site abrirá seu aplicativo de e-mail com a mensagem pronta.";
    formStatus.classList.add("is-visible");
  }
}

// ============================================================
//  GERENCIAMENTO DE PROJETOS (localStorage + renderização)
// ============================================================

// Dados padrão (caso não haja nada salvo)
const DEFAULT_PROJECTS = [
  {
    id: "proj1",
    title: "Quarto",
    desc: "Estudo de ambiente residencial",
    info: "Ambiente tranquilo com iluminação natural e materiais aconchegantes.",
    link: "https://online.fliphtml5.com/kbrbj/rznn/#p=4",
    images: [
      { url: "https://online.fliphtml5.com/kbrbj/rznn/files/large/cd35dac653d9d420dbb732f9ae761d96.webp", description: "Vista geral do quarto com cama e decoração." },
      { url: "https://online.fliphtml5.com/kbrbj/rznn/files/large/2640ced1c386f5b948d3e2caadd3833a.webp", description: "Detalhe da iluminação e texturas." }
    ]
  },
  {
    id: "proj2",
    title: "Sala",
    desc: "Proposta para espaço de convivência",
    info: "Integração entre sala de estar e jantar, com sofás modulares e acabamentos em madeira.",
    link: "https://online.fliphtml5.com/kbrbj/rznn/#p=6",
    images: [
      { url: "https://online.fliphtml5.com/kbrbj/rznn/files/large/2640ced1c386f5b948d3e2caadd3833a.webp", description: "Vista ampla da sala." }
    ]
  },
  // ... adicione os outros projetos padrão (Cozinha, Apartamento, etc.) 
  // para manter a consistência, mas o usuário poderá deletar/editar todos.
];

// Carregar projetos do localStorage ou usar os padrão
let projects = [];
const stored = localStorage.getItem("projetosPortifolio");
if (stored) {
  try {
    projects = JSON.parse(stored);
  } catch (e) {
    projects = [...DEFAULT_PROJECTS];
  }
} else {
  projects = [...DEFAULT_PROJECTS];
  localStorage.setItem("projetosPortifolio", JSON.stringify(projects));
}

// ===== Renderizar os cards na grade =====
const projectGrid = document.getElementById("projectGrid");

function renderProjects() {
  if (!projectGrid) return;
  projectGrid.innerHTML = "";
  projects.forEach((proj, index) => {
    const card = document.createElement("a");
    card.className = "project-card reveal visible";
    card.href = "#";
    card.setAttribute("data-id", proj.id);
    // Usar a primeira imagem como capa
    const cover = proj.images && proj.images.length > 0 ? proj.images[0].url : "";
    card.innerHTML = `
      <div class="project-card-media">
        <img src="${cover}" alt="${proj.title}">
      </div>
      <div class="project-card-body">
        <span class="project-index">Projeto ${String(index + 1).padStart(2, "0")}</span>
        <h3>${proj.title}</h3>
        <p>${proj.desc}</p>
        <span class="project-page">Abrir Detalhes</span>
      </div>
    `;
    card.addEventListener("click", (e) => {
      e.preventDefault();
      openProjectModal(proj.id);
    });
    projectGrid.appendChild(card);
  });
}

// ===== Abrir modal de detalhes =====
const projectModal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalProjTitle");
const modalInfo = document.getElementById("modalProjInfo");
const modalLink = document.getElementById("modalProjLink");
const mainImg = document.getElementById("mainCarouselImg");
const thumbContainer = document.getElementById("carouselThumbnails");

function openProjectModal(projectId) {
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return;

  // Preencher informações
  modalTitle.innerHTML = proj.title;
  modalInfo.innerHTML = proj.info.replace(/\n/g, "<br>");
  if (proj.link && proj.link.trim() !== "") {
    modalLink.style.display = "inline-flex";
    modalLink.href = proj.link;
  } else {
    modalLink.style.display = "none";
  }

  // Carrossel
  const images = proj.images || [];
  if (images.length === 0) {
    mainImg.src = "";
    thumbContainer.innerHTML = "<p style='color:var(--taupe);'>Nenhuma imagem disponível.</p>";
    projectModal.style.display = "flex";
    return;
  }

  mainImg.src = images[0].url;
  thumbContainer.innerHTML = "";
  images.forEach((img, idx) => {
    const thumb = document.createElement("img");
    thumb.src = img.url;
    if (idx === 0) thumb.classList.add("active");
    thumb.addEventListener("click", () => {
      mainImg.src = img.url;
      // Atualizar descrição? Sim, podemos mostrar a descrição da imagem na área de informações.
      // Mas o modalInfo já contém a descrição geral. Vou adicionar um pequeno espaço para descrição da imagem.
      // Como o pedido foi para mostrar a descrição de cada imagem, vou sobrescrever o modalInfo com a descrição da imagem.
      // Mas o usuário quer que a descrição geral também seja exibida. Vou colocar a descrição da imagem abaixo do título.
      // Para isso, vou modificar o modalInfo para incluir a descrição da imagem atual.
      // Vou reestruturar: no modal, teremos o título, a descrição geral (info) e, abaixo, a descrição da imagem selecionada.
      // Para simplificar, vou colocar a descrição da imagem no lugar do info, mas isso pode perder a info geral.
      // Melhor: manter info geral e adicionar um elemento extra para a descrição da imagem.
      // Vou criar um elemento #modalImageDesc no HTML.
      const imgDesc = document.getElementById("modalImageDesc");
      if (imgDesc) {
        imgDesc.innerHTML = img.description || "";
      }
      document.querySelectorAll(".thumbnails img").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
    thumbContainer.appendChild(thumb);
  });

  // Adicionar descrição da primeira imagem
  const imgDesc = document.getElementById("modalImageDesc");
  if (imgDesc) {
    imgDesc.innerHTML = images[0].description || "";
  }

  projectModal.style.display = "flex";
}

// ===== Fechar modal =====
function closeProjectModal() {
  projectModal.style.display = "none";
}
document.querySelector(".project-close-btn").addEventListener("click", closeProjectModal);
window.addEventListener("click", (e) => {
  if (e.target === projectModal) closeProjectModal();
});

// ===== Admin – verificar acesso (será chamado no admin.html) =====
// Essa função é usada no admin.html para carregar a lista de projetos
function getProjects() {
  return projects;
}
function saveProjects(newProjects) {
  projects = newProjects;
  localStorage.setItem("projetosPortifolio", JSON.stringify(projects));
  renderProjects();
}

// Inicializar renderização
renderProjects();

// ===== Adicionar um elemento para descrição da imagem no modal (HTML) =====
// Como o modal já existe, vou adicionar via JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const infoSide = document.querySelector(".project-info-side");
  if (infoSide) {
    const descDiv = document.createElement("div");
    descDiv.id = "modalImageDesc";
    descDiv.style.marginTop = "20px";
    descDiv.style.color = "var(--cream)";
    descDiv.style.fontSize = "0.95rem";
    descDiv.style.lineHeight = "1.6";
    descDiv.style.borderTop = "1px solid rgba(201,169,110,0.15)";
    descDiv.style.paddingTop = "15px";
    // Inserir depois do modalInfo
    const info = document.getElementById("modalProjInfo");
    if (info) {
      info.after(descDiv);
    }
  }
});