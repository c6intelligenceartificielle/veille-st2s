// api/rss.js — Fonction Vercel serverless
// Récupère les flux RSS côté serveur → pas de problème CORS

const FLUX = {
  sante: [
    { url: 'https://www.has-sante.fr/feed/Rss2.jsp?id=p_3081656',  src: 'HAS — Actualités' },
    { url: 'https://www.has-sante.fr/feed/Rss2.jsp?id=p_3081452',  src: 'HAS — Recommandations' },
    { url: 'https://www.santepubliquefrance.fr/rss/actualites',     src: 'Santé Publique France' },
    { url: 'https://ansm.sante.fr/rss/actualites',                  src: 'ANSM' },
    { url: 'https://www.lemonde.fr/sante/rss_full.xml',             src: 'Le Monde Santé' },
    { url: 'https://www.francetvinfo.fr/sante.rss',                 src: 'Franceinfo Santé' },
    { url: 'https://www.radiofrance.fr/franceculture/rss',          src: 'France Culture' },
    { url: 'http://www.assemblee-nationale.fr/dyn/rss/communiques-de-presse.xml', src: 'Assemblée nationale' },
  ],
  social: [
    { url: 'https://www.ameli.fr/rss/actualites.xml',               src: 'Assurance Maladie' },
    { url: 'https://www.service-public.fr/rss/actualites.xml',      src: 'Service-Public.fr' },
    { url: 'https://www.lemonde.fr/societe/rss_full.xml',           src: 'Le Monde Société' },
    { url: 'https://www.la-croix.com/RSS/Debats',                   src: 'La Croix — Débats' },
    { url: 'https://www.radiofrance.fr/franceculture/rss',          src: 'France Culture' },
  ],
  politiques: [
    { url: 'https://www.vie-publique.fr/rss/actualites.xml',        src: 'Vie Publique' },
    { url: 'https://www.legifrance.gouv.fr/rss/jorf.xml',           src: 'Légifrance — JO' },
    { url: 'https://www.gouvernement.fr/rss/actualites.xml',        src: 'Gouvernement.fr' },
    { url: 'https://www.lemonde.fr/politique/rss_full.xml',         src: 'Le Monde Politique' },
    { url: 'https://www.liberation.fr/rss/',                        src: 'Libération' },
    { url: 'https://www.senat.fr/rss/presse.xml',                   src: 'Sénat' },
    { url: 'http://www.assemblee-nationale.fr/dyn/rss/communiques-de-presse.xml', src: 'Assemblée nationale' },
  ],
  societe: [
    { url: 'https://www.insee.fr/fr/rss/publications.xml',          src: 'INSEE' },
    { url: 'https://www.inegalites.fr/spip.php?page=backend',       src: 'Obs. des inégalités' },
    { url: 'https://www.lemonde.fr/societe/rss_full.xml',           src: 'Le Monde Société' },
    { url: 'https://www.francetvinfo.fr/societe.rss',               src: 'Franceinfo Société' },
    { url: 'https://www.liberation.fr/rss/categories/societe/',     src: 'Libération Société' },
    { url: 'https://www.ove-national.education.fr/feed',            src: 'OVE — Vie étudiante' },
  ],
  travail: [
    { url: 'https://travail-emploi.gouv.fr/rss/actualites.xml',     src: 'Min. Travail' },
    { url: 'https://www.ash.tm.fr/rss.php',                         src: 'ASH' },
    { url: 'https://www.lassembleesociale.fr/feed/',                src: "L'Assemblée Sociale" },
    { url: 'https://www.lemonde.fr/emploi/rss_full.xml',            src: 'Le Monde Emploi' },
    { url: 'https://www.la-croix.com/RSS/France',                   src: 'La Croix France' },
  ],
};

const NIVEAUX = {
  sante:     ['1re ST2S', 'Tle ST2S'],
  social:    ['Tle ST2S', 'BTS SP3S'],
  politiques:['BTS SP3S', 'CAPET SMS'],
  societe:   ['1re ST2S', 'CAPET SMS'],
  travail:   ['BTS SP3S', 'DECESF'],
};

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
  // Atom : <link href="…"/> ou <link rel="alternate" href="…"/>
  const atomM = str.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
  if (atomM) return atomM[1];
  // RSS : <link>url</link> — CORRECTION : regex littérale, \[ = crochet littéral
  const rssM = str.match(/<link[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/link>/i);
  return rssM ? (rssM[1] || rssM[2] || '').trim() : '';
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function cleanDesc(str) {
  if (!str) return '';
  return str
    // 1. Décoder les entités HTML EN PREMIER (sinon &lt;p&gt; → <p> après la suppression)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    // 2. Supprimer TOUTES les balises HTML (y compris celles décodées à l'étape 1)
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

// ─── Parsing de date robuste (évite RangeError sur dates mal formées) ───────
function parseDate(str) {
  if (!str) return new Date().toISOString();
  try {
    const d = new Date(str);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// ─── Fetch d'un flux avec timeout ─────────────────────────────────────────
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
    return parseXML(xml).map(item => ({
      themeId,
      titre:   item.titre,
      source:  src,
      url:     item.lien,
      resume:  item.desc || '',
      date:    parseDate(item.date),   // CORRECTION : parsing robuste
      niveaux: NIVEAUX[themeId],
    }));
  } catch {
    return [];
  }
}

// ─── Handler principal Vercel ──────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const themesParam = req.query.themes || 'sante,social,politiques,societe,travail';
  const themes = themesParam.split(',').filter(t => FLUX[t]);

  if (!themes.length) {
    res.status(400).json({ error: 'Aucun thème valide fourni.' });
    return;
  }

  const jobs = themes.flatMap(id => FLUX[id].map(f => fetchFlux(f, id)));
  const results = await Promise.allSettled(jobs);

  let articles = [];
  results.forEach(r => { if (r.status === 'fulfilled') articles.push(...r.value); });

  // Dédoublonnage par titre
  const seen = new Set();
  articles = articles.filter(a => {
    const k = a.titre.toLowerCase().slice(0, 50);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  // Tri antichronologique
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({
    generatedAt: new Date().toISOString(),
    count: articles.length,
    articles,
  });
}
