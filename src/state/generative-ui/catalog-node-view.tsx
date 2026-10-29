import type { ReactNode } from 'react';
import {
  Container,
  Main,
  Header,
  Footer,
  Separator,
  ProgressGroup,
  App,
  Error,
  Theme,
  Timeline,
  ScrollArea,
} from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { BoundHeader } from './bound-header.js';
import { BoundBanner } from './bound-banner.js';
import { BoundInputNumber } from './bound-input-number.js';
import { BoundPinInput } from './bound-pin-input.js';
import { GenerativeUser } from './generative-user.js';
import { BoundTimeline } from './bound-timeline.js';
import { BoundInputRating } from './bound-input-rating.js';

type CatalogNode = Extract<
  GenerativeNode,
  {
    type:
      | 'Container'
      | 'Main'
      | 'Header'
      | 'Footer'
      | 'Separator'
      | 'ProgressGroup'
      | 'User'
      | 'Banner'
      | 'InputNumber'
      | 'PinInput'
      | 'App'
      | 'Error'
      | 'Theme'
      | 'Timeline'
      | 'ScrollArea'
      | 'InputRating';
  }
>;

export function CatalogNodeView({
  node,
  registry,
  actions,
  renderChild,
}: {
  node: CatalogNode;
  registry: StateRegistry;
  actions: GenerativeActions;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  switch (node.type) {
    case 'InputRating':
      return <BoundInputRating node={node} registry={registry} />;
    case 'App':
    case 'Theme': {
      const { type, children, ...properties } = node;
      const Component = { App, Theme }[type];
      return <Component {...properties}>{children.map(renderChild)}</Component>;
    }
    case 'ScrollArea': {
      const { type: _type, children, ...properties } = node;
      return <ScrollArea {...properties}>{children.map(renderChild)}</ScrollArea>;
    }
    case 'Error': {
      const { type: _type, children, leading, actions: controls, ...properties } = node;
      return (
        <Error
          {...properties}
          leading={leading?.map(renderChild)}
          actions={controls?.map(renderChild)}
        >
          {children.map(renderChild)}
        </Error>
      );
    }
    case 'Timeline': {
      const { type: _type, value, ...properties } = node;
      return typeof value === 'object' ? (
        <BoundTimeline reference={value} properties={properties} registry={registry} />
      ) : (
        <Timeline {...properties} value={value} />
      );
    }
    case 'InputNumber':
      return <BoundInputNumber node={node} registry={registry} />;
    case 'PinInput':
      return <BoundPinInput node={node} registry={registry} actions={actions} />;
    case 'User':
      return <GenerativeUser node={node} registry={registry} actions={actions} />;
    case 'ProgressGroup': {
      const { type: _type, ...properties } = node;
      return <ProgressGroup {...properties} />;
    }
    case 'Banner': {
      const { type: _type, open, actions: controls, ...properties } = node;
      return (
        <BoundBanner
          reference={open}
          registry={registry}
          properties={{ ...properties, actions: controls?.map(renderChild) }}
        />
      );
    }
    case 'Container':
      return <Container>{node.children.map(renderChild)}</Container>;
    case 'Main':
      return <Main>{node.children.map(renderChild)}</Main>;
    case 'Separator': {
      const { type: _type, children, ...properties } = node;
      return <Separator {...properties}>{children.map(renderChild)}</Separator>;
    }
    case 'Footer': {
      const { type: _type, children, start, end, top, bottom } = node;
      return (
        <Footer
          start={start?.map(renderChild)}
          end={end?.map(renderChild)}
          top={top?.map(renderChild)}
          bottom={bottom?.map(renderChild)}
        >
          {children.map(renderChild)}
        </Footer>
      );
    }
    case 'Header': {
      const { type: _type, children, start, end, top, bottom, menu, ...rest } = node;
      const properties = {
        ...rest,
        children: children.map(renderChild),
        start: start?.map(renderChild),
        end: end?.map(renderChild),
        top: top?.map(renderChild),
        bottom: bottom?.map(renderChild),
      };
      return menu === undefined ? (
        <Header {...properties} />
      ) : (
        <BoundHeader
          properties={properties}
          menu={menu}
          content={menu.content.map(renderChild)}
          registry={registry}
        />
      );
    }
  }
}
