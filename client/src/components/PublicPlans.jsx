import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getPublicPlans } from '../api';
import Menu from './Menu';
import PlansList from './PlansList';

const PublicPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const asyncGetPlans = async () => {
      const plans = await getPublicPlans();
      setPlans(plans);
    }
    asyncGetPlans();
  }, []);
  
  return (
    <>
    { localStorage.getItem('token') == null || localStorage.getItem('token') === 'undefined' ? (
      <Navigate replace to='/login' />
    ) : (
    <>
      <Menu></Menu>
      <div className='container'>
        <h3>Publikus edzéstervek</h3>
        <PlansList plans={plans} current={false} public={true}></PlansList>
      </div>
    </>
    )}
    </>
  )
}

export default PublicPlans;