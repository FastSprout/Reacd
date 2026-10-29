import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { jsx, jsxs } from '../../jsx-runtime.js';
import { jsxDEV } from '../../jsx-dev-runtime.js';
import type { JSX } from '../../jsx-runtime.js';
import { isSafeContent } from '../../schema/shared/children.js';
import { DOCUMENT_POLICY } from '../../core/policy.js';

function BusinessView() {
  return null;
}

describe('closed TSX runtime', () => {
  it('supports business compositions, children, fragments, and keys', () => {
    expect(jsx(BusinessView, {}, 'business').key).toBe('business');
    expect(jsxs(Fragment, { children: [null, false] }).type).toBe(Fragment);
    expect(jsxDEV(BusinessView, {}, 'dev', false, undefined, undefined).key).toBe(
      'dev',
    );
    expect(renderToStaticMarkup(jsx(BusinessView, {}))).toBe('');
    expectTypeOf<JSX.IntrinsicElements['div']>().toBeNever();
  });

  it('rejects native tags in production and development runtimes', () => {
    expect(() => jsx('div', {})).toThrow('Native HTML');
    expect(() => jsxs('p', {})).toThrow('Native HTML');
    expect(() => jsxDEV('h1', {}, undefined, false, undefined, undefined)).toThrow(
      'Native HTML',
    );
  });
});

describe('runtime children validation', () => {
  it.each([null, undefined, false, true, '', 'content', 0, 42])(
    'permits React content: %s',
    (content) => {
      expect(isSafeContent(content)).toBe(true);
    },
  );

  it('accepts nested compositions and rejects native children', () => {
    expect(isSafeContent([jsx(BusinessView, {}), [null, 1]])).toBe(true);
    expect(
      isSafeContent(
        jsx(BusinessView, {
          children: jsx(BusinessView, { children: 'nested' }),
        }),
      ),
    ).toBe(true);
    expect(isSafeContent(createElement('div'))).toBe(false);
    expect(
      isSafeContent(
        jsx(BusinessView, {
          children: createElement('span'),
        }),
      ),
    ).toBe(false);
  });

  it.each([{}, Symbol('invalid'), () => null, Infinity, NaN])(
    'rejects unsupported content: %s',
    (content) => {
      expect(isSafeContent(content)).toBe(false);
    },
  );

  it('bounds depth, including cyclic arrays', () => {
    const cycle: unknown[] = [];
    cycle.push(cycle);
    expect(isSafeContent(cycle)).toBe(false);
    expect(isSafeContent(null, DOCUMENT_POLICY.maxDepth)).toBe(true);
    expect(isSafeContent(null, DOCUMENT_POLICY.maxDepth + 1)).toBe(false);
  });
});
