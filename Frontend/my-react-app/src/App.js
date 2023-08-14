import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import SignIn from './сomponents/SignIn';
import SignUp from './сomponents/SignUp';
import Organization from './сomponents/Organization';
import './App.css';

function App() {
    return (

          <div className='links'>
              <Link to="/signup">SignUp</Link>
              <Link to="/signin">SignIn</Link>
              <Link to="/organization">Organization</Link>
  
      
              <Routes>
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/organization" element={<Organization />} />
              
                  <Route path="*" element={<Navigate to="/signin" />} />
              </Routes>
          </div>
     
    );
  }
  
  export default App;