import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import VideoPlayer from './pages/VideoPlayer';
import ChannelPage from './pages/ChannelPage';
import AuthPage from './pages/AuthPage';
import CreateChannel from './pages/CreateChannel';
import PrivateRoute from './components/PrivateRoute';

/**
 * Main application router and wrapper structure.
 * Wraps routes with the global AuthProvider.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watch/:id" element={<VideoPlayer />} />
          <Route path="/channel/create" element={<PrivateRoute><CreateChannel /></PrivateRoute>} />
          <Route path="/channel/:id" element={<ChannelPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
