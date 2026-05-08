import { describe, expect, it } from 'vitest';
import {
  detectFileExtension,
  estimateBase64Size,
  humanFileSummary,
  sanitizeFilename,
  splitFileName,
} from '@/lib/tools/fileTools';

describe('file tools', () => {
  it('splits visible filenames and treats dotfiles as extensionless', () => {
    expect(splitFileName('archive.tar.gz')).toEqual({ base: 'archive.tar', extension: 'gz' });
    expect(splitFileName('.env')).toEqual({ base: '.env', extension: '' });
    expect(splitFileName('README')).toEqual({ base: 'README', extension: '' });
    expect(splitFileName('trailing.')).toEqual({ base: 'trailing.', extension: '' });
  });

  it('detects extensions from filename first and mime as fallback', () => {
    expect(detectFileExtension('photo.JPG', 'image/png')).toBe('jpg');
    expect(detectFileExtension('.env', 'text/plain')).toBe('txt');
    expect(detectFileExtension('download', 'application/json; charset=utf-8')).toBe('json');
    expect(detectFileExtension('download', 'application/octet-stream')).toBe('');
  });

  it('sanitizes illegal filename characters', () => {
    expect(sanitizeFilename(' report: Q1/Q2?.txt ')).toBe('report- Q1-Q2-.txt');
    expect(sanitizeFilename('bad<>:"/\\|?*name')).toBe('bad-name');
    expect(sanitizeFilename('   ...   ')).toBe('untitled');
  });

  it('estimates base64 encoded byte length', () => {
    expect(estimateBase64Size(0)).toBe(0);
    expect(estimateBase64Size(1)).toBe(4);
    expect(estimateBase64Size(2)).toBe(4);
    expect(estimateBase64Size(3)).toBe(4);
    expect(estimateBase64Size(4)).toBe(8);
    expect(estimateBase64Size(1024)).toBe(1368);
  });

  it('builds a human-readable file summary', () => {
    expect(humanFileSummary({ name: 'photo.png', size: 1536, type: 'image/png' })).toBe('photo.png (1.5 KB, PNG)');
    expect(humanFileSummary({ name: 'README', size: 12, type: 'text/plain' })).toBe('README (12 B, TXT)');
    expect(humanFileSummary({ name: 'mystery', size: -1 })).toBe('mystery (0 B, unknown type)');
  });
});
