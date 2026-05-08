import { parse, stringify } from 'yaml';

export type YamlConvertResult =
  | {
      ok: true;
      output: string;
    }
  | {
      ok: false;
      output: '';
      error: string;
    };

function failure(error: string): YamlConvertResult {
  return { ok: false, output: '', error };
}

export function yamlToJson(input: string): YamlConvertResult {
  try {
    const parsed = parse(input, { prettyErrors: false, uniqueKeys: true });
    return { ok: true, output: JSON.stringify(parsed ?? null, null, 2) };
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Invalid YAML');
  }
}

export function jsonToYaml(input: string): YamlConvertResult {
  try {
    const parsed: unknown = JSON.parse(input);
    return { ok: true, output: stringify(parsed, { indent: 2, lineWidth: 0 }) };
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Invalid JSON');
  }
}
