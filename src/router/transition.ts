import { createContext, useContext } from 'react'

/** The path the site is leaving for, while the old page fades; lets the chosen tile stay lit. */
export const LeavingContext = createContext<string | null>(null)

export const useLeavingTo = (): string | null => useContext(LeavingContext)
