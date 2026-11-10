import { useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useToast from '../hooks/useToast';
import { STORAGE_KEY } from '../utils/constants';
import { defaultContact } from '../data/studentData';
import { fees } from '../data/feesData';
import { notices } from '../data/notificationsData';
import { requests, issuedBooks, drives, tickets } from '../data/servicesData';
import { assignments } from '../data/coursesData';
import { AppContext } from './context.js';

const buildInitialState = () => ({
  profile: defaultContact, fees, notices, requests, books: issuedBooks, drives, tickets,
  assignments: Object.fromEntries(assignments.map((a) => [a.id, false])),
  prefs: [true, true, false], registered: false, resume: '', reserved: [], clubs: {}, events: {}, revals: [],
});

export function AppProvider({ children }) {
  const [state, setState] = useLocalStorage(STORAGE_KEY, buildInitialState());
  const { message, show } = useToast();
  // patch(fn): clone state, let fn mutate the clone, store it.
  const patch = useCallback((fn) => setState((s) => { const n = structuredClone(s); fn(n); return n; }), [setState]);
  const value = useMemo(() => ({ state, patch, toast: show, toastMessage: message }), [state, patch, show, message]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
