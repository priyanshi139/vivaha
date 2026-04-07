import React from 'react';
import { useApp } from '../context/AppContext';
import BudgetOverview from '../components/BudgetOverview';

const BudgetTab: React.FC = () => {
  const { state } = useApp();
  return <div className="pb-24"><BudgetOverview userType={state.userType as 'bride' | 'groom'} /></div>;
};

export default BudgetTab;
