import { describe, it, expect, vi } from 'vitest';

vi.mock('@/config', () => ({
  default: {
    img_srv: 'https://img.test.com',
    api_srv: 'https://api.test.com',
    ib_id: 1,
    csrf_token: '',
  },
}));

const { emoticonSrv, tokenMap } = await import('./useEmoticons');

describe('emoticonSrv', () => {
  it('is constructed from img_srv + /emoticons/', () => {
    expect(emoticonSrv).toBe('https://img.test.com/emoticons/');
  });
});

describe('tokenMap', () => {
  it('contains all 25 emoticons', () => {
    expect(Object.keys(tokenMap)).toHaveLength(25);
  });

  it('maps token text to an object with text and image fields', () => {
    const smug = tokenMap['smug'];
    expect(smug).toBeDefined();
    expect(smug.text).toBe('smug');
    expect(smug.image).toBe('smug.gif');
  });

  it('contains emoticons with png extensions', () => {
    expect(tokenMap['negative'].image).toBe('negative.png');
    expect(tokenMap['smugmrgw'].image).toBe('smugmrgw.png');
    expect(tokenMap['duck'].image).toBe('duck.png');
    expect(tokenMap['pacha'].image).toBe('pacha.png');
  });

  it('uses the token text as the map key', () => {
    for (const key of Object.keys(tokenMap)) {
      expect(tokenMap[key].text).toBe(key);
    }
  });

  it('returns undefined for unknown tokens', () => {
    expect(tokenMap['nonexistent']).toBeUndefined();
  });
});
