export type JsonResult = {
  ok: boolean;
  output: string;
  error?: string;
};

export function formatJson(input: string, spaces = 2): JsonResult {
  try {
    return { ok: true, output: JSON.stringify(JSON.parse(input), null, spaces) };
  } catch (error) {
    return { ok: false, output: '', error: error instanceof Error ? error.message : 'Invalid JSON' };
  }
}

export function minifyJson(input: string): JsonResult {
  try {
    return { ok: true, output: JSON.stringify(JSON.parse(input)) };
  } catch (error) {
    return { ok: false, output: '', error: error instanceof Error ? error.message : 'Invalid JSON' };
  }
}
