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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages manquants ou invalides' });
  }

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

OPTIONS :
- Menu végétarien disponible sur demande
- Événements privés jusqu'à 80 personnes
- Terrasse en saison · Parking Rue Mabillon
- 2 étoiles Michelin · Fondé en 1987

Si tu ne connais pas la réponse, invite à appeler le +33 1 42 33 44 55.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // ← variable d'env Vercel
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM,
        messages: messages
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
