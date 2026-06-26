// api/rss.js — Fonction Vercel serverless
// Récupère les flux RSS côté serveur → pas de problème CORS

const FLUX = {
  sante: [
    { url: 'https://www.has-sante.fr/feed/Rss2.jsp?id=p_3081656',  src: 'HAS — Actualités' },
    { url: 'https://www.santepubliquefrance.fr/rss/actualites',     src: 'Santé Publique France' },
    { url: 'https://ansm.sante.fr/rss/actualites',                  src: 'ANSM' },
    { url: 'https://www.inserm.fr/rss/',                            src: 'INSERM' },
    { url: 'https://www.anses.fr/fr/rss.xml',                       src: 'ANSES' },
    { url: 'https://agriculture.gouv.fr/rss.xml',                   src: 'Min. Agriculture' },
    { url: 'https://www.france-assos-sante.org/feed',               src: 'France Assos Santé' },
    { url: 'https://www.lemonde.fr/sante/rss_full.xml',             src: 'Le Monde Santé' },
  ],
  social: [
    { url: 'https://www.service-public.fr/rss/actualites.xml',      src: 'Service-Public.fr' },
    { url: 'https://www.vie-publique.fr/rss/actualites.xml',        src: 'Vie Publique' },
    { url: 'https://en3s.fr/feed',                                  src: 'EN3S' },
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
    { url: 'https://www.fondation-abbe-pierre.fr/rss',              src: 'Fondation Abbé Pierre' },
  ],
  soins: [
    { url: 'https://www.irdes.fr/rss.xml',                          src: 'IRDES' },
    { url: 'https://www.has-sante.fr/feed/Rss2.jsp?id=p_3081452',  src: 'HAS — Recommandations' },
    { url: 'https://www.sciencesetavenir.fr/rss.xml',               src: 'Sciences et Avenir' },
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
  const atomM = str.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
  if (atomM) return atomM[1];
  const rssM = str.match(/<link[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/link>/i);
  return rssM ? (rssM[1] || rssM[2] || '').trim() : '';
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function cleanDesc(str) {
  if (!str) return '';
  return str
    // 1. Décoder les entités HTML EN PREMIER
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    // 2. Supprimer TOUTES les balises HTML ensuite
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
    return parseXML(xml).map(item => ({
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
