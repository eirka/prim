import { emoticonSrv, tokenMap } from '@/composables/useEmoticons';

// URL regex from https://gist.github.com/dperini/729294
const urlRegex =
  /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/gi;
const emailRegex = /(\S{3,})@(\S*[^\s.;,(){}<>"\u201d\u2019])/i;
const youtubeRegex =
  /(https?)?:\/\/(www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/i;
const imageRegex =
  /(?:https?:\/\/|(?:www\.)|[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019](?:\/[^/#?]+)+\.(?:jpe?g|gif|png)/i;
const newlineRegex = /\n/g;
const boldRegex = /\*\*(.*?)\*\*/g;
const italicRegex = /\*(.*?)\*/g;
const emoticonRegex = /:([\w+-]+):/g;

// Collect all text nodes into a snapshot array before any modifications.
// This avoids the pitfall of modifying the DOM while iterating with TreeWalker,
// which would cause nodes to be skipped or visited twice.
function collectTextNodes(root: Node): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    nodes.push(node);
  }
  return nodes;
}

// Split a single text node at regex matches, replacing each match with DOM
// nodes returned by replacer(match). If replacer returns null, the matched
// text is kept as a plain text node (no-op).
function processTextNode(
  textNode: Text,
  regex: RegExp,
  replacer: (match: RegExpExecArray) => Node | null
): void {
  const text = textNode.textContent || '';
  // Fresh regex instance to avoid lastIndex statefulness
  const re = new RegExp(regex.source, regex.flags);
  const frag = document.createDocumentFragment();
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let hasMatch = false;

  while ((match = re.exec(text)) !== null) {
    // Guard against zero-width matches to prevent infinite loops
    if (match[0].length === 0) {
      re.lastIndex++;
      continue;
    }
    hasMatch = true;
    // Text before the match
    if (match.index > lastIndex) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    // Replacement node(s)
    const replacement = replacer(match);
    if (replacement !== null) {
      frag.appendChild(replacement);
    } else {
      // No-op: keep original match text
      frag.appendChild(document.createTextNode(match[0]));
    }
    lastIndex = re.lastIndex;
  }

  if (!hasMatch) return;

  // Remaining text after last match
  if (lastIndex < text.length) {
    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  textNode.parentNode?.replaceChild(frag, textNode);
}

// Run a regex+replacer over all text nodes under root
function processAll(
  root: Node,
  regex: RegExp,
  replacer: (match: RegExpExecArray) => Node | null
): void {
  const textNodes = collectTextNodes(root);
  for (const node of textNodes) {
    processTextNode(node, regex, replacer);
  }
}

// --- Safety helpers ---

const safeProtocols = new Set(['https:', 'http:', 'ftp:']);

function isSafeUrl(url: string): boolean {
  try {
    return safeProtocols.has(new URL(url).protocol);
  } catch {
    return false;
  }
}

// --- Element factories ---

function makeLink(url: string): HTMLAnchorElement {
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.textContent = url;
  return a;
}

function makeImage(url: string): HTMLAnchorElement {
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  const img = document.createElement('img');
  img.setAttribute('src', url);
  img.className = 'external_image';
  a.appendChild(img);
  return a;
}

function makeYoutube(videoId: string): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'auto-resizable-iframe';
  const inner = document.createElement('div');
  const iframe = document.createElement('iframe');
  // youtube-nocookie.com avoids tracking cookies. The sandbox attribute restricts
  // the iframe to scripts and same-origin access, blocking top-level navigation
  // and other potentially dangerous capabilities.
  iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}`);
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
  iframe.setAttribute('allow', 'fullscreen; picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');
  inner.appendChild(iframe);
  wrapper.appendChild(inner);
  return wrapper;
}

function makeEmoticon(token: { text: string; image: string }): HTMLImageElement {
  const img = document.createElement('img');
  img.className = 'emoticon';
  img.setAttribute('title', `:${token.text}:`);
  img.setAttribute('src', emoticonSrv + token.image);
  return img;
}

// --- Main entry point ---

// Formats raw comment text into rich HTML through a multi-pass pipeline.
// Pass order matters: bold (**) must run before italic (*) so that ** pairs
// are consumed first, preventing "**bold**" from being parsed as nested italics.
// The initial textContent assignment auto-escapes all HTML entities, which
// prevents XSS from user-submitted comment text.
export function buildCommentDom(container: HTMLElement, text: string): void {
  container.textContent = text.replace(/(\n){3,}/g, '\n\n').trim();

  // Newline pass: \n → <br>
  processAll(container, newlineRegex, () => document.createElement('br'));

  // Bold pass: **text** → <strong>text</strong>
  processAll(container, boldRegex, (match) => {
    const el = document.createElement('strong');
    el.textContent = match[1];
    return el;
  });

  // Italic pass: *text* → <em>text</em>
  // Safe after bold because ** pairs have been consumed
  processAll(container, italicRegex, (match) => {
    if (!match[1]) return null;
    const el = document.createElement('em');
    el.textContent = match[1];
    return el;
  });

  // URL pass: dispatch to email/youtube/image/link factories
  processAll(container, urlRegex, (match) => {
    const url = match[0];

    if (emailRegex.test(url)) {
      const emailMatch = new RegExp(emailRegex.source, emailRegex.flags).exec(url);
      if (emailMatch) {
        return document.createTextNode(`${emailMatch[1]} at ${emailMatch[2]}`);
      }
    }

    // Reject URLs with unsafe protocols
    if (!isSafeUrl(url)) return null;

    const ytMatch = new RegExp(youtubeRegex.source, youtubeRegex.flags).exec(url);
    if (ytMatch) {
      return makeYoutube(ytMatch[3]);
    }

    if (imageRegex.test(url)) {
      return makeImage(url);
    }

    return makeLink(url);
  });

  // Emoticon pass: :name: → <img> if in whitelist, else no-op
  processAll(container, emoticonRegex, (match) => {
    const token = tokenMap[match[1]];
    if (token) {
      return makeEmoticon(token);
    }
    return null;
  });
}
