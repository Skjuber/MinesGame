"use client"

import React from 'react';
import { useBalance } from './context/BalanceContext';
import styles from './balanceDisplay.module.css';

const BalanceDisplay: React.FC = () => {
  const { balance, currency, isLoading, error } = useBalance();

  const formattedBalance = (balance / 100).toFixed(2);
  
  if (isLoading) {
    return (
      <div className={styles.balanceContainer}>
        <div className={styles.balanceLabel}>BALANCE</div>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.balanceContainer}>
        <div className={styles.balanceLabel}>BALANCE</div>
        <div className={styles.errorText}>Error</div>
      </div>
    );
  }
  
  return (
    <div className={styles.balanceContainer}>
      <div className={styles.balanceLabel}>BALANCE</div>
      <div className={styles.balanceValue}>{`${currency}${formattedBalance}`}</div>
    </div>
  );
};

export default BalanceDisplay;