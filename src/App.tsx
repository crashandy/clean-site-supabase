import React from 'react';
import { Routes,Route,Link } from 'react-router-dom';
import FormPage from './pages/Form';
import AdminPage from './pages/Admin';
export default function App(){
  return (
    <div className="max-w-lg mx-auto p-4">
      <header className="flex justify-between mb-4">
        <Link to="/" className="text-xl font-bold">清潔日誌</Link>
        <Link to="/admin" className="text-blue-600">後台</Link>
      </header>
      <Routes>
        <Route path="/" element={<FormPage/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
      </Routes>
    </div>
  );
}