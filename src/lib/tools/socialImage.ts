export type SocialImagePlatform = 'open-graph' | 'twitter-card' | 'instagram-post' | 'youtube-thumbnail';

export type SocialImageSizeCheck = {
  recommended: {
    width: number;
    height: number;
    ratio: string;
  };
  matches: boolean;
  ratio: string;
  message: string;
};

const RECOMMENDED_SIZES: Record<SocialImagePlatform, { width: number; height: number }> = {
  'open-graph': { width: 1200, height: 630 },
  'twitter-card': { width: 1200, height: 628 },
  'instagram-post': { width: 1080, height: 1080 },
  'youtube-thumbnail': { width: 1280, height: 720 },
};

export function checkSocialImageSize(
  platform: SocialImagePlatform,
  width: number,
  height: number,
): SocialImageSizeCheck {
  assertPositiveInteger(width, 'width');
  assertPositiveInteger(height, 'height');

  const recommendedSize = RECOMMENDED_SIZES[platform];
  const recommended = {
    ...recommendedSize,
    ratio: aspectRatio(recommendedSize.width, recommendedSize.height),
  };
  const ratio = aspectRatio(width, height);
  const matches = width === recommended.width && height === recommended.height;

  if (matches) {
    return {
      recommended,
      matches,
      ratio,
      message: `Matches the recommended ${recommended.width}x${recommended.height} size for ${platform}.`,
    };
  }

  if (ratio === recommended.ratio) {
    return {
      recommended,
      matches,
      ratio,
      message: `Uses the recommended ${recommended.ratio} ratio, but ${platform} recommends ${recommended.width}x${recommended.height}.`,
    };
  }

  return {
    recommended,
    matches,
    ratio,
    message: `Use ${recommended.width}x${recommended.height} (${recommended.ratio}) for ${platform}; received ${width}x${height} (${ratio}).`,
  };
}

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}

function aspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
