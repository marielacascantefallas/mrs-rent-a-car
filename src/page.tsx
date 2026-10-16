import { createContext, useContext, type ReactNode } from 'react';
import type { PageId } from './routes';

const PageContext = createContext<PageId>('home');

export function PageProvider({ page, children }: { page: PageId; children: ReactNode }) {
  return <PageContext.Provider value={page}>{children}</PageContext.Provider>;
}

/** Página actual (home, transport o car:<id>). */
export function usePage() {
  return useContext(PageContext);
}
