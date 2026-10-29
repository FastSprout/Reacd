import type { JSX as ReactJSX } from 'react';

export namespace JSX {
  export type Element = ReactJSX.Element;
  export type ElementType = ReactJSX.ElementType;
  export type ElementClass = ReactJSX.ElementClass;
  export type ElementAttributesProperty = ReactJSX.ElementAttributesProperty;
  export type ElementChildrenAttribute = ReactJSX.ElementChildrenAttribute;
  export type IntrinsicAttributes = ReactJSX.IntrinsicAttributes;
  export type IntrinsicClassAttributes<T> = ReactJSX.IntrinsicClassAttributes<T>;
  export type LibraryManagedAttributes<C, P> = ReactJSX.LibraryManagedAttributes<C, P>;

  export interface IntrinsicElements {
    [name: string]: never;
  }
}
