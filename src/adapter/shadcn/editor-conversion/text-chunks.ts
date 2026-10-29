import { EDITOR_POLICY, EDITOR_UNICODE } from '../../../core/editor-policy.js';

interface TextChunk {
  readonly from: number;
  readonly to: number;
}

export function* editorTextChunks(text: string): Generator<TextChunk> {
  let from = 0;
  while (from < text.length) {
    let to = Math.min(from + EDITOR_POLICY.maxTextLength, text.length);
    if (to < text.length) {
      const previous = text.charCodeAt(to - 1);
      const next = text.charCodeAt(to);
      if (
        previous >= EDITOR_UNICODE.highSurrogateMin &&
        previous <= EDITOR_UNICODE.highSurrogateMax &&
        next >= EDITOR_UNICODE.lowSurrogateMin &&
        next <= EDITOR_UNICODE.lowSurrogateMax
      )
        to -= 1;
    }
    yield { from, to };
    from = to;
  }
}
