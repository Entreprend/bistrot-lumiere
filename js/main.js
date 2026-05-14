/* ══════════════════════════════════════
   BISTROT LUMIÈRE — JavaScript Principal
   ══════════════════════════════════════ */

/* ── BURGER MENU ── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

/* ── RÉSERVATION ── */
function handleResa(e) {
  e.preventDefault();
  showToast('Demande reçue ! Confirmation par email sous 2h.');
  e.target.reset();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

/* ── CHATBOT ── */
const SYSTEM = `Tu es "Lumière", l'assistante virtuelle raffinée du restaurant gastronomique Le Bistrot Lumière à Paris.
Tu réponds avec élégance, chaleur et concision — maximum 3-4 phrases par réponse.
Ton registre est distingué mais accessible, jamais guindé.

INFORMATIONS COMPLÈTES :
Nom : Le Bistrot Lumière — Restaurant Gastronomique
Adresse : 12 Rue de la Paix, 75006 Paris (Métro Odéon, lignes 4 et 10)
Téléphone : +33 1 42 33 44 55
Email : contact@bistrot-lumiere.fr

HORAIRES :
Mardi–Vendredi : 12h00–14h30 et 19h00–22h30
Samedi–Dimanche : 19h00–23h00
Fermé le lundi

RÉSERVATION : formulaire sur le site, téléphone, ou email

CARTE :
Entrées (18–36€) : Tartare de Saint-Jacques, Foie Gras Maison, Velouté de Truffe, Burrata Héritage, Soupe à l'Oignon, Œuf Parfait & Morilles
Plats (48–68€) : Sole Meunière, Filet de Bœuf Rossini, Pigeon Rôti, Risotto Homard, Agneau en Croûte, Dos de Cabillaud
Desserts (14–18€) : Soufflé Grand Marnier, Millefeuille Caramel, Crème Brûlée Tonka, Tarte Citron Meringuée
Prix moyen : 90–130€ par personne hors boissons

INFOS PRATIQUES :
Menu végétarien disponible sur demande (à préciser à la réservation)
Événements privés et séminaires : salle jusqu'à 80 personnes
Terrasse disponible en saison
Parking Rue Mabillon à 3 min
Accessibilité PMR : oui
2 étoiles Michelin · Fondé en 1987 par le Chef Alain Moreau

Si tu ne connais pas la réponse, invite chaleureusement à appeler le restaurant.`;

let chatHistory = [];
let chatIsOpen = false;
let chatBusy = false;

function toggleChat() {
  chatIsOpen = !chatIsOpen;
  const panel = document.getElementById('chat-panel');
  panel.classList.toggle('chat-open', chatIsOpen);
  panel.classList.toggle('chat-closed', !chatIsOpen);

  if (chatIsOpen && chatHistory.length === 0) {
    setTimeout(() => {
      appendMsg('bot', 'Bonsoir, je suis Lumière. Comment puis-je vous être utile ce soir ?');
    }, 150);
  }
}

function appendMsg(role, text) {
  const body = document.getElementById('chat-body');
  const div = document.createElement('div');
  div.className = 'chat-msg ' + (role === 'user' ? 'u' : '');
  div.innerHTML = role === 'bot'
    ? `<div class="chat-av">✦</div><div class="bubble-wrap">${text}</div>`
    : `<div class="bubble-wrap">${text}</div><div class="chat-av">◎</div>`;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function qask(text) {
  document.getElementById('chat-input').value = text;
  sendChat();
}

async function sendChat() {
  if (chatBusy) return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  appendMsg('user', text);
  chatHistory.push({ role: 'user', content: text });

  chatBusy = true;
  const typing = document.getElementById('chat-typing');
  const quick = document.getElementById('chat-quick');
  typing.classList.add('show');
  quick.style.display = 'none';

  try {
    // Appel vers notre proxy sécurisé (Vercel Function)
    // La clé API Anthropic reste côté serveur — jamais exposée
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });

    if (!res.ok) throw new Error('Erreur serveur ' + res.status);

    const data = await res.json();
    const reply = data.content?.[0]?.text
      ?? "Je vous prie de m'excuser, une difficulté technique est survenue. N'hésitez pas à nous appeler.";

    chatHistory.push({ role: 'assistant', content: reply });
    typing.classList.remove('show');
    appendMsg('bot', reply);

  } catch (err) {
    typing.classList.remove('show');
    appendMsg('bot', "Toutes mes excuses, une erreur est survenue. Appelez-nous au +33 1 42 33 44 55.");
  }

  chatBusy = false;
  quick.style.display = 'flex';
}

/* ── ANIMATION AU SCROLL (entrée des éléments) ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.menu-item, .info-card, .about-stat, .events-list li').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
