import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';

import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Dashboard from '@/components/pages/Dashboard';
import Farms from '@/components/pages/Farms';
import Crops from '@/components/pages/Crops';
import Tasks from '@/components/pages/Tasks';
import Expenses from '@/components/pages/Expenses';
import Weather from '@/components/pages/Weather';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState('1');

  return (
    <Router>
      <div className="flex min-h-screen bg-background">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            selectedFarmId={selectedFarmId}
            onFarmChange={setSelectedFarmId}
          />
          
          <motion.main 
            className="flex-1 p-4 lg:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard selectedFarmId={selectedFarmId} />} />
              <Route path="/farms" element={<Farms />} />
              <Route path="/crops" element={<Crops selectedFarmId={selectedFarmId} />} />
              <Route path="/tasks" element={<Tasks selectedFarmId={selectedFarmId} />} />
              <Route path="/expenses" element={<Expenses selectedFarmId={selectedFarmId} />} />
              <Route path="/weather" element={<Weather />} />
            </Routes>
          </motion.main>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;