import { describe, expect, it } from 'vitest';
import { checkSocialImageSize } from '@/lib/tools/socialImage';

describe('social image size pure function', () => {
  it('matches recommended Open Graph dimensions and ratio', () => {
    expect(checkSocialImageSize('open-graph', 1200, 630)).toEqual({
      recommended: { width: 1200, height: 630, ratio: '40:21' },
      matches: true,
      ratio: '40:21',
      message: 'Matches the recommended 1200x630 size for open-graph.',
    });
  });

  it('matches recommended Twitter card dimensions and ratio', () => {
    expect(checkSocialImageSize('twitter-card', 1200, 628)).toEqual({
      recommended: { width: 1200, height: 628, ratio: '300:157' },
      matches: true,
      ratio: '300:157',
      message: 'Matches the recommended 1200x628 size for twitter-card.',
    });
  });

  it('matches recommended Instagram post dimensions and ratio', () => {
    expect(checkSocialImageSize('instagram-post', 1080, 1080)).toEqual({
      recommended: { width: 1080, height: 1080, ratio: '1:1' },
      matches: true,
      ratio: '1:1',
      message: 'Matches the recommended 1080x1080 size for instagram-post.',
    });
  });

  it('matches recommended YouTube thumbnail dimensions and ratio', () => {
    expect(checkSocialImageSize('youtube-thumbnail', 1280, 720)).toEqual({
      recommended: { width: 1280, height: 720, ratio: '16:9' },
      matches: true,
      ratio: '16:9',
      message: 'Matches the recommended 1280x720 size for youtube-thumbnail.',
    });
  });

  it('reports matching ratios when dimensions differ from the recommendation', () => {
    expect(checkSocialImageSize('instagram-post', 2160, 2160)).toEqual({
      recommended: { width: 1080, height: 1080, ratio: '1:1' },
      matches: false,
      ratio: '1:1',
      message: 'Uses the recommended 1:1 ratio, but instagram-post recommends 1080x1080.',
    });

    expect(checkSocialImageSize('youtube-thumbnail', 1920, 1080)).toMatchObject({
      matches: false,
      ratio: '16:9',
      message: 'Uses the recommended 16:9 ratio, but youtube-thumbnail recommends 1280x720.',
    });
  });

  it('reports mismatched ratios with the recommended target', () => {
    expect(checkSocialImageSize('open-graph', 1200, 600)).toEqual({
      recommended: { width: 1200, height: 630, ratio: '40:21' },
      matches: false,
      ratio: '2:1',
      message: 'Use 1200x630 (40:21) for open-graph; received 1200x600 (2:1).',
    });
  });

  it('rejects non-positive or non-integer dimensions', () => {
    expect(() => checkSocialImageSize('twitter-card', 0, 628)).toThrow(RangeError);
    expect(() => checkSocialImageSize('twitter-card', 1200, -1)).toThrow(RangeError);
    expect(() => checkSocialImageSize('twitter-card', 1200.5, 628)).toThrow(RangeError);
  });
});
