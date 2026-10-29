import { createContext, useContext } from 'react';

export const ChatLoadingScopeContext = createContext(false);

export function useChatLoadingRole(): 'status' | undefined {
  return useContext(ChatLoadingScopeContext) ? undefined : 'status';
}
