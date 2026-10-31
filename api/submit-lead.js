// Fonction serverless Vercel : reçoit les candidatures du questionnaire.
// Variable d'environnement LEAD_WEBHOOK_URL : URL d'un webhook (Make, Zapier, n8n, Google Apps Script…)
// vers lequel chaque candidature est transférée (Google Sheet, email, CRM…).
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const d = req.body || {};
  const required = ['firstName', 'lastName', 'phone', 'email'];
  const missing = required.filter(k => !String(d[k] || '').trim());
  if (missing.length) return res.status(400).json({ error: 'Champs manquants', missing });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return res.status(400).json({ error: 'Email invalide' });

  const lead = {
    objectif: d.objectif, dureeBlocage: d.dureeBlocage, obstacle: d.obstacle,
    pretInvestir: d.pretInvestir, timing: d.timing,
    age: d.age, taille: d.taille, poids: d.poids, situationPro: d.situationPro,
    firstName: d.firstName, lastName: d.lastName, phone: d.phone, email: d.email,
    instagram: d.instagram || '', submittedAt: d.submittedAt || new Date().toISOString(), source: d.source || '',
  };

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      const r = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
      if (!r.ok) throw new Error('Webhook ' + r.status);
    } catch (e) {
      console.error(e);
      return res.status(502).json({ error: 'Transfert impossible' });
    }
  } else {
    console.log('Nouvelle candidature', lead);
  }
  return res.status(200).json({ ok: true });
}
