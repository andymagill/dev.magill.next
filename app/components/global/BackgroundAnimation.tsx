'use client';

import React from 'react';
import styles from './BackgroundAnimation.module.scss';

interface BackgroundAnimationProps {}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = () => {
	return <div className={styles.backgroundAnimation} />;
};

export default BackgroundAnimation;
