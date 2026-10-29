export const EXPERIENCES=['breathing','sounds','journal','focus','guide'];
const ARTICLE_KEYS=['slug','title','description','category','lead','sections','closing','sourceIds','relatedExperience'];
const textFields=article=>[article.title,article.description,article.category,article.lead,article.closing,...(Array.isArray(article.sections)?article.sections.flatMap(section=>[section?.heading,...(Array.isArray(section?.paragraphs)?section.paragraphs:[])]):[])];
export function countWords(text){return (String(text).match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}’'-]*/gu)||[]).length;}
export function parseJsonAnswer(text){
  if(typeof text!=='string')throw new Error('A resposta do router não contém texto.');
  const cleaned=text.trim().replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i,'$1');
  try{return JSON.parse(cleaned);}catch{throw new Error('O modelo não devolveu JSON válido. Nada foi publicado.');}
}
export function validateArticle(article,{allowedSourceIds=[],recentTitles=[]}={}){
  const issues=[];
  if(!article||typeof article!=='object'||Array.isArray(article))return ['Artigo deve ser um objeto.'];
  if(Object.keys(article).sort().join('|')!==[...ARTICLE_KEYS].sort().join('|'))issues.push('O artigo precisa conter exatamente as chaves do schema.');
  for(const key of ['slug','title','description','category','lead','closing'])if(typeof article[key]!=='string')issues.push(`Campo ${key} precisa ser texto.`);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug||'')||(article.slug||'').length>90)issues.push('Slug inválido.');
  if(typeof article.title==='string'&&(article.title.length<15||article.title.length>90))issues.push('Título deve ter entre 15 e 90 caracteres.');
  if(typeof article.description==='string'&&(article.description.length<90||article.description.length>180))issues.push('Descrição deve ter entre 90 e 180 caracteres.');
  if(!EXPERIENCES.includes(article.relatedExperience))issues.push('Experiência relacionada inválida.');
  if(!Array.isArray(article.sections)||article.sections.length<3||article.sections.length>5)issues.push('Use entre três e cinco seções.');
  for(const section of Array.isArray(article.sections)?article.sections:[]){
    if(!section||typeof section.heading!=='string'||section.heading.length<5||Object.keys(section).sort().join('|')!=='heading|paragraphs')issues.push('Seção fora do schema.');
    if(!Array.isArray(section?.paragraphs)||section.paragraphs.length<1||section.paragraphs.length>3||section.paragraphs.some(p=>typeof p!=='string'||p.length<40||p.length>1800))issues.push('Seções precisam de um a três parágrafos desenvolvidos.');
  }
  if(!Array.isArray(article.sourceIds)||article.sourceIds.some(id=>typeof id!=='string'||!allowedSourceIds.includes(id)))issues.push('Há uma referência ausente ou não autorizada.');
  const fields=textFields(article);
  if(fields.some(text=>typeof text!=='string'||text.length>5000))issues.push('Conteúdo textual inválido ou excessivo.');
  const full=fields.filter(x=>typeof x==='string').join(' ');
  if(/[<>]|https?:\/\/|```|\[[^\]]+\]\(/i.test(full))issues.push('Use texto puro; HTML, links e Markdown não são aceitos nos campos.');
  const normalized=full.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase();
  if(/cura (?:a |sua |da |de )?(?:ansiedade|insonia|depressao)|resultado garantido|garante (?:o sono|dormir)|cientificamente comprovado|como (?:uma? )?(?:ia|inteligencia artificial)|ignore (?:as |todas )?instrucoes/i.test(normalized))issues.push('Há uma promessa indevida, instrução estranha ou linguagem fora da proposta editorial.');
  if((/\d+\s*%|estudos (?:mostram|comprovam)|pesquisas (?:mostram|comprovam)|segundo (?:cientistas|pesquisadores)/i.test(normalized))&&!article.sourceIds?.length)issues.push('Afirmação factual exige evidência cadastrada.');
  const body=[article.lead,...(Array.isArray(article.sections)?article.sections.flatMap(s=>Array.isArray(s?.paragraphs)?s.paragraphs:[]):[]),article.closing].filter(x=>typeof x==='string').join(' ');
  const words=countWords(body);if(words<450||words>750)issues.push(`Corpo tem ${words} palavras; esperado entre 450 e 750.`);
  const simplify=text=>text.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9 ]/g,'').trim();
  if(typeof article.title==='string'&&recentTitles.some(title=>simplify(title)===simplify(article.title)))issues.push('O título já foi usado.');
  return [...new Set(issues)];
}
export function validateReview(review){return Boolean(review&&Object.keys(review).sort().join('|')==='approved|issues|strengths'&&typeof review.approved==='boolean'&&Array.isArray(review.issues)&&Array.isArray(review.strengths)&&review.issues.every(x=>typeof x==='string')&&review.strengths.every(x=>typeof x==='string')&&(!review.approved||review.issues.length===0));}
export function escapeHtml(text){return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');}
export function renderArticle(article,sources){
  const escape=escapeHtml;
  const related={breathing:['/#experiencias','Encontrar uma pausa'],sounds:['/#sons','Escolher uma paisagem sonora'],journal:['/#rituais','Abrir espaço para escrever'],focus:['/#rituais','Encontrar meu foco'],guide:['/guia/','Ler o guia gratuito']}[article.relatedExperience];
  const references=article.sourceIds.map(id=>sources.find(source=>source.id===id)).filter(Boolean);
  return `<p class="article-lead">${escape(article.lead)}</p>`+article.sections.map(section=>`<h2>${escape(section.heading)}</h2>`+section.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')).join('')+`<p>${escape(article.closing)}</p><div class="article-callout"><a class="button primary" href="${related[0]}">${related[1]}</a></div>`+(references.length?`<div class="article-source"><h2>Referências</h2><ul>${references.map(source=>`<li><a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title)}</a></li>`).join('')}</ul></div>`:'');
}
