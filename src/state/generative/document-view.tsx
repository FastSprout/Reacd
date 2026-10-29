import { atom, useAtom } from 'jotai';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Button,
  Card,
  Grid,
  HStack,
  Input,
  Table,
  Text,
  VStack,
} from '../../components/index.js';
import { visitNodes } from '../../schema/generative/document.schema.js';
import type {
  ReacdDocument,
  ReacdNode,
} from '../../schema/generative/document.schema.js';
import type { ActionHandlers } from './renderer.props.js';

export function DocumentView({
  document,
  actions,
}: {
  document: ReacdDocument;
  actions: ActionHandlers;
}): ReactNode {
  const [editsAtom] = useState(() => atom<ReadonlyMap<string, string>>(new Map()));
  const [edits, setEdits] = useAtom(editsAtom);
  const initialValues = new Map<string, string>();
  visitNodes(document.root, (node) => {
    if (node.type === 'Input') initialValues.set(node.id, node.value ?? '');
  });

  function renderNode(node: ReacdNode, key: string): ReactNode {
    switch (node.type) {
      case 'VStack':
      case 'HStack':
      case 'Card': {
        const Component = { VStack, HStack, Card }[node.type];
        return (
          <Component key={key} spacing={node.spacing}>
            {node.children.map((child, index) => renderNode(child, `${key}-${index}`))}
          </Component>
        );
      }
      case 'Grid':
        return (
          <Grid key={key} columns={node.columns} spacing={node.spacing}>
            {node.children.map((child, index) => renderNode(child, `${key}-${index}`))}
          </Grid>
        );
      case 'Text':
        return (
          <Text
            key={key}
            role={node.role}
            weight={node.weight}
            lineLimit={node.lineLimit}
          >
            {node.content}
          </Text>
        );
      case 'Button':
        return (
          <Button
            key={key}
            label={node.label}
            intent={node.intent}
            disabled={node.disabled}
            onPress={() => {
              const handler = Object.hasOwn(actions, node.action)
                ? actions[node.action]
                : undefined;
              if (typeof handler === 'function') {
                handler({
                  values: Object.fromEntries(
                    [...initialValues].map(([id, value]) => [
                      id,
                      edits.get(id) ?? value,
                    ]),
                  ),
                });
              }
            }}
          />
        );
      case 'Input':
        return (
          <Input
            key={key}
            label={node.label}
            inputType={node.inputType}
            placeholder={node.placeholder}
            disabled={node.disabled}
            required={node.required}
            value={edits.get(node.id) ?? node.value ?? ''}
            onValueChange={(value) =>
              setEdits((previous) => new Map(previous).set(node.id, value))
            }
          />
        );
      case 'Table': {
        const { type: _type, ...properties } = node;
        return <Table key={key} {...properties} />;
      }
    }
  }
  return renderNode(document.root, 'root');
}
