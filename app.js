import { db, collection, addDoc, onSnapshot, query, orderBy } from './firebase-config.js';

// MOCK DEFAULT SERVICES DATA
const defaultServices = [
  {
    title: "Famoronana Tranonkala",
    desc: "Site Vitrine, E-Commerce, Application Web maoderina mifanaraka amin'ny Ecran rehetra.",
    icon: "fa-code"
  },
  {
    title: "Fampiharana Mobile",
    desc: "Application Android sy iOS amboarina amin'ny Flutter sy React Native ho an'ny mpanjifanao.",
    icon: "fa-mobile-screen-button"
  },
  {
    title: "Marketing & SEO",
    desc: "Fampiroboroboana amin'ny Google, Facebook ary SEO mba hahitana mpanjifa vaovao isan'andro.",
    icon: "fa-chart-line"
  }
];

// MOCK FAQ DATA (OPTION 8)
const defaultFaqs = [
  {
    q: "Hafiriana no faharetan'ny famoronana site vitrine?",
    a: "Matetika dia eo anelanelan'ny 3 ka hatramin'ny 7 dni ny fikarakarana feno ny site vitrine iray."
  },
  {
    q: "Azo ovaina ve ny vontoatiny aoriana?",
    a: "Eny tokony, manana Espace Admin feno ianao ahafahana manova sary, teksta ary hafatra amim-pahalalahana."
  },
  {
    q: "Misy fiantohana fiarovana ve ny site?",
    a: "Eny, mampiasa teknolojia HTTPS sy fiarovana avo lenta avy amin'ny Firebase Firestore izahay."
  }
];

// RENDER SERVICES GRID
function renderServices() {
  const grid = document.getElementById('services-grid-preview') || document.getElementById('full-services-list');
  if (!grid) return;
  grid.innerHTML = defaultServices.map(s => `
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-xl transition space-y-4">
      <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold">
        <i class="fa-solid ${s.icon}"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900">${s.title}</h3>
      <p class="text-slate-600 text-sm leading-relaxed">${s.desc}</p>
    </div>
  `).join('');
}

// RENDER FAQ ACCORDIONS
function renderFaqs() {
  const container = document.getElementById('faq-accordion-container');
  if (!container) return;
  container.innerHTML = defaultFaqs.map((f, i) => `
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <button onclick="this.nextElementSibling.classList.toggle('hidden')" class="w-full p-6 text-left font-bold text-slate-800 flex justify-between items-center">
        <span>${f.q}</span>
        <i class="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
      </button>
      <div class="hidden p-6 pt-0 text-sm text-slate-600 border-t border-slate-100">
        ${f.a}
      </div>
    </div>
  `).join('');
}

// CONTACT FORM SUBMISSION TO FIRESTORE
const contactForm = document.getElementById('public-contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('form-alert');
    const name = document.getElementById('sender-name').value;
    const email = document.getElementById('sender-email').value;
    const message = document.getElementById('sender-message').value;

    try {
      await addDoc(collection(db, 'messages'), {
        name,
        email,
        message,
        createdAt: new Date()
      });
      alertBox.className = "p-4 rounded-xl text-xs font-semibold bg-emerald-100 text-emerald-800 block";
      alertBox.textContent = "Tafalasa soa aman-tsara ny hafatrao! Hamaly anao sy hifandray aminao izahay.";
      contactForm.reset();
    } catch (err) {
      alertBox.className = "p-4 rounded-xl text-xs font-semibold bg-rose-100 text-rose-800 block";
      alertBox.textContent = "Nisy olana kely tamin'ny fandefasana hafatra. Mba andramo indray.";
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderFaqs();
});