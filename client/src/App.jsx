import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import UserPage from './components/UserPage';
import PublicPlans from './components/PublicPlans';
import MyPlans from './components/MyPlans';
import Challenges from './components/Challenges';
import WorkoutPlanForm from './components/WorkoutPlanForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Navigate replace to='/login' />} />
        <Route path='/signup' exact element={<Signup />} />
        <Route path='/login' exact element={<Login />} />
        <Route path='/user' exact element={<UserPage />}/>
        <Route path='/browse-plans' exact element={<PublicPlans />}/>
        <Route path='/my-plans' exact element={<MyPlans />}/>
        <Route path='/challenges' exact element={<Challenges />}/>
        <Route path='/create-plan' exact element={<WorkoutPlanForm />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;