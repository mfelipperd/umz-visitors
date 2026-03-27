import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { initI18n, getTranslation } from "./i18n.js";

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- i18n ---
let currentLang = 'pt';
const i18n = initI18n((lang) => {
  currentLang = lang;
  updateDashboardTexts();
  renderMembers(); // Re-render to update status text
});

document.getElementById('lang-select').value = i18n.currentLang;
currentLang = i18n.currentLang;

document.getElementById('lang-select').addEventListener('change', (e) => {
  i18n.setLang(e.target.value);
});

window.addEventListener('tabChanged', (e) => {
  updateDashboardTexts();
});

function updateDashboardTexts() {
  const activeTab = document.getElementById('tab-members').classList.contains('hidden') ? 'analytics' : 'members';
  document.getElementById('tab-title').innerText = getTranslation(currentLang, activeTab);
  
  // Update Lucide icons (some might have been replaced)
  lucide.createIcons();
}

// --- ANALYTICS ---
function listenToAnalytics() {
  const visitsRef = collection(db, "visits");
  onSnapshot(query(visitsRef, orderBy("created_at", "desc")), (snapshot) => {
    let total = 0;
    let adventists = 0;
    let logsHtml = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      total++;
      if (data.is_adventist) adventists++;
      
      const date = data.created_at?.toDate().toLocaleDateString() || "-";
      logsHtml += `
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
          <div>
            <p class="font-bold text-primary">${data.visitor_name}</p>
            <p class="text-xs text-gray-500">${data.visitor_religion} • ${data.visitor_age}y</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-medium text-gray-400">${date}</p>
          </div>
        </div>
      `;
    });

    document.getElementById('total-visits-count').innerText = total;
    document.getElementById('adventist-count').innerText = adventists;
    document.getElementById('non-adventist-count').innerText = total - adventists;
    document.getElementById('visit-logs').innerHTML = logsHtml || `<p class="text-gray-400 italic">${getTranslation(currentLang, 'noData')}</p>`;
  });
}

// --- MEMBER CRUD ---
let allMembers = [];

function listenToMembers() {
  const membersRef = collection(db, "members");
  onSnapshot(membersRef, (snapshot) => {
    allMembers = [];
    snapshot.forEach((doc) => {
      allMembers.push({ id: doc.id, ...doc.data() });
    });
    renderMembers();
  });
}

function renderMembers() {
  const tbody = document.getElementById('member-list-body');
  tbody.innerHTML = allMembers.map(m => `
    <tr>
      <td class="px-6 py-4 font-medium">${m.name}</td>
      <td class="px-6 py-4 text-gray-600">${m.age}</td>
      <td class="px-6 py-4 text-blue-600 font-mono text-sm">${m.phone}</td>
      <td class="px-6 py-4">
        <span class="px-2 py-1 rounded-full text-[10px] uppercase font-bold ${m.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
          ${m.is_active ? getTranslation(currentLang, 'active') : getTranslation(currentLang, 'inactive')}
        </span>
      </td>
      <td class="px-6 py-4 text-right space-x-2">
        <button onclick="editMember('${m.id}')" class="text-gray-400 hover:text-primary transition-colors"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
        <button onclick="deleteMember('${m.id}')" class="text-gray-400 hover:text-red-500 transition-colors"><i data-lucide="trash" class="w-4 h-4"></i></button>
      </td>
    </tr>
  `).join('');
  lucide.createIcons();
}

// CRUD Actions (Exposed to window)
window.editMember = (id) => {
  const m = allMembers.find(m => m.id === id);
  if (!m) return;
  
  document.getElementById('edit-member-id').value = m.id;
  document.getElementById('member-name').value = m.name;
  document.getElementById('member-age').value = m.age;
  document.getElementById('member-phone').value = m.phone;
  document.getElementById('member-active').checked = m.is_active;
  
  window.toggleMemberModal(); // defined in admin.html
};

window.deleteMember = async (id) => {
  if (confirm("Confirm delete?")) {
    await deleteDoc(doc(db, "members", id));
  }
};

document.getElementById('member-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('edit-member-id').value;
  const data = {
    name: document.getElementById('member-name').value,
    age: parseInt(document.getElementById('member-age').value),
    phone: document.getElementById('member-phone').value,
    is_active: document.getElementById('member-active').checked
  };

  try {
    if (id) {
      await updateDoc(doc(db, "members", id), data);
    } else {
      await addDoc(collection(db, "members"), data);
    }
    window.toggleMemberModal();
  } catch (err) {
    console.error("CRUD Error:", err);
    alert("Error saving member.");
  }
});

// --- INITIALIZE ---
window.addEventListener('DOMContentLoaded', () => {
  listenToAnalytics();
  listenToMembers();
});
