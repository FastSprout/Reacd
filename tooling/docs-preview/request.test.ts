import { expect, it } from 'vitest';
import { readPreviewRequest } from './request.js';

it('requires one registered component and uses explicit defaults', () => {
  expect(readPreviewRequest('?component=Button')).toEqual({
    component: 'Button',
    template: 'saas-modern-light',
    direction: 'ltr',
  });
  expect(
    readPreviewRequest('?component=Grid&template=erp-compact&direction=rtl'),
  ).toEqual({ component: 'Grid', template: 'erp-compact', direction: 'rtl' });
});
it.each([
  '',
  '?component=',
  '?component=constructor',
  '?component=../Button',
  '?component=Button&component=Grid',
  '?component=Button&template=invalid',
  '?component=Button&direction=up',
  '?component=Button&html=anything',
  '?component=Button&__proto__=anything',
  '?component=Button&template=constructor',
  '?component=%ZZ',
  '?component=Button&template=saas-modern-light&template=erp-compact',
  '?component=Button&direction=ltr&direction=rtl',
])('rejects an unsupported preview request: %s', (query) => {
  expect(readPreviewRequest(query)).toBeNull();
});

it('bounds query text before allocating URL parameters', () => {
  expect(readPreviewRequest(`?component=Button&${'x'.repeat(256)}`)).toBeNull();
});
