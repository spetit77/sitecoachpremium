// Déclenchée automatiquement par Netlify à chaque candidature validée (formulaire « candidature »).
// Envoie la candidature par email via Resend (https://resend.com).
// Variables d'environnement Netlify (portée Functions) :
//   RESEND_API_KEY  clé API Resend (obligatoire)
//   LEAD_EMAIL      adresse de réception (par défaut sp.coach.training@gmail.com)
//   LEAD_FROM       expéditeur (par défaut l'adresse de test Resend, qui n'écrit qu'au titulaire du compte Resend)
const RECIPIENT = process.env.LEAD_EMAIL || 'sp.coach.training@gmail.com';
const FROM = process.env.LEAD_FROM || 'Steven Coaching <onboarding@resend.dev>';

const LABELS = {
  firstName: 'Prénom', lastName: 'Nom', phone: 'Téléphone', email: 'Email', instagram: 'Instagram',
  objectif: 'Objectif principal', dureeBlocage: 'Bloqué depuis', obstacle: 'Principal frein',
  pretInvestir: 'Prêt à investir', timing: 'Démarrage souhaité',
  age: 'Âge', taille: 'Taille (cm)', poids: 'Poids (kg)', situationPro: 'Situation professionnelle',
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

exports.handler = async event => {
  const { payload } = JSON.parse(event.body || '{}');
  if (!payload || payload.form_name !== 'candidature') return { statusCode: 200, body: 'ignoré' };
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY absente : email non envoyé. La candidature reste dans Netlify > Forms.');
    return { statusCode: 200, body: 'pas de clé' };
  }

  const d = payload.data || {};
  const rows = Object.entries(LABELS).filter(([k]) => d[k]).map(([k, label]) => [label, String(d[k])]);
  const name = `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'sans nom';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 16px">Nouvelle candidature : ${esc(name)}</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows.map(([l, v]) => `<tr><td style="padding:8px 12px;border:1px solid #ddd;background:#f6f6f6;font-weight:bold;white-space:nowrap">${esc(l)}</td><td style="padding:8px 12px;border:1px solid #ddd">${esc(v)}</td></tr>`).join('')}
      </table>
      <p style="color:#777;font-size:12px;margin-top:16px">Reçue le ${esc(new Date(payload.created_at || Date.now()).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }))} via le site Steven Coaching. Réponds directement à cet email pour écrire au candidat.</p>
    </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [RECIPIENT],
      reply_to: d.email || undefined,
      subject: `Nouvelle candidature : ${name}`,
      html,
      text: rows.map(([l, v]) => `${l} : ${v}`).join('\n'),
    }),
  });
  console.log('Resend', res.status, await res.text());
  // Un échec d'email ne doit pas bloquer l'enregistrement : la candidature reste visible dans Netlify > Forms.
  return { statusCode: 200, body: 'ok' };
};
