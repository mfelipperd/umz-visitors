// Firebase Modular SDK via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- CONFIGURATION ---
// User: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- BIBLE VERSE API ---
async function fetchBibleVerse() {
  const verseEl = document.getElementById('bible-verse');
  const refEl = document.getElementById('verse-reference');
  
  try {
    // A Bíblia Digital API (Random Verse)
    const response = await fetch('https://www.abibliadigital.com.br/api/verses/nvi/random');
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    
    verseEl.innerText = `"${data.text}"`;
    refEl.innerText = `${data.book.name} ${data.chapter}:${data.number}`;
  } catch (error) {
    console.error("Bible API failed, using fallback:", error);
    const fallbacks = [
      { text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal.", ref: "Jeremias 29:11" },
      { text: "O Senhor é o meu pastor, nada me faltará.", ref: "Salmo 23:1" },
      { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" }
    ];
    const random = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    verseEl.innerText = `"${random.text}"`;
    refEl.innerText = random.ref;
  }
}

// --- AFFECTION MESSAGES ---
const affectionMessages = [
  "Você é o convidado de honra de Deus hoje.",
  "Nossa família está mais completa com a sua presença.",
  "Há um lugar reservado para você em nosso banco.",
  "Deus sorri ao ver você aqui.",
  "Sua jornada importa para nós."
];

function rotateAffectionMessage() {
  const msgEl = document.getElementById('affection-message');
  let index = 0;
  
  setInterval(() => {
    msgEl.style.opacity = 0;
    setTimeout(() => {
      index = (index + 1) % affectionMessages.length;
      msgEl.innerText = affectionMessages[index];
      msgEl.style.opacity = 1;
    }, 1000);
  }, 6000);
  
  // Initial show
  msgEl.innerText = affectionMessages[0];
  msgEl.style.opacity = 1;
}

// --- MATCHING ALGORITHM ---
async function getBestMemberMatch(visitorAge) {
  try {
    const membersRef = collection(db, "members");
    const q = query(membersRef, where("is_active", "==", true));
    const querySnapshot = await getDocs(q);
    
    let members = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() });
    });

    // Fallback if no members in DB yet (for testing)
    if (members.length === 0) {
      console.warn("No members found in Firestore. Using Mock data.");
      members = [
        { name: "Irmão Teste", age: 30, phone: "5511999999999" },
        { name: "Irmã Exemplo", age: 50, phone: "5511888888888" }
      ];
    }

    // Filter members by age affinity (+- 10 years)
    let candidates = members.filter(m => Math.abs(m.age - visitorAge) <= 10);
    
    // If no one in range, find the closest
    if (candidates.length === 0) {
      candidates = [members.reduce((prev, curr) => 
        Math.abs(curr.age - visitorAge) < Math.abs(prev.age - visitorAge) ? curr : prev
      )];
    }

    // Randomize candidates to distribute load
    const matchedMember = candidates[Math.floor(Math.random() * candidates.length)];
    return matchedMember;
    
  } catch (error) {
    console.error("Error matching member:", error);
    return null;
  }
}

// --- FORM HANDLING & WHATSAPP LOGIC ---
const form = document.getElementById('visitor-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const age = parseInt(document.getElementById('age').value);
  const religion = document.getElementById('religion').value;

  const matchedMember = await getBestMemberMatch(age);
  
  if (!matchedMember) {
    alert("Desculpe, não conseguimos encontrar um guia no momento. Tente novamente mais tarde.");
    return;
  }

  // Hidden Code Logic
  let message = "";
  if (religion === "Adventist") {
    message = `Olá, meu nome é ${name}. Vi o site da igreja e gostaria de fazer uma visita para passarmos o sábado juntos.`;
  } else {
    message = `Olá, meu nome é ${name}. Vi o site da igreja e gostaria de fazer uma visita para conhecer vocês.`;
  }

  // Log Visit (Analytics)
  try {
    await addDoc(collection(db, "visits"), {
      visitor_name: name,
      visitor_age: age,
      visitor_religion: religion,
      is_adventist: religion === "Adventist",
      member_id: matchedMember.id || "mock",
      created_at: new Date()
    });
  } catch (e) {
    console.error("Error logging visit:", e);
  }

  // Redirect to WhatsApp
  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${matchedMember.phone.replace(/\D/g, '')}?text=${encodedMsg}`;
  
  window.open(whatsappUrl, '_blank');
});

// --- INITIALIZE ---
window.addEventListener('DOMContentLoaded', () => {
  fetchBibleVerse();
  rotateAffectionMessage();
});
