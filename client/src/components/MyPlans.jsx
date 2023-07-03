import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import SalesDocument from './SalesDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { getUserPlans } from '../api';
import Menu from './Menu';
import PlansList from './PlansList';

const MyPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
      const asyncGetPlans = async () => {
          const plans = await getUserPlans();
          setPlans(plans)
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
        <h3>Saját edzéstervek</h3>
        
        { localStorage.getItem('isCoach') === 'true' ? <>
            Kimutatás letöltése az eladott edzésterveidről: <PDFDownloadLink document={<SalesDocument />} fileName="sales.pdf">
              {({ blob, url, loading, error }) =>
                loading ? 'töltés..' : 'sales.pdf'
              }
            </PDFDownloadLink>
            <br/><br/>
          </> : <></>
        }

        <PlansList plans={plans} current={false} public={false}></PlansList>
      </div>
    </>
    )}
    </>
  )
}

export default MyPlans;