import { Navigate, Route, Routes } from 'react-router';

import { LoginPage } from './pages/onboarding/LoginPage';

export function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
