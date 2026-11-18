import { Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Explore from './pages/Explore';
import ItemDetail from './pages/ItemDetail';
import Sell from './pages/Sell';
import Dashboard from './pages/Dashboard';
import Impact from './pages/Impact';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

const guard = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="explore" element={<Explore />} />
            <Route path="items/:id" element={<ItemDetail />} />
            <Route path="impact" element={<Impact />} />
            <Route path="sell" element={guard(<Sell />)} />
            <Route path="dashboard" element={guard(<Dashboard />)} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: { background: '#121815', color: '#fff', borderRadius: '12px', fontSize: '14px' },
            success: { iconTheme: { primary: '#E9A23B', secondary: '#121815' } },
          }}
        />
      </AuthProvider>
    </MotionConfig>
  );
}
