import React, { createContext, ReactNode, useContext, useState } from 'react';

interface VisibilityContextType {
  visibleItems: Set<number>;
  setVisibleItems: (items: Set<number>) => void;
  updateItemVisibility: (index: number, isVisible: boolean) => void;
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined);

interface VisibilityProviderProps {
  children: ReactNode;
}

export const VisibilityProvider: React.FC<VisibilityProviderProps> = ({ children }) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  const updateItemVisibility = (index: number, isVisible: boolean) => {
    setVisibleItems(prev => {
      const newSet = new Set(prev);
      if (isVisible) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      return newSet;
    });
  };

  return (
    <VisibilityContext.Provider value={{
      visibleItems,
      setVisibleItems,
      updateItemVisibility
    }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => {
  const context = useContext(VisibilityContext);
  if (context === undefined) {
    throw new Error('useVisibility must be used within a VisibilityProvider');
  }
  return context;
}; 