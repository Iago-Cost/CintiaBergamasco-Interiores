// ============================================================
//  CONFIGURAÇÃO DO JSONBIN (substitua pelos seus dados)
// ============================================================
const JSONBIN_API_KEY = "$2a$10$Ou3.0Ar.8eJ.gahM1YYkh.hF.HoVVYODKliFBm2xUAsxn/58/eSbe";
const JSONBIN_BIN_ID = "6a525ef74bc4bb5fc2e56d95";
const BIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// ============================================================
//  FUNÇÕES DE PERSISTÊNCIA
// ============================================================
async function carregarProjetos() {
  try {
    const response = await fetch(BIN_URL, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    });
    const data = await response.json();
    return data.record?.projetos || [];
  } catch (error) {
    console.error("Erro ao carregar projetos:", error);
    return [];
  }
}

async function salvarProjetos(projetos) {
  try {
    await fetch(BIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify({ projetos })
    });
    return true;
  } catch (error) {
    console.error("Erro ao salvar projetos:", error);
    return false;
  }
}

// ============================================================
//  CURSOR PERSONALIZADO (mantido)
// ============================================================
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

// ============================================================
//  NAVBAR, PARALLAX, REVEAL (mantidos)
// ============================================================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 80);
});





const parallaxBg = document.getElementById("parallaxBg");
const parallaxSection = document.getElementById("parallax");
window.addEventListener("scroll", () => {
  if (!parallaxBg || !parallaxSection) return;
  const rect = parallaxSection.getBoundingClientRect();
  const progress = -rect.top / (rect.height + window.innerHeight);
  parallaxBg.style.transform = `translateY(${progress * 60}px)`;
});



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

// Hero scroll
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

// ============================================================
//  CONTADOR DE ESTATÍSTICAS (mantido)
// ============================================================
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

// ============================================================
//  FORMULÁRIO DE CONTATO (mantido)
// ============================================================
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
//  ADMIN – VERIFICAÇÃO DE ACESSO
// ============================================================
const adminPanel = document.getElementById("adminPanel");
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('admin') === 'true') {
  const senha = prompt("Acesso Restrito. Digite a senha do administrador:");
  if (senha === "CintiaDesign2026") {
    adminPanel.style.display = "block";
    // Forçar scroll para o admin
    adminPanel.scrollIntoView({ behavior: "smooth" });
  } else {
    alert("Senha incorreta. Acesso negado.");
    // Remover parâmetro da URL
    const clean = new URL(window.location.href);
    clean.searchParams.delete("admin");
    window.history.replaceState({}, "", clean);
  }
}

// ============================================================
//  GERENCIAMENTO DE PROJETOS (com JSONBin)
// ============================================================
let projects = [];

// Referências DOM
const projectGrid = document.getElementById("projectGrid");
const projectList = document.getElementById("projectList");
const adminForm = document.getElementById("adminForm");
const editId = document.getElementById("editId");
const projTitle = document.getElementById("projTitle");
const projDesc = document.getElementById("projDesc");
const projInfo = document.getElementById("projInfo");
const projLink = document.getElementById("projLink");
const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("uploadArea");
const previewList = document.getElementById("imagePreviewList");
const statusMsg = document.getElementById("statusMsg");
const formTitle = document.getElementById("formTitle");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const previewBtn = document.getElementById("previewBtn");

// Estado das imagens
let imageData = [];

// ===== Carregar projetos do JSONBin =====
async function loadProjects() {
  projects = await carregarProjetos();
  if (!projects || projects.length === 0) {
    // Dados iniciais (exemplo)
    projects = [
      { id: "p1", title: "Quarto", desc: "Estudo de ambiente residencial", info: "Ambiente tranquilo com iluminação natural.", link: "", images: [{ url: "https://online.fliphtml5.com/kbrbj/rznn/files/large/cd35dac653d9d420dbb732f9ae761d96.webp", description: "Vista geral do quarto" }] },
      { id: "p2", title: "Sala", desc: "Proposta para espaço de convivência", info: "Integração entre sala e jantar.", link: "", images: [{ url: "https://online.fliphtml5.com/kbrbj/rznn/files/large/2640ced1c386f5b948d3e2caadd3833a.webp", description: "Vista ampla" }] }
    ];
    await salvarProjetos(projects);
  }
  renderProjects();
  renderAdminList();
}

// ===== Renderizar grade de projetos (front-end) =====
function renderProjects() {
  if (!projectGrid) return;
  projectGrid.innerHTML = "";
  projects.forEach((proj, index) => {
    const card = document.createElement("a");
    card.className = "project-card reveal visible";
    card.href = "#";
    card.setAttribute("data-id", proj.id);

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

// ===== Renderizar lista no admin =====
function renderAdminList() {
  if (!projectList) return;
  projectList.innerHTML = "";
  projects.forEach((proj) => {
    const item = document.createElement("div");
    item.className = "project-item";
    item.innerHTML = `
      <div class="info">
        <span class="title">${proj.title}</span>
        <span class="desc">${proj.desc} (${proj.images ? proj.images.length : 0} imagens)</span>
      </div>
      <div class="actions">
        <button class="edit" data-id="${proj.id}">Editar</button>
        <button class="delete" data-id="${proj.id}">Excluir</button>
      </div>
    `;
    projectList.appendChild(item);
  });

  document.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", () => loadProject(btn.dataset.id));
  });
  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", () => deleteProject(btn.dataset.id));
  });
}

// ===== Carregar projeto para edição =====
function loadProject(id) {
  const proj = projects.find(p => p.id === id);
  if (!proj) return;
  editId.value = proj.id;
  projTitle.value = proj.title;
  projDesc.value = proj.desc;
  projInfo.value = proj.info || "";
  projLink.value = proj.link || "";
  imageData = proj.images ? proj.images.map(img => ({ url: img.url, description: img.description || "" })) : [];
  renderImagePreviews();
  formTitle.textContent = "Editar Projeto";
  saveBtn.textContent = "Atualizar Projeto";
  cancelBtn.style.display = "inline-block";
  statusMsg.classList.remove("show");
  adminForm.scrollIntoView({ behavior: "smooth" });
}

// ===== Reset formulário =====
function resetForm() {
  editId.value = "";
  projTitle.value = "";
  projDesc.value = "";
  projInfo.value = "";
  projLink.value = "";
  imageData = [];
  renderImagePreviews();
  fileInput.value = "";
  formTitle.textContent = "Novo Projeto";
  saveBtn.textContent = "Salvar Projeto";
  cancelBtn.style.display = "none";
  statusMsg.classList.remove("show");
}

// ===== Renderizar previews das imagens =====
function renderImagePreviews() {
  if (!previewList) return;
  previewList.innerHTML = "";
  imageData.forEach((img, idx) => {
    const div = document.createElement("div");
    div.className = "image-preview-item";
    div.innerHTML = `
      <img src="${img.url}" alt="Imagem ${idx+1}">
      <div class="desc-field">
        <textarea placeholder="Descrição da imagem (suporta HTML)" rows="2">${img.description || ""}</textarea>
      </div>
      <button class="remove-img" data-idx="${idx}">✕</button>
    `;
    previewList.appendChild(div);
  });

  previewList.querySelectorAll(".desc-field textarea").forEach((ta, idx) => {
    ta.addEventListener("input", () => {
      if (imageData[idx]) imageData[idx].description = ta.value;
    });
  });

  previewList.querySelectorAll(".remove-img").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx);
      imageData.splice(idx, 1);
      renderImagePreviews();
    });
  });
}

// ===== Upload de imagens =====
if (uploadArea && fileInput) {
  uploadArea.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const files = e.target.files;
    if (!files.length) return;
    for (let f of files) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        imageData.push({ url: ev.target.result, description: "" });
        renderImagePreviews();
      };
      reader.readAsDataURL(f);
    }
    fileInput.value = "";
  });
}

// ===== Salvar projeto (admin) =====
adminForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = editId.value || Date.now().toString();
  const newProj = {
    id: id,
    title: projTitle.value.trim(),
    desc: projDesc.value.trim(),
    info: projInfo.value,
    link: projLink.value.trim(),
    images: imageData
  };

  if (!newProj.title || !newProj.desc) {
    statusMsg.textContent = "Preencha pelo menos o título e a descrição curta.";
    statusMsg.style.display = "block";
    return;
  }
  if (imageData.length === 0) {
    statusMsg.textContent = "Adicione pelo menos uma imagem.";
    statusMsg.style.display = "block";
    return;
  }

  const existing = projects.findIndex(p => p.id === id);
  if (existing !== -1) {
    projects[existing] = newProj;
  } else {
    projects.push(newProj);
  }

  const success = await salvarProjetos(projects);
  if (success) {
    statusMsg.textContent = "Projeto salvo com sucesso!";
    statusMsg.style.display = "block";
    renderProjects();
    renderAdminList();
    resetForm();
  } else {
    statusMsg.textContent = "Erro ao salvar. Verifique sua conexão ou credenciais do JSONBin.";
    statusMsg.style.display = "block";
  }
});

// ===== Excluir projeto =====
async function deleteProject(id) {
  if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
  projects = projects.filter(p => p.id !== id);
  const success = await salvarProjetos(projects);
  if (success) {
    renderProjects();
    renderAdminList();
    if (editId.value === id) resetForm();
  } else {
    alert("Erro ao excluir. Tente novamente.");
  }
}

// ===== Cancelar edição =====
cancelBtn.addEventListener("click", resetForm);

// ===== Prévia do projeto =====
previewBtn.addEventListener("click", () => {
  const title = projTitle.value.trim() || "Título";
  const desc = projDesc.value.trim() || "Descrição";
  const info = projInfo.value || "Informações do projeto.";
  const link = projLink.value.trim();
  const firstImg = imageData.length > 0 ? imageData[0].url : "";

  // Abrir modal de prévia (usando o mesmo modal de visualização)
  document.getElementById("modalProjTitle").innerHTML = title;
  document.getElementById("modalProjInfo").innerHTML = info.replace(/\n/g, "<br>");
  document.getElementById("modalImageDesc").innerHTML = imageData.length > 0 ? imageData[0].description : "";
  document.getElementById("mainCarouselImg").src = firstImg;
  const linkEl = document.getElementById("modalProjLink");
  if (link) {
    linkEl.href = link;
    linkEl.style.display = "inline-flex";
  } else {
    linkEl.style.display = "none";
  }
  // Preencher miniaturas
  const thumbContainer = document.getElementById("carouselThumbnails");
  thumbContainer.innerHTML = "";
  imageData.forEach((img, idx) => {
    const thumb = document.createElement("img");
    thumb.src = img.url;
    if (idx === 0) thumb.classList.add("active");
    thumb.addEventListener("click", () => {
      document.getElementById("mainCarouselImg").src = img.url;
      document.getElementById("modalImageDesc").innerHTML = img.description || "";
      document.querySelectorAll("#carouselThumbnails img").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
    thumbContainer.appendChild(thumb);
  });

  document.getElementById("projectModal").style.display = "flex";
});

// ===== Fechar modal de visualização =====
const projectModal = document.getElementById("projectModal");
document.querySelector(".project-close-btn").addEventListener("click", () => {
  projectModal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === projectModal) projectModal.style.display = "none";
});

// ===== Abrir modal de detalhes (front-end) =====
function openProjectModal(projectId) {
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return;

  document.getElementById("modalProjTitle").innerHTML = proj.title;
  document.getElementById("modalProjInfo").innerHTML = proj.info.replace(/\n/g, "<br>");
  const linkEl = document.getElementById("modalProjLink");
  if (proj.link && proj.link.trim() !== "") {
    linkEl.href = proj.link;
    linkEl.style.display = "inline-flex";
  } else {
    linkEl.style.display = "none";
  }

  const images = proj.images || [];
  const mainImg = document.getElementById("mainCarouselImg");
  const thumbContainer = document.getElementById("carouselThumbnails");
  const imgDesc = document.getElementById("modalImageDesc");

  if (images.length === 0) {
    mainImg.src = "";
    thumbContainer.innerHTML = "";
    imgDesc.innerHTML = "";
    projectModal.style.display = "flex";
    return;
  }

  mainImg.src = images[0].url;
  imgDesc.innerHTML = images[0].description || "";
  thumbContainer.innerHTML = "";
  images.forEach((img, idx) => {
    const thumb = document.createElement("img");
    thumb.src = img.url;
    if (idx === 0) thumb.classList.add("active");
    thumb.addEventListener("click", () => {
      mainImg.src = img.url;
      imgDesc.innerHTML = img.description || "";
      document.querySelectorAll("#carouselThumbnails img").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
    thumbContainer.appendChild(thumb);
  });

  projectModal.style.display = "flex";
}

// ===== Botão "Criar Novo" no admin =====
document.getElementById("btnNew")?.addEventListener("click", resetForm);

// ============================================================
//  INICIALIZAÇÃO
// ============================================================
loadProjects();