import React from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerPage from './customer/pages/customerpage';
import LotPage from './lot/pages/lotpage';

const App: React.FC = () => {
  return (
    <Theme preset={presetGpnDefault}>
      <Router>
        <div style={{ padding: 'var(--space-xl)' }}>
          <nav style={{ marginBottom: 'var(--space-xl)' }}>
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              padding: 0,
              gap: 'var(--space-m)'
            }}>
              <li>
                <Link to="/" style={{
                  textDecoration: 'none',
                  color: 'var(--color-typo-primary)',
                  padding: 'var(--space-xs) var(--space-s)',
                  borderRadius: 'var(--control-radius)',
                  backgroundColor: 'var(--color-control-bg-default)',
                }}>Home</Link>
              </li>
              <li>
                <Link to="/customers" style={{
                  textDecoration: 'none',
                  color: 'var(--color-typo-primary)',
                  padding: 'var(--space-xs) var(--space-s)',
                  borderRadius: 'var(--control-radius)',
                  backgroundColor: 'var(--color-control-bg-default)',
                }}>Customers</Link>
              </li>
              <li>
                <Link to="/lots" style={{
                  textDecoration: 'none',
                  color: 'var(--color-typo-primary)',
                  padding: 'var(--space-xs) var(--space-s)',
                  borderRadius: 'var(--control-radius)',
                  backgroundColor: 'var(--color-control-bg-default)',
                }}>Lots</Link>
              </li>
            </ul>
          </nav>
          
          <Routes>
            <Route path="/" element={<h1>Добро пожаловать!</h1>} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/lots" element={<LotPage />} />
          </Routes>
        </div>
      </Router>
    </Theme>
  );
};

export default App;