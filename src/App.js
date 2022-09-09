import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard'
import Packages from './pages/package'
import Customers from './pages/customers'
import Orders from './pages/orders'
import PrivateRoute from './routes/PrivateRoute'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path='/auth' element={<Login />} />
      <Route path="/packages" element={<PrivateRoute><Packages /></PrivateRoute>} />
      <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  )
}

export default App