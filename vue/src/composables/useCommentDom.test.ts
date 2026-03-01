// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/config', () => ({
  default: {
    img_srv: 'https://img.test.com',
    api_srv: 'https://api.test.com',
    ib_id: 1,
    csrf_token: '',
  },
}));

const { buildCommentDom } = await import('./useCommentDom');

function makeContainer(text: string): HTMLDivElement {
  const div = document.createElement('div');
  buildCommentDom(div, text);
  return div;
}

describe('sanitization', () => {
  it('escapes HTML via textContent (no XSS)', () => {
    const container = makeContainer('<script>alert(1)</script>');
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('<script>');
  });

  it('converts newlines to <br> elements', () => {
    const container = makeContainer('a\nb');
    expect(container.querySelectorAll('br')).toHaveLength(1);
    expect(container.textContent).toBe('ab');
  });

  it('converts double newlines to two <br> elements', () => {
    const container = makeContainer('a\n\nb');
    expect(container.querySelectorAll('br')).toHaveLength(2);
  });

  it('collapses 3+ consecutive newlines to 2 <br> elements', () => {
    const container = makeContainer('a\n\n\n\nb');
    expect(container.querySelectorAll('br')).toHaveLength(2);
    expect(container.textContent).toBe('ab');
  });

  it('trims leading and trailing whitespace', () => {
    const container = makeContainer('  hello  ');
    expect(container.textContent).toBe('hello');
  });

  it('trims leading and trailing newlines', () => {
    const container = makeContainer('\nhello\n');
    expect(container.querySelectorAll('br')).toHaveLength(0);
    expect(container.textContent).toBe('hello');
  });
});

describe('bold pass', () => {
  it('wraps **text** in <strong>', () => {
    const container = makeContainer('**hello**');
    const strong = container.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong!.textContent).toBe('hello');
  });

  it('preserves surrounding text', () => {
    const container = makeContainer('before **bold** after');
    expect(container.textContent).toBe('before bold after');
    expect(container.querySelector('strong')!.textContent).toBe('bold');
  });

  it('handles multiple bold spans', () => {
    const container = makeContainer('**a** and **b**');
    const strongs = container.querySelectorAll('strong');
    expect(strongs).toHaveLength(2);
    expect(strongs[0].textContent).toBe('a');
    expect(strongs[1].textContent).toBe('b');
  });
});

describe('italic pass', () => {
  it('wraps *text* in <em>', () => {
    const container = makeContainer('*hello*');
    const em = container.querySelector('em');
    expect(em).not.toBeNull();
    expect(em!.textContent).toBe('hello');
  });

  it('does not convert ** to em (bold takes precedence)', () => {
    const container = makeContainer('**bold**');
    expect(container.querySelector('em')).toBeNull();
    expect(container.querySelector('strong')).not.toBeNull();
  });

  it('skips empty italic match and preserves literal text', () => {
    const container = makeContainer('**');
    expect(container.querySelector('em')).toBeNull();
    expect(container.textContent).toContain('**');
  });

  it('preserves surrounding text', () => {
    const container = makeContainer('before *italic* after');
    expect(container.textContent).toBe('before italic after');
    expect(container.querySelector('em')!.textContent).toBe('italic');
  });
});

describe('URL pass — links', () => {
  it('converts a plain https URL to an anchor', () => {
    const container = makeContainer('https://example.com');
    const a = container.querySelector('a');
    expect(a).not.toBeNull();
    expect(a!.getAttribute('href')).toBe('https://example.com');
    expect(a!.getAttribute('target')).toBe('_blank');
    expect(a!.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('does not linkify private IP addresses (10.x.x.x)', () => {
    const container = makeContainer('http://10.0.0.1/path');
    expect(container.querySelector('a')).toBeNull();
  });

  it('does not linkify 192.168.x.x addresses', () => {
    const container = makeContainer('http://192.168.1.1/path');
    expect(container.querySelector('a')).toBeNull();
  });
});

describe('URL pass — images', () => {
  it('wraps image URLs in an anchor containing an <img>', () => {
    const url = 'https://example.com/photo/image.jpg';
    const container = makeContainer(url);
    const img = container.querySelector('img.external_image');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(url);
    const a = container.querySelector('a');
    expect(a!.getAttribute('href')).toBe(url);
  });

  it('treats .gif URLs as inline images', () => {
    const container = makeContainer('https://example.com/pics/image.gif');
    expect(container.querySelector('img.external_image')).not.toBeNull();
  });

  it('treats .png URLs as inline images', () => {
    const container = makeContainer('https://example.com/pics/image.png');
    expect(container.querySelector('img.external_image')).not.toBeNull();
  });
});

describe('URL pass — youtube', () => {
  it('converts youtube.com/watch?v= URL to iframe embed', () => {
    const container = makeContainer('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(iframe!.getAttribute('allowfullscreen')).not.toBeNull();
  });

  it('converts youtu.be/ short URL to iframe embed', () => {
    const container = makeContainer('https://youtu.be/dQw4w9WgXcQ');
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it('sandboxes the youtube iframe', () => {
    const container = makeContainer('https://youtu.be/dQw4w9WgXcQ');
    const iframe = container.querySelector('iframe');
    expect(iframe!.getAttribute('sandbox')).toBe(
      'allow-scripts allow-same-origin allow-presentation allow-popups'
    );
  });

  it('wraps iframe in .auto-resizable-iframe', () => {
    const container = makeContainer('https://youtu.be/dQw4w9WgXcQ');
    expect(container.querySelector('.auto-resizable-iframe')).not.toBeNull();
  });
});

describe('emoticon pass', () => {
  it('replaces a known :token: with an emoticon <img>', () => {
    const container = makeContainer(':smug:');
    const img = container.querySelector('img.emoticon');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('title')).toBe(':smug:');
    expect(img!.getAttribute('src')).toBe('https://img.test.com/emoticons/smug.gif');
  });

  it('leaves an unknown :token: as literal text', () => {
    const container = makeContainer(':notanemoticon:');
    expect(container.querySelector('img.emoticon')).toBeNull();
    expect(container.textContent).toContain(':notanemoticon:');
  });

  it('handles a png emoticon correctly', () => {
    const container = makeContainer(':duck:');
    const img = container.querySelector('img.emoticon');
    expect(img!.getAttribute('src')).toBe('https://img.test.com/emoticons/duck.png');
  });
});

describe('mixed content', () => {
  it('applies bold and italic in the same string', () => {
    const container = makeContainer('**bold** and *italic*');
    expect(container.querySelector('strong')!.textContent).toBe('bold');
    expect(container.querySelector('em')!.textContent).toBe('italic');
  });

  it('preserves text surrounding a URL', () => {
    const container = makeContainer('see https://example.com for details');
    expect(container.textContent).toContain('see');
    expect(container.textContent).toContain('for details');
    expect(container.querySelector('a')).not.toBeNull();
  });

  it('applies emoticons alongside URLs', () => {
    const container = makeContainer(':smug: check https://example.com');
    expect(container.querySelector('img.emoticon')).not.toBeNull();
    expect(container.querySelector('a')).not.toBeNull();
  });

  it('bold spanning a newline is not rendered (newline splits the span)', () => {
    const container = makeContainer('**foo\nbar**');
    expect(container.querySelector('strong')).toBeNull();
    expect(container.querySelectorAll('br')).toHaveLength(1);
  });

  it('plain text with no formatting markers is unchanged', () => {
    const container = makeContainer('just plain text here');
    expect(container.textContent).toBe('just plain text here');
    expect(container.children).toHaveLength(0);
  });
});

describe('security', () => {
  it('does not linkify javascript: URIs', () => {
    const container = makeContainer('javascript:alert(1)');
    expect(container.querySelector('a')).toBeNull();
  });

  it('does not linkify data: URIs', () => {
    const container = makeContainer('data:text/html,<h1>xss</h1>');
    expect(container.querySelector('a')).toBeNull();
  });

  it('does not create image elements for non-http URLs', () => {
    const container = makeContainer('javascript:alert(1)//example.com/pic/img.jpg');
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
  });

  it('escapes HTML tags in post content', () => {
    const container = makeContainer('<img src=x onerror=alert(1)>');
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('<img');
  });

  it('escapes HTML in bold content', () => {
    const container = makeContainer('**<script>alert(1)</script>**');
    expect(container.querySelector('script')).toBeNull();
    const strong = container.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong!.textContent).toContain('<script>');
  });
});
