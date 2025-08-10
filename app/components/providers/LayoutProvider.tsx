'use client';

import React, { createContext, useContext, ReactNode } from 'react';

type LayoutType = 'default' | 'editor';

interface LayoutContextType {
	layoutType: LayoutType;
	setLayoutType: (type: LayoutType) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
	children: ReactNode;
	defaultLayout?: LayoutType;
}

export function LayoutProvider({ children, defaultLayout = 'default' }: LayoutProviderProps) {
	const [layoutType, setLayoutType] = React.useState<LayoutType>(defaultLayout);

	return (
		<LayoutContext.Provider value={{ layoutType, setLayoutType }}>
			{children}
		</LayoutContext.Provider>
	);
}

export function useLayout() {
	const context = useContext(LayoutContext);
	if (context === undefined) {
		throw new Error('useLayout must be used within a LayoutProvider');
	}
	return context;
}

export function useIsDefaultLayout() {
	const { layoutType } = useLayout();
	return layoutType === 'default';
}

export function useIsEditorLayout() {
	const { layoutType } = useLayout();
	return layoutType === 'editor';
}