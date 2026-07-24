// ==========================================
// PARTE 1: INTERFACE, ANIMAÇÕES E CURSOR
// (Totalmente isolado para nunca travar o site)
// ==========================================

const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (cursor && cursorRing) {
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = `${mouseX - 4}px`; cursor.style.top = `${mouseY - 4}px`;
  });
  function animateRing() {
    ringX += (mouseX - ringX - 18) * 0.12; ringY += (mouseY - ringY - 18) * 0.12;
    cursorRing.style.left = `${ringX}px`; cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();
}

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (navbar) { window.scrollY > 80 ? navbar.classList.add("scrolled") : navbar.classList.remove("scrolled"); }
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
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
reveals.forEach((el) => observer.observe(el));

// Fechamento de Modais e Controle de Zoom
const projectModalEl = document.getElementById('projectModal');
const modalClose = document.querySelector('.project-close-btn');
const zoomBtn = document.getElementById('zoomBtn');
const zoomModal = document.getElementById('zoomModal');
const zoomModalImg = document.getElementById('zoomModalImg');
const closeZoomBtn = document.getElementById('closeZoomBtn');

if (modalClose) {
  modalClose.addEventListener('click', () => { if(projectModalEl) projectModalEl.style.display = 'none'; });
}

if (zoomBtn && zoomModal) {
  zoomBtn.addEventListener('click', () => {
    zoomModalImg.src = document.getElementById('mainCarouselImg').src;
    zoomModal.style.display = 'flex';
  });
  closeZoomBtn.addEventListener('click', () => {
    zoomModal.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (e.target === projectModalEl) projectModalEl.style.display = 'none';
  if (e.target === zoomModal) zoomModal.style.display = 'none';
});

// Formulário de Contato
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
      const subject = "Novo contato pelo site - Cintia Bergamasco";
      const bodyLines = [
        "Novo contato pelo site:\n",
        `Nome: ${formData.get("Nome") || ""}`,
        `Email: ${formData.get("Email") || ""}`,
        `Telefone: ${formData.get("Telefone") || ""}`,
        `Tipo de Projeto: ${formData.get("Tipo de Projeto") || ""}\n`,
        "Mensagem:",
        formData.get("Mensagem") || ""
      ];
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      if (formStatus) {
        formStatus.textContent = "Modo local: Abrindo seu e-mail...";
        formStatus.classList.add("is-visible");
      }
      return;
    }
    const submitButton = contactForm.querySelector(".form-submit");
    if (submitButton) { submitButton.textContent = "Enviando..."; submitButton.disabled = true; }
  });
}


// ==========================================
// PARTE 2: CONEXÃO COM O SUPABASE E PROJETOS
// (Isolado para proteger o restante do site)
// ==========================================
try {
  // Substitua as chaves abaixo pelas suas
  const supabaseUrl = 'https://sydaajqyxwyedbinoubt.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5ZGFhanF5eHd5ZWRiaW5vdWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NzA3NDgsImV4cCI6MjA5OTM0Njc0OH0.m7vz1kp-brGFclrilB9AN5aqb-c3RSyZRvlcGNt6kDo';
  let supabaseClient = null;

  // Só cria a conexão se o HTML tiver carregado a biblioteca com sucesso
  if (typeof window.supabase !== 'undefined') {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn("Aviso: A tag do Supabase não foi encontrada no HTML.");
  }

  async function fetchProjects() {
    if (!supabaseClient) return [];
    try {
      const { data, error } = await supabaseClient.from('projetos').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Erro ao buscar projetos:", err);
      return [];
    }
  }

  async function renderMainPortfolioGrid() {
    const grid = document.getElementById('dynamicProjectGrid');
    if (!grid) return;

    const projects = await fetchProjects();
    grid.innerHTML = '';
    
    const countSpan = document.getElementById('projetosCount');
    if (countSpan) countSpan.innerText = projects.length;
    
    projects.forEach((proj, index) => {
      const card = document.createElement('div');
      card.className = 'project-card reveal visible';
      card.style.cursor = 'pointer';
      
      let imgArray = [];
      if (proj.images && Array.isArray(proj.images)) { imgArray = proj.images; }
      else if (typeof proj.images === 'string') { try { imgArray = JSON.parse(proj.images); } catch(e){} }
      
      proj.images = imgArray;
      const firstImg = (imgArray.length > 0) ? imgArray[0].url : '';
      
      card.innerHTML = `
        <div class="project-card-media">
          <img src="${firstImg}" alt="${proj.title}">
        </div>
        <div class="project-card-body">
          <span class="project-index">Projeto ${String(index + 1).padStart(2, '0')}</span>
          <h3>${proj.title}</h3>
          <p>${proj.desc}</p>
          <span class="project-page">Ver Detalhes</span>
        </div>
      `;
      card.addEventListener('click', () => openGalleryModal(proj));
      grid.appendChild(card);
    });
  }

  function openGalleryModal(proj) {
    const modal = document.getElementById('projectModal');
    if(!modal) return;
    
    document.getElementById('modalProjTitle').innerHTML = proj.title;
    const linkBtn = document.getElementById('modalProjLink');
    
    if (proj.link && proj.link.trim() !== '') {
      linkBtn.style.display = 'inline-flex';
      linkBtn.href = proj.link;
    } else {
      linkBtn.style.display = 'none';
    }
    
    const mainImg = document.getElementById('mainCarouselImg');
    const descEl = document.getElementById('modalImageDesc');
    const thumbContainer = document.getElementById('carouselThumbnails');
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    
    let currentActiveIdx = 0;

    if (proj.images && proj.images.length > 1) {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
    
    function updateCarouselView(idx) {
      const imgData = proj.images[idx];
      if(!imgData) return;
      
      currentActiveIdx = idx;
      mainImg.src = imgData.url;
      descEl.innerHTML = imgData.desc;
      
      document.querySelectorAll('#carouselThumbnails img').forEach((t, i) => {
        if(i === idx) t.classList.add('active');
        else t.classList.remove('active');
      });
    }
    
    prevBtn.onclick = () => {
      let newIdx = currentActiveIdx - 1;
      if (newIdx < 0) newIdx = proj.images.length - 1;
      updateCarouselView(newIdx);
    };
    
    nextBtn.onclick = () => {
      let newIdx = currentActiveIdx + 1;
      if (newIdx >= proj.images.length) newIdx = 0;
      updateCarouselView(newIdx);
    };
    
    thumbContainer.innerHTML = '';
    proj.images.forEach((img, idx) => {
      const thumb = document.createElement('img');
      thumb.src = img.url;
      thumb.addEventListener('click', () => updateCarouselView(idx));
      thumbContainer.appendChild(thumb);
    });
    
    if (proj.images && proj.images.length > 0) updateCarouselView(0);
    modal.style.display = 'flex';
  }

  document.addEventListener('DOMContentLoaded', renderMainPortfolioGrid);

} catch (error) {
  console.error("Erro isolado na execução do banco de dados:", error);
}