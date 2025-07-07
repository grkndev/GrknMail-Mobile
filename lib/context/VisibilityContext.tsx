import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface VisibilityContextType {
  visibleItems: Set<number>;
  setVisibleItems: (items: Set<number>) => void;
  updateItemVisibility: (index: number, isVisible: boolean) => void;
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined);

interface VisibilityProviderProps {
  children: ReactNode;
}

// Optimized: Helper to compare Sets for shallow equality
const setsAreEqual = (setA: Set<number>, setB: Set<number>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};

export const VisibilityProvider: React.FC<VisibilityProviderProps> = ({ children }) => {
  const [visibleItems, setVisibleItemsState] = useState<Set<number>>(new Set());

  // Optimized: Prevent unnecessary updates with shallow comparison
  const setVisibleItems = useCallback((newItems: Set<number>) => {
    setVisibleItemsState(prevItems => {
      if (setsAreEqual(prevItems, newItems)) {
        return prevItems; // Prevent re-render if sets are identical
      }
      return newItems;
    });
  }, []);

  // Optimized: Batch-friendly update method
  const updateItemVisibility = useCallback((index: number, isVisible: boolean) => {
    setVisibleItemsState(prev => {
      const hasItem = prev.has(index);
      
      // Early return if no change needed
      if ((isVisible && hasItem) || (!isVisible && !hasItem)) {
        return prev;
      }
      
      const newSet = new Set(prev);
      if (isVisible) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      return newSet;
    });
  }, []);

  // Optimized: Memoized context value to prevent unnecessary provider re-renders
  const contextValue = React.useMemo(() => ({
    visibleItems,
    setVisibleItems,
    updateItemVisibility
  }), [visibleItems, setVisibleItems, updateItemVisibility]);

  return (
    <VisibilityContext.Provider value={contextValue}>
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