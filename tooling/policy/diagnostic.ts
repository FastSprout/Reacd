export interface PolicyDiagnostic {
  file: string;
  line: number;
  column: number;
  rule: string;
  message: string;
}

export function diagnostic(
  file: string,
  source: string,
  offset: number,
  rule: string,
  message: string,
): PolicyDiagnostic {
  const prefix = source.slice(0, offset);
  return {
    file,
    line: prefix.split('\n').length,
    column: prefix.length - prefix.lastIndexOf('\n'),
    rule,
    message,
  };
}
