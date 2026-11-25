import { Navigate, Route, Routes } from 'react-router';

import { GroupEntryPage } from './pages/onboarding/GroupEntryPage';
import { LoginPage } from './pages/onboarding/LoginPage';

export function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/group" element={<GroupEntryPage />} />
    </Routes>
  );
}
