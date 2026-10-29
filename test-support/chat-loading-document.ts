import type { GenerativeDeclaration } from '../src/generative.js';

export const CHAT_LOADING_DOCUMENT = {
  schemaVersion: '0.2',
  state: [
    { key: 'draft', kind: 'text', access: 'readWrite', initial: 'Preserved draft' },
    { key: 'note', kind: 'text', access: 'readWrite', initial: 'Scope proof' },
    { key: 'summaryOpen', kind: 'boolean', access: 'readWrite', initial: true },
    { key: 'toolOpen', kind: 'boolean', access: 'readWrite', initial: true },
  ],
  root: {
    type: 'App',
    direction: 'rtl',
    children: [
      {
        type: 'VStack',
        children: [
          {
            type: 'ChatMessages',
            label: 'Review transcript',
            status: 'streaming',
            messages: [
              {
                id: 'reply',
                author: 'Review assistant',
                role: 'assistant',
                status: 'streaming',
                content: 'Changing reply text',
                attachments: [
                  {
                    name: 'Transcript reference',
                    mediaType: 'text/plain',
                    status: 'uploading',
                  },
                ],
              },
            ],
          },
          {
            type: 'ChatPrompt',
            label: 'Review composer',
            status: 'streaming',
            value: { state: 'draft', mode: 'readWrite' },
            submitAction: 'saveExample',
            stopAction: 'saveExample',
            attachments: [
              {
                id: 'file',
                name: 'Composer reference',
                mediaType: 'text/plain',
                status: 'uploading',
              },
            ],
            footer: [
              { type: 'ChatShimmer', text: 'Independent footer progress' },
              { type: 'ChatPromptSubmit' },
            ],
          },
          {
            type: 'ChatReasoning',
            label: 'Review summary',
            text: 'Changing summary text',
            streaming: true,
            open: { state: 'summaryOpen', mode: 'readWrite' },
          },
          {
            type: 'ChatTool',
            label: 'Review tool',
            status: 'running',
            output: 'Changing tool output',
            open: { state: 'toolOpen', mode: 'readWrite' },
          },
          { type: 'ChatShimmer', text: 'Independent sibling progress' },
        ],
      },
    ],
  },
} satisfies GenerativeDeclaration;
