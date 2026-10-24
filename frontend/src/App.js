import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// Import your page components
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Prescription from './components/Prescription';
import History from './components/History';
import DentalLogin from './components/Login';
// import Appointments from './components/Appointments';
// import Settings from './components/Settings';

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login';

  // Responsive breakpoints: mobile < 768, tablet 768-1024, desktop > 1024
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false);
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    document.title = "Subbiah Dental Clinic";
    function handleResize() {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Auto-open sidebar on desktop, auto-close on mobile/tablet
      if (width >= 1024) {
        setSidebarOpen(true);
      } else if (mobile || tablet) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle swipe gestures for mobile/tablet
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!isMobile && !isTablet) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    
    // Swipe right to open (from left edge)
    if (deltaX > 50 && touchStartX < 50 && !sidebarOpen) {
      setSidebarOpen(true);
    }
    // Swipe left to close
    if (deltaX < -50 && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const sidebarWidth = 260;
  const tabletSidebarWidth = 240;

  // Determine sidebar width based on device
  const currentSidebarWidth = isMobile ? sidebarWidth : (isTablet ? tabletSidebarWidth : sidebarWidth);

  const sidebarWrapperStyle = (isMobile || isTablet)
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: currentSidebarWidth,
        maxWidth: '85%',
        transform: sidebarOpen ? 'translateX(0)' : `translateX(-${currentSidebarWidth}px)`,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        background: '#fff',
        boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }
    : {
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        width: currentSidebarWidth,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto',
        boxShadow: '1px 0 8px rgba(0,0,0,0.05)'
      };

  const contentStyle = {
    marginLeft: hideSidebar ? 0 : ((isMobile || isTablet) ? 0 : currentSidebarWidth),
    paddingTop: (isMobile || isTablet) && !hideSidebar ? 60 : 0,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  };

  // Tablet and mobile top bar styling
  const topBarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    background: 'linear-gradient(135deg, #0077b6 0%, #0096c7 50%, #00b4d8 100%)',
    zIndex: 950,
    boxShadow: '0 4px 20px rgba(0, 119, 182, 0.25)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const menuButtonStyle = {
    fontSize: 22,
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    transition: 'all 0.2s ease',
    width: 40,
    height: 40,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 980,
    animation: 'fadeIn 0.3s ease',
    backdropFilter: 'blur(2px)'
  };

  return (
    <div 
      onTouchStart={handleTouchStart} 
      onTouchEnd={handleTouchEnd}
      style={{ overflowX: 'hidden' }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          @media (max-width: 767px) {
            .p-4 {
              padding-top: 76px !important;
              padding-bottom: 24px !important;
              padding-left: 6px !important;
              padding-right: 6px !important;
            }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .p-4 {
              padding: 20px !important;
            }
          }
          @media (min-width: 1024px) {
            .p-4 {
              padding: 24px !important;
            }
          }
        `}
      </style>

      {/* Top bar for mobile and tablet */}
      {(isMobile || isTablet) && !hideSidebar && (
        <div style={topBarStyle}>
          <button 
            onClick={() => setSidebarOpen(true)} 
            aria-label="Open menu" 
            style={menuButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          >
            ☰
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              🦷
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontWeight: 800,
                fontSize: '15px',
                color: '#ffffff',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.6px',
                lineHeight: 1.2,
                textShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}>
                SUBBIAH DENTAL
              </span>
              <span style={{
                fontSize: '9.5px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                lineHeight: 1
              }}>
                Clinic & Implant Centre
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '4px 8px',
            borderRadius: '16px',
            color: 'white'
          }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 6px #10b981',
              display: 'inline-block'
            }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px' }}>
              ONLINE
            </span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {!hideSidebar && (
        <div style={sidebarWrapperStyle}>
          <Sidebar 
            isMobile={isMobile || isTablet} 
            onClose={() => (isMobile || isTablet) && setSidebarOpen(false)} 
          />
        </div>
      )}

      {/* Overlay when sidebar open on mobile/tablet */}
      {(isMobile || isTablet) && sidebarOpen && !hideSidebar && (
        <div onClick={() => setSidebarOpen(false)} style={overlayStyle} />
      )}

      {/* Main content area */}
      <div style={contentStyle} className="flex-grow-1 p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<DentalLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;