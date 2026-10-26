// Build-time mirror: converts one of our own freshly prerendered static pages
// into a plain-text markdown copy (index.md next to index.html). Input is the
// HTML string the prerender pipeline just produced, BEFORE any analytics,
// consent or reading-edition scripts are injected, so the output is script-free
// by construction. Nothing is fetched and no text is invented: the markdown is
// a lossy-but-faithful re-serialization of the same page (styles, SVG motifs,
// buttons and tracking markup are dropped; headings, paragraphs, lists, tables,
// links and source attribution are kept).

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·',
  rsquo: '\u2019', lsquo: '\u2018', ldquo: '\u201C', rdquo: '\u201D', hellip: '\u2026',
  ndash: '\u2013', mdash: '\u2014', times: '\u00D7', deg: '\u00B0',
};
export function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => ENTITIES[name] ?? m);
}

// Sections marked data-placeholder carry demo copy (landing testimonials are
// explicitly placeholder text). They never belong in a citable text mirror.
export function stripPlaceholderSections(html: string): string {
  return html.replace(/<section\b[^>]*aria-label="What students say"[\s\S]*?<\/section>/g, ' ');
}

const SKIP_TAGS = new Set(['script', 'style', 'svg', 'picture', 'img', 'source', 'button', 'noscript', 'iframe', 'nav']);
const CONTAINERS = new Set(['html', 'body', 'main', 'article', 'figure', 'blockquote', 'footer', 'header', 'caption']);

interface Token { tag?: string; closing?: boolean; selfClosing?: boolean; attrs?: Record<string, string>; text?: string }

const VOID_TAGS = new Set(['br', 'img', 'source', 'input', 'meta', 'link', 'hr', 'wbr']);

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  const re = /<!--[\s\S]*?-->|<![^>]*>|<\/?[a-zA-Z][^>]*>|[^<]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = m[0];
    if (raw.startsWith('<!')) continue; // doctype, SSR markers and comments
    if (raw[0] === '<') {
      const closing = raw.startsWith('</');
      const selfClosing = raw.endsWith('/>');
      const body = raw.slice(closing ? 2 : 1, selfClosing ? -2 : -1);
      const space = body.search(/[\s]/);
      const tag = (space === -1 ? body : body.slice(0, space)).toLowerCase();
      const attrs: Record<string, string> = {};
      if (space !== -1) {
        const attrRe = /([a-zA-Z-]+)(?:="([^"]*)")?/g;
        let a: RegExpExecArray | null;
        while ((a = attrRe.exec(body.slice(space)))) attrs[a[1].toLowerCase()] = a[2] ?? '';
      }
      tokens.push({ tag, closing, selfClosing: selfClosing || VOID_TAGS.has(tag), attrs });
    } else {
      tokens.push({ text: raw });
    }
  }
  return tokens;
}

export function htmlToMarkdown(html: string, pageUrl?: string): string {
  // In-page fragment hrefs (#unit-1) have no target in a flat .md file, so
  // they resolve against the canonical HTML page that carries the anchors.
  const resolveHref = (href: string): string =>
    href.startsWith('#') && pageUrl ? pageUrl + href : href;
  const lines: string[] = [];
  let para: string[] = []; // current inline buffer
  let skipDepth = 0;
  let inHead = false;
  let listStack: ('ul' | 'ol')[] = [];
  let olCounter: number[] = [];
  let inTable = false;
  // Tables are collected as a cell model first, then expanded to a rectangle:
  // a rowspan/colspan cell's text is repeated into every grid slot it covers,
  // so a value can never slide under the wrong header in the flat markdown.
  let tableRows: { cells: { text: string; colspan: number; rowspan: number }[]; header: boolean }[] = [];
  let currentRow: { text: string; colspan: number; rowspan: number }[] | null = null;
  let cellBuf: string[] | null = null;
  let cellColspan = 1;
  let cellRowspan = 1;
  let inThead = false;
  let inSummary = false;
  let summaryBuf: string[] = [];
  let divSkip = 0; // inside a .scards mobile-duplicate subtree

  const flushPara = (blank = true) => {
    const raw = para.join('');
    // List items carry their indentation before the bullet; keep it.
    const indent = listStack.length > 0 ? (raw.match(/^\s*/)?.[0] ?? '') : '';
    const text = raw.replace(/\s+/g, ' ').trim();
    para = [];
    if (text) { lines.push(indent + text); if (blank) lines.push(''); }
  };
  const pushLine = (s: string) => { flushPara(); lines.push(s, ''); };
  const pushRow = (s: string) => { flushPara(false); lines.push(s); };

  for (const t of tokenize(html)) {
    if (t.text !== undefined) {
      if (skipDepth > 0 || inHead) continue;
      if (cellBuf) { cellBuf.push(decodeEntities(t.text)); continue; }
      if (inSummary) { summaryBuf.push(decodeEntities(t.text)); continue; }
      para.push(decodeEntities(t.text));
      continue;
    }
    const tag = t.tag!;
    const closing = !!t.closing;
    if (tag === 'head') { inHead = !closing; continue; }
    if (inHead) continue;
    if (SKIP_TAGS.has(tag)) { if (!t.selfClosing) skipDepth += closing ? -1 : 1; continue; }
    if (skipDepth > 0) continue;
    if (divSkip > 0) {
      if (tag === 'div') divSkip += closing ? -1 : 1;
      continue;
    }
    if (tag === 'div' && !closing && (t.attrs?.class ?? '').split(/\s+/).includes('scards')) { divSkip = 1; continue; }
    if (tag === 'section') { flushPara(); continue; }
    if (tag === 'div' && !closing) { flushPara(); continue; }

    if (tag === 'table') {
      if (!closing) { flushPara(); inTable = true; tableRows = []; }
      else {
        inTable = false;
        const grid: string[][] = [];
        tableRows.forEach((row, r) => {
          let c = 0;
          for (const cell of row.cells) {
            grid[r] = grid[r] ?? [];
            while (grid[r][c] !== undefined) c++;
            for (let dr = 0; dr < cell.rowspan; dr++) {
              grid[r + dr] = grid[r + dr] ?? [];
              for (let dc = 0; dc < cell.colspan; dc++) grid[r + dr][c + dc] = cell.text;
            }
            c += cell.colspan;
          }
        });
        const width = Math.max(0, ...grid.map((g) => g.length));
        grid.forEach((g, i) => {
          const cells = Array.from({ length: width }, (_, j) => g[j] ?? '');
          pushRow('| ' + cells.join(' | ') + ' |');
          if (i === 0 && tableRows[0]?.header) pushRow('| ' + cells.map(() => '---').join(' | ') + ' |');
        });
        lines.push('');
      }
      continue;
    }
    if (inTable) {
      if (tag === 'thead') { inThead = !closing; continue; }
      if (tag === 'tr') {
        if (!closing) { currentRow = []; }
        else if (currentRow) {
          if (currentRow.length > 0) tableRows.push({ cells: currentRow, header: inThead });
          currentRow = null;
        }
        continue;
      }
      if (tag === 'th' || tag === 'td') {
        if (!closing) {
          cellBuf = [];
          cellColspan = Math.max(1, parseInt(t.attrs?.colspan ?? '1', 10) || 1);
          cellRowspan = Math.max(1, parseInt(t.attrs?.rowspan ?? '1', 10) || 1);
        }
        else if (cellBuf !== null) {
          currentRow?.push({
            text: cellBuf.join('').replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim(),
            colspan: cellColspan,
            rowspan: cellRowspan,
          });
          cellBuf = null;
        }
        continue;
      }
      if (tag === 'a' && cellBuf) {
        if (!closing) cellBuf.push('\u0001A' + resolveHref(t.attrs?.href ?? '') + '\u0001');
        else cellBuf.push('\u0002');
        continue;
      }
      if (tag === 'br' && cellBuf) { cellBuf.push(' '); continue; }
      continue; // ignore other tags inside tables
    }
    if (tag === 'a') {
      if (!closing) {
        // Card-style link lists (hub, subject links) get one link per line.
        if (para.join('').endsWith('\u0002')) flushPara();
        para.push('\u0001A' + resolveHref(t.attrs?.href ?? '') + '\u0001');
      }
      else { para.push('\u0002'); }
      continue;
    }
    if (tag === 'br') { para.push(' '); continue; }
    if (/^h[1-6]$/.test(tag)) {
      if (!closing) { flushPara(); para.push('#'.repeat(Number(tag[1])) + ' '); }
      else flushPara();
      continue;
    }
    if (tag === 'p' || tag === 'figcaption') { flushPara(); continue; }
    if (tag === 'span' || tag === 'em' || tag === 'strong' || tag === 'b' || tag === 'i' || tag === 'mark' || tag === 'small' || tag === 'code' || tag === 'sub' || tag === 'sup') {
      // JSX strips whitespace-only text containing newlines, so text split
      // across sibling inline elements can glue together; keep a space.
      const last = para[para.length - 1];
      if (last && /[\w.).\u2019]$/.test(last)) para.push(' ');
      continue;
    }
    if (tag === 'ul' || tag === 'ol') {
      if (!closing) { flushPara(false); listStack.push(tag); if (tag === 'ol') olCounter.push(0); }
      else { listStack.pop(); if (tag === 'ol') olCounter.pop(); if (listStack.length === 0) { flushPara(false); lines.push(''); } }
      continue;
    }
    if (tag === 'li') {
      if (!closing) {
        flushPara(false);
        const depth = Math.max(0, listStack.length - 1);
        const bullet = listStack[listStack.length - 1] === 'ol' ? `${++olCounter[olCounter.length - 1]}.` : '-';
        para.push('  '.repeat(depth) + bullet + ' ');
      } else flushPara(false);
      continue;
    }
    if (tag === 'details') { if (closing) flushPara(); continue; }
    if (tag === 'summary') {
      if (!closing) { flushPara(); inSummary = true; summaryBuf = []; }
      else { inSummary = false; pushLine('**' + summaryBuf.join('').replace(/\s+/g, ' ').trim() + '**'); summaryBuf = []; }
      continue;
    }
    if (tag === 'footer') { if (!closing) { flushPara(); lines.push('---', ''); } else flushPara(); continue; }
    if (CONTAINERS.has(tag)) { continue; }
    // inline formatting tags (span, b, strong, em, i, mark, small, code, sub, sup): keep text only
  }
  flushPara();

  let out = lines.join('\n');
  // Resolve deferred anchors: \u0001Ahref\u0001 text \u0002 -> [text](href)
  out = out.replace(/\u0001A([^\u0001]*)\u0001([\s\S]*?)\u0002/g, (_, href, text) => {
    const label = text.replace(/\s+/g, ' ').trim();
    return label ? `[${label}](${href})` : '';
  });
  return out.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// Landing-specific mirror: the prerendered landing markup minus the demo
// testimonial section, converted like every other page.
export function landingToMarkdown(ssrMarkup: string, pageUrl?: string): string {
  return htmlToMarkdown('<main>' + stripPlaceholderSections(ssrMarkup) + '</main>', pageUrl);
}
