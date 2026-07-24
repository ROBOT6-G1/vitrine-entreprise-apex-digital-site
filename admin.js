import { db, collection, addDoc, onSnapshot, query, orderBy } from './firebase-config.js';

// SIMPLE AUTHENTICATION (DEFAULT PIN: 1234)
const loginModal = document.getElementById('admin-login-modal');
const loginForm = document.getElementById('admin-login-form');
const passInput = document.getElementById('admin-pass-input');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (passInput.value === '1234') {
    loginModal.classList.add('hidden');
  } else {
    alert('Teny miafina tsy izy!');
  }
});

// SWITCH ADMIN TABS
window.switchTab = function(tabId) {
  const tabs = ['tab-editor', 'tab-images', 'tab-services', 'tab-messages'];
  tabs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const active = document.getElementById(tabId);
  if (active) active.classList.remove('hidden');
};

// HTML5 CANVAS IMAGE COMPRESSOR (<150KB)
const fileInput = document.getElementById('img-file-input');
const previewBox = document.getElementById('img-preview-box');
const previewImg = document.getElementById('compressed-preview-img');
const sizeLabel = document.getElementById('compressed-size-label');

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Compress JPEG to 0.7 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        previewImg.src = dataUrl;
        previewBox.classList.remove('hidden');
        sizeLabel.textContent = `Haben'ny sary vaovao: ~${Math.round((dataUrl.length * 3) / 4 / 1024)} KB (Latsaky ny 150KB)`;
      };
    };
    reader.readAsDataURL(file);
  });
}

// LISTEN TO MESSAGES IN REALTIME
const messagesContainer = document.getElementById('admin-messages-list');
if (messagesContainer) {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      messagesContainer.innerHTML = '<p class="text-xs text-slate-400">Mbola tsy misy hafatra azo.</p>';
      return;
    }
    messagesContainer.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      return `
        <div class="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
          <div class="flex justify-between items-center text-xs text-blue-400 font-bold">
            <span>${data.name || 'Mpanjifa'} (${data.email})</span>
          </div>
          <p class="text-sm text-slate-200">${data.message}</p>
        </div>
      `;
    }).join('');
  });
}