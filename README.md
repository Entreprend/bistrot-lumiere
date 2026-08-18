# Le Bistrot Lumière — Guide de déploiement complet

## Pourquoi le chatbot ne marche pas en local ?

Les navigateurs bloquent les appels directs vers api.anthropic.com
depuis un fichier HTML (règle de sécurité CORS).
La solution : une Vercel Function fait le relais entre le site et l'API.
La clé API reste côté serveur — jamais visible dans le code public.

---

## ÉTAPE 1 — Obtenir ta clé API Anthropic (5 min)

1. Va sur https://console.anthropic.com
2. Crée un compte (gratuit)
3. Clique sur "API Keys" → "Create Key"
4. Copie la clé → elle ressemble à : sk-ant-api03-xxxxxxxxxxxx
5. Garde-la précieusement (elle ne s'affiche qu'une fois)

Coût estimé pour une PME : 2 à 5 dollars par mois maximum.

---

## ÉTAPE 2 — Créer un compte Vercel (2 min)

1. Va sur https://vercel.com
2. Clique "Sign Up" → connecte-toi avec GitHub (le plus simple)
   Si tu n'as pas GitHub : https://github.com → créer un compte gratuit
3. C'est tout — Vercel est gratuit pour ce type de projet

---

## ÉTAPE 3 — Déployer le site sur Vercel (3 min)

Option A — Via l'interface web (le plus simple)
1. Va sur https://vercel.com/new
2. Clique "Browse" ou glisse le dossier bistrot-lumiere-v2/
3. Vercel détecte automatiquement la config (vercel.json)
4. Clique "Deploy"
5. Ton site est en ligne : https://bistrot-lumiere-xxxx.vercel.app

Option B — Via terminal (si tu as Node.js installé)
  npm install -g vercel
  cd bistrot-lumiere-v2
  vercel

---

## ÉTAPE 4 — Ajouter la clé API (1 min) — ESSENTIEL

Sans cette étape, le chatbot ne répond pas.

1. Dans ton dashboard Vercel → clique sur ton projet
2. Onglet "Settings" → "Environment Variables"
3. Clique "Add New"
   Name  : ANTHROPIC_API_KEY
   Value : sk-ant-TA-CLE-ICI
4. Clique "Save"
5. Retourne dans "Deployments" → 3 points → "Redeploy"

Le chatbot est maintenant 100% opérationnel.

---

## ÉTAPE 5 — Tester

1. Ouvre ton URL Vercel
2. Clique sur "Assistance" en bas à droite
3. Pose une question : "Quels sont vos horaires ?"
4. Lumière répond instantanément

---

## Structure du projet

  bistrot-lumiere-v2/
  ├── index.html       ← Page principale
  ├── vercel.json      ← Config Vercel
  ├── api/
  │   └── chat.js      ← Proxy sécurisé (clé API serveur)
  ├── css/
  │   └── style.css    ← Design complet
  ├── js/
  │   └── main.js      ← Chatbot + interactions
  └── images/          ← Photos du restaurant

---

## Personnaliser pour un client

Changer le nom : dans index.html cherche "Bistrot Lumière" et remplace.
Changer les infos chatbot : dans api/chat.js modifie la constante SYSTEM.
Changer les couleurs : dans css/style.css modifie --olive et --olive-l.
Changer le domaine : Vercel Settings → Domains → ajouter ton domaine.

---

## Valeur commerciale

  Site vitrine seul            600 – 900 euros
  + Chatbot IA intégré       + 400 – 600 euros
  + Déploiement & config     + 100 – 200 euros
  Maintenance mensuelle       30  –  60 euros/mois
  Total projet complet       1100 – 1700 euros

---
Projet réalisé avec Claude IA
