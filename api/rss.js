// api/rss.js — Fonction Vercel serverless
// Récupère les flux RSS côté serveur → pas de problème CORS

const FLUX = {
  sante: [
    { url: 'https://www.has-sante.fr/feed/Rss2.jsp?id=p_3081656',  src: 'HAS — Actualités' },
    { url: 'https://www.santepubliquefrance.fr/rss/actualites',     src: 'Santé Publique France' },
    { url: 'https://ansm.sante.fr/rss/actualites',                  src: 'ANSM' },
    { url: 'https://www.inserm.fr/rss/',                            src: 'INSERM' },
    { url: 'https://www.anses.fr/fr/rss.xml',                       src: 'ANSES' },
    { url: 'https://esante.gouv.fr/rss.xml',                        src: 'Numérique en santé' },
    { url: 'https://agriculture.gouv.fr/rss.xml',                   src: 'Min. Agriculture' },
    { url: 'https://www.agence-biomedecine.fr/rss.xml',             src: 'Agence Biomédecine' },
    { url: 'https://www.cns.sante.fr/rss.xml',                      src: 'Conférence nationale de santé' },
    { url: 'https://www.france-assos-sante.org/feed',               src: 'France Assos Santé' },
    { url: 'https://www.lemonde.fr/sante/rss_full.xml',             src: 'Le Monde Santé' },
  ],
  social: [
    { url: 'https://www.service-public.fr/rss/actualites.xml',      src: 'Service-Public.fr' },
    { url: 'https://www.vie-publique.fr/rss/actualites.xml',        src: 'Vie Publique' },
    { url: 'https://en3s.fr/feed',                                  src: 'EN3S' },
    { url: 'https://www.defenseurdesdroits.fr/rss.xml',             src: 'Défenseur des droits' },
    { url: 'https://www.fondation-abbe-pierre.fr/rss',              src: 'Fondation Abbé Pierre' },
    { url: 'https://www.lemonde.fr/logement/rss_full.xml',          src: 'Le Monde Logement' },
    { url: 'https://www.documentation-sociale.org/feed',            src: 'Documentation sociale' },
    { url: 'https://www.alternatives-economiques.fr/rss.xml',       src: 'Alternatives Économiques' },
  ],
  medico: [
    { url: 'https://www.cnsa.fr/rss.xml',                           src: 'CNSA' },
    { url: 'https://www.agefiph.fr/rss.xml',                        src: 'Agefiph' },
    { url: 'https://www.handirect.fr/feed/',                        src: 'Handirect' },
    { url: 'https://www.has-sante.fr/feed/Rss2.jsp?id=p_3081452',  src: 'HAS — Recommandations' },
    { url: 'https://www.defenseurdesdroits.fr/rss.xml',             src: 'Défenseur des droits' },
    { url: 'https://www.uniopss.asso.fr/rss.xml',                   src: 'UNIOPSS' },
    { url: 'https://www.fondation-abbe-pierre.fr/rss',              src: 'Fondation Abbé Pierre' },
  ],
  soins: [
    { url: 'https://www.irdes.fr/rss.xml',                          src: 'IRDES' },
    { url: 'https://www.has-sante.fr/feed/Rss2.jsp?id=p_3081452',  src: 'HAS — Recommandations' },
    { url: 'https://www.agence-biomedecine.fr/rss.xml',             src: 'Agence Biomédecine' },
    { url: 'https://www.cns.sante.fr/rss.xml',                      src: 'Conférence nationale de santé' },
    { url: 'https://theconversation.com/fr/articles.atom',          src: 'The Conversation' },
    { url: 'https://www.gouvernement.fr/rss/actualites.xml',        src: 'Gouvernement.fr' },
    { url: 'https://www.lemonde.fr/sante/rss_full.xml',             src: 'Le Monde Santé' },
    { url: 'https://www.francetvinfo.fr/sante.rss',                 src: 'Franceinfo Santé' },
  ],
  stms: [
    { url: 'https://www.insee.fr/fr/rss/publications.xml',          src: 'INSEE' },
    { url: 'https://www.inegalites.fr/spip.php?page=backend',       src: 'Obs. des inégalités' },
    { url: 'https://www.observationsociete.fr/feed',                src: 'Centre Obs. Société' },
    { url: 'https://www.credoc.fr/feed',                            src: 'CREDOC' },
    { url: 'https://www.radiofrance.fr/franceculture/rss',          src: 'France Culture' },
    { url: 'https://www.alternatives-economiques.fr/rss.xml',       src: 'Alternatives Économiques' },
  ],
  sp3s: [
    { url: 'https://travail-emploi.gouv.fr/rss/actualites.xml',     src: 'Min. Travail' },
    { url: 'https://www.uniopss.asso.fr/rss.xml',                   src: 'UNIOPSS' },
    { url: 'https://www.senat.fr/rss/presse.xml',                   src: 'Sénat' },
    { url: 'https://www.legifrance.gouv.fr/rss/jorf.xml',           src: 'Légifrance — JO' },
    { url: 'https://www.gouvernement.fr/rss/actualites.xml',        src: 'Gouvernement.fr' },
    { url: 'https://www.documentation-sociale.org/feed',            src: 'Documentation sociale' },
    { url: 'https://www.ove-national.education.fr/feed',            src: 'OVE — Vie étudiante' },
  ],
  agreg: [
    { url: 'https://www.ehesp.fr/feed',                             src: 'EHESP' },
    { url: 'https://en3s.fr/feed',                                  src: 'EN3S' },
    { url: 'https://www.irdes.fr/rss.xml',                          src: 'IRDES' },
    { url: 'https://www.insee.fr/fr/rss/publications.xml',          src: 'INSEE' },
    { url: 'https://www.ofdt.fr/rss.xml',                           src: 'OFDT' },
    { url: 'https://www.radiofrance.fr/franceinter/rss',            src: 'France Inter' },
    { url: 'https://www.novethic.fr/feed',                          src: 'Novethic' },
    { url: 'https://www.has-sante.fr/feed/Rss2.jsp?id=p_3081452',  src: 'HAS — Recommandations' },
  ],
};

const NIVEAUX = {
  sante:  ['1re ST2S', 'Tle ST2S'],
  social: ['Tle ST2S', 'BTS SP3S'],
  medico: ['BTS SP3S', 'DECESF'],
  soins:  ['Tle ST2S', 'BTS SP3S'],
  stms:   ['1re ST2S', 'CAPET SMS'],
  sp3s:   ['BTS SP3S', 'DECESF'],
  agreg:  ['CAPET SMS', 'Agrég STMS'],
};

// ─── Filtre de pertinence thématique ──────────────────────────────────────
// Garde uniquement les articles en lien avec la santé ou la politique publique/sociale.
const MOTS_CLES = [
  // Santé
  'santé','maladie','médical','médecin','médecine','soin','soins','hôpital','hopital',
  'clinique','infirmier','infirmière','pharmacie','médicament','vaccin','vaccination',
  'prévention','épidémie','pandémie','virus','cancer','diabète','obésité','nutrition',
  'handicap','dépendance','autonomie','ehpad','alzheimer','démence','psychiatrie',
  'psychologie','burnout','addiction','alcool','tabac','drogue','substance',
  'grossesse','maternité','natalité','mortalité','espérance de vie','aidant',
  'réadaptation','rééducation','soignant','aide-soignant','urgences','chu','chru',
  'médecine de ville','désert médical','télémédecine','e-santé','numérique en santé',
  // Protection sociale & politique sociale
  'social','protection sociale','assurance maladie','sécurité sociale','retraite',
  'chômage','allocation','rsa','caf','aide sociale','aah','apa','pch','aide à domicile',
  'pauvreté','précarité','inégalité','logement','sans-abri','sdf','travail','emploi',
  'famille','enfance','jeunesse','vieillissement','personnes âgées','senior','sénior',
  'insertion','solidarité','accès aux droits','minima sociaux','revenu','salaire',
  'travailleurs pauvres','fracture sociale','exclusion','vulnérabilité','cohésion',
  'etablissement social','action sociale','travailleur social',
  // Politique publique & institutionnel
  'politique publique','réforme','loi','décret','ordonnance','financement','budget',
  'service public','gouvernement','ministère','parlement','sénat','assemblée nationale',
  'haut conseil','rapport','recommandation','has ','hcsp','drees','irdes','inserm',
  'cnsa','anses','ansm','cnam','ars','cpam','mutuelle','complémentaire santé',
  // Termes ST2S / SP3S / STMS
  'st2s','sp3s','stms','médico-social','bts','capet','agrégation',
  'éducation à la santé','promotion de la santé','déterminants','inégalités de santé',
  'système de santé','offre de soins','parcours de soins','territoire de santé',
];

function estPertinent(titre, desc) {
  const texte = (titre + ' ' + (desc || '')).toLowerCase();
  return MOTS_CLES.some(mot => texte.includes(mot));
}

// ─── Parsing XML RSS/Atom minimal ─────────────────────────────────────────
function parseXML(xml) {
  const items = [];
  const blocRegex = /<(item|entry)[^>]*>([\s\S]*?)<\/\1>/gi;
  let bloc;
  while ((bloc = blocRegex.exec(xml)) !== null && items.length < 5) {
    const c = bloc[2];
    const titre   = extrait(c, 'title');
    const lien    = extraitLien(c);
    const desc    = extrait(c, 'description') || extrait(c, 'summary') || extrait(c, 'content:encoded') || extrait(c, 'content');
    const pubDate = extrait(c, 'pubDate') || extrait(c, 'published') || extrait(c, 'updated') || extrait(c, 'dc:date');
    if (titre && lien) {
      items.push({ titre: decodeHTMLEntities(stripTags(titre)).trim(), lien, desc: cleanDesc(desc), date: pubDate });
    }
  }
  return items;
}

function extrait(str, tag) {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${tag}>`, 'i');
  const m = str.match(re);
  return m ? (m[1] || m[2] || '').trim() : '';
}

function extraitLien(str) {
  // Atom : <link href="..." /> ou <link rel="alternate" href="..." />
  const atomHref = str.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
  if (atomHref) return safeUrl(atomHref[1]);
  // Atom sans guillemets (rare)
  const atomBare = str.match(/<link[^>]+href=([^\s>]+)[^>]*\/?>/i);
  if (atomBare) return safeUrl(atomBare[1]);
  // RSS 2.0 : <link>https://...</link> avec ou sans CDATA
  const rssM = str.match(/<link[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/link>/i);
  return rssM ? safeUrl((rssM[1] || rssM[2] || '').trim()) : '';
}

function safeUrl(url) {
  if (!url) return '';
  const u = url.trim();
  return /^https?:\/\//i.test(u) ? u : '';
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function cleanDesc(str) {
  if (!str) return '';
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 320);
}

function decodeHTMLEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function parseDate(str) {
  if (!str) return new Date().toISOString();
  try {
    const d = new Date(str);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

async function fetchFlux({ url, src }, themeId) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 7000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'VeilleInfoBot/1.0 (educational use)', Accept: 'application/rss+xml, application/atom+xml, text/xml, */*' },
    });
    clearTimeout(timer);
    if (!res.ok) return [];
    const xml = await res.text();
    return parseXML(xml)
      .filter(item => estPertinent(item.titre, item.desc))
      .map(item => ({
        themeId,
        titre:   item.titre,
        source:  src,
        url:     item.lien,
        resume:  item.desc || '',
        date:    parseDate(item.date),
        niveaux: NIVEAUX[themeId],
      }));
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const themesParam = req.query.themes || 'sante,social,medico,soins,stms,sp3s,agreg';
  const themes = themesParam.split(',').filter(t => FLUX[t]);

  if (!themes.length) {
    res.status(400).json({ error: 'Aucun thème valide fourni.' });
    return;
  }

  const jobs = themes.flatMap(id => FLUX[id].map(f => fetchFlux(f, id)));
  const results = await Promise.allSettled(jobs);

  let articles = [];
  results.forEach(r => { if (r.status === 'fulfilled') articles.push(...r.value); });

  const seen = new Set();
  articles = articles.filter(a => {
    const k = a.titre.toLowerCase().slice(0, 50);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({
    generatedAt: new Date().toISOString(),
    count: articles.length,
    articles,
  });
}
