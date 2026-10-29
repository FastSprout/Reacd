import type { ReactNode } from 'react';
import type { BannerProps } from './banner.props.js';
import { bannerSchema } from '../../schema/banner/banner.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { BannerProps } from './banner.props.js';
export function Banner(props: BannerProps): ReactNode {
  return useDeclaration('Banner', bannerSchema, props);
}
