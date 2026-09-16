import { createContext, type ReactNode, useContext } from 'react';
import type { AtFormAgGridTheme } from '../../../types/AtAgGridTheme.type';

const AtAgGridThemeContext = createContext<AtFormAgGridTheme | undefined>(undefined);

interface AtAgGridThemeProviderProps {
    theme?: AtFormAgGridTheme;
    children?: ReactNode;
}

/**
 * Optional standalone AG Grid theme channel for ATForm.
 *
 * Kept separate from AtFormConfigContext so switching visual themes only
 * invalidates grids instead of every ATForm field that consumes form config.
 */
export const AtAgGridThemeProvider = ({ theme, children }: AtAgGridThemeProviderProps) => {
    return (
        <AtAgGridThemeContext.Provider value={theme}>
            {children}
        </AtAgGridThemeContext.Provider>
    );
};

export const useAtAgGridTheme = () => useContext(AtAgGridThemeContext);
