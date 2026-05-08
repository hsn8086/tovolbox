import { describe, expect, it } from 'vitest';
import { jsonToYaml, yamlToJson } from '@/lib/tools/yaml';

describe('YAML converters', () => {
  it('converts YAML documents to formatted JSON', () => {
    const result = yamlToJson('name: Ada\nskills:\n  - JSON\n  - YAML');

    expect(result.ok).toBe(true);
    expect(result.output).toContain('"name": "Ada"');
    expect(result.output).toContain('"YAML"');
  });

  it('converts JSON values to readable YAML', () => {
    const result = jsonToYaml('{"name":"Ada","skills":["JSON","YAML"]}');

    expect(result.ok).toBe(true);
    expect(result.output).toContain('name: Ada');
    expect(result.output).toContain('- JSON');
  });

  it('returns readable errors for invalid inputs', () => {
    expect(yamlToJson('name: [unterminated').ok).toBe(false);
    expect(jsonToYaml('{bad json').ok).toBe(false);
  });
});
