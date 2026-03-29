import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Component, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Blog from './pages/Blog';
import TrustSafety from './pages/TrustSafety';
import HelpCentre from './pages/HelpCentre';
import CancellationPolicy from './pages/CancellationPolicy';
import HostResources from './pages/HostResources';
import Community from './pages/Community';
import ContactUs from './pages/ContactUs';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Sitemap from './pages/Sitemap';

// Must be INSIDE BrowserRouter to use useLocation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', gap: '12px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h2 style={{ color: '#222', margin: 0 }}>Something went wrong</h2>
          <p style={{ color: '#717171', maxWidth: '480px', margin: 0 }}>{this.state.error?.message}</p>
          <button onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
            style={{ marginTop: '8px', background: '#e8472a', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
            Go to Homepage
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route path="/listings" element={<ErrorBoundary><Listings /></ErrorBoundary>} />
              <Route path="/property/:id" element={<ErrorBoundary><PropertyDetail /></ErrorBoundary>} />
              <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
              <Route path="/profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
              <Route path="/about" element={<ErrorBoundary><AboutUs /></ErrorBoundary>} />
              <Route path="/careers" element={<ErrorBoundary><Careers /></ErrorBoundary>} />
              <Route path="/press" element={<ErrorBoundary><Press /></ErrorBoundary>} />
              <Route path="/blog" element={<ErrorBoundary><Blog /></ErrorBoundary>} />
              <Route path="/trust-safety" element={<ErrorBoundary><TrustSafety /></ErrorBoundary>} />
              <Route path="/help" element={<ErrorBoundary><HelpCentre /></ErrorBoundary>} />
              <Route path="/cancellation-policy" element={<ErrorBoundary><CancellationPolicy /></ErrorBoundary>} />
              <Route path="/host-resources" element={<ErrorBoundary><HostResources /></ErrorBoundary>} />
              <Route path="/community" element={<ErrorBoundary><Community /></ErrorBoundary>} />
              <Route path="/contact" element={<ErrorBoundary><ContactUs /></ErrorBoundary>} />
              <Route path="/privacy" element={<ErrorBoundary><Privacy /></ErrorBoundary>} />
              <Route path="/terms" element={<ErrorBoundary><Terms /></ErrorBoundary>} />
              <Route path="/sitemap" element={<ErrorBoundary><Sitemap /></ErrorBoundary>} />
            </Routes>
          </main>
          <Footer />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
