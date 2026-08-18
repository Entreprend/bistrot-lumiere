// api/chat.js — Vercel Serverless Function
// Proxy sécurisé : reçoit les messages du front, appelle Claude, renvoie la réponse
// La clé API reste côté serveur — jamais exposée au client

export default async function handler(req, res) {

  // CORS — autorise ton domaine en production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages manquants ou invalides' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: `Tu es l'assistant de La Cave, restaurant à Paris. Tu réponds aux questions sur la carte, les vins, les horaires (mar-sam 12h-14h30 et 19h-22h30, fermé dim-lun), les réservations. Chaleureux, précis, jamais robotique. Maximum 3 phrases. Si on te demande si tu es une IA, réponds que tu es l'assistant de La Cave.

INFORMATIONS COMPLÈTES :
Nom : La Cave — Restaurant & Cave à Vins
Adresse : 12 Rue de la Paix, 75006 Paris
Téléphone : +33 1 42 33 44 55
Email : contact@lacave-restaurant.fr

HORAIRES :
Mardi–Vendredi : 12h00–14h30 et 19h00–22h30
Samedi–Dimanche : 19h00–23h00
Fermé le lundi

CARTE :
Entrées (18–36€) : Tartare de Saint-Jacques, Foie Gras Maison, Velouté de Truffe, Burrata Héritage, Soupe à l'Oignon, Œuf Parfait & Morilles
Plats (48–68€) : Sole Meunière, Filet de Bœuf Rossini, Pigeon Rôti, Risotto Homard, Agneau en Croûte, Dos de Cabillaud
Desserts (14–18€) : Soufflé Grand Marnier, Millefeuille Caramel, Crème Brûlée Tonka, Tarte Citron Meringuée
La Cave — vins (42–120€) : Sancerre blanc 2022, Saint-Émilion Grand Cru 2019, Côtes du Rhône rouge 2021, Champagne Brut Millésimé 2018, Bourgogne Pinot Noir 2020, Pouilly-Fumé 2022

OPTIONS :
Menu végétarien disponible sur demande
Événements privés : salle jusqu'à 30 couverts
Cave de 400 références, sélectionnée par notre sommelière
Ouvert depuis 2019 dans le 11e arrondissement

Si tu ne connais pas la réponse, invite à appeler le +33 1 42 33 44 55.`,
        messages
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Erreur API Anthropic:', err);
      return res.status(response.status).json({ error: 'Erreur API', detail: err });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Erreur serveur:', error);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
}
