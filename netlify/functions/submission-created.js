// Déclenchée automatiquement par Netlify à chaque candidature validée (formulaire « candidature »).
// Transfère la candidature par email via FormSubmit (https://formsubmit.co).
// Au tout premier envoi, FormSubmit écrit à l'adresse de réception pour faire activer le formulaire.
const RECIPIENT = process.env.LEAD_EMAIL || 'sp.coach.training@gmail.com';
const SITE_URL = process.env.URL || 'https://spcoaching.netlify.app';

const LABELS = {
  firstName: 'Prénom', lastName: 'Nom', phone: 'Téléphone', email: 'Email', instagram: 'Instagram',
  objectif: 'Objectif principal', dureeBlocage: 'Bloqué depuis', obstacle: 'Principal frein',
  pretInvestir: 'Prêt à investir', timing: 'Démarrage souhaité',
  age: 'Âge', taille: 'Taille (cm)', poids: 'Poids (kg)', situationPro: 'Situation professionnelle',
};

exports.handler = async event => {
  const { payload } = JSON.parse(event.body || '{}');
  if (!payload || payload.form_name !== 'candidature') return { statusCode: 200, body: 'ignoré' };

  const d = payload.data || {};
  const fields = {};
  for (const [key, label] of Object.entries(LABELS)) if (d[key]) fields[label] = String(d[key]);

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(RECIPIENT)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: SITE_URL, Referer: SITE_URL + '/' },
    body: JSON.stringify({
      _subject: `Nouvelle candidature : ${d.firstName || ''} ${d.lastName || ''}`.trim(),
      _template: 'table',
      _captcha: 'false',
      _replyto: d.email || undefined,
      ...fields,
    }),
  });
  const text = await res.text();
  console.log('FormSubmit', res.status, text);
  // Un échec d'email ne doit pas bloquer l'enregistrement : la candidature reste visible dans Netlify > Forms.
  return { statusCode: 200, body: 'ok' };
};
