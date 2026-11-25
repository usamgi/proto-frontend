import { Navigate, Route, Routes } from 'react-router';

import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { CreateGroupPage } from './pages/onboarding/CreateGroupPage';
import { EnterInviteLinkPage } from './pages/onboarding/EnterInviteLinkPage';
import { GroupCompletePage } from './pages/onboarding/GroupCompletePage';
import { GroupEntryPage } from './pages/onboarding/GroupEntryPage';
import { InviteMembersPage } from './pages/onboarding/InviteMembersPage';
import { JoinGroupPage } from './pages/onboarding/JoinGroupPage';
import { LoginPage } from './pages/onboarding/LoginPage';
import { NicknamePage } from './pages/onboarding/NicknamePage';

export function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/group" element={<GroupEntryPage />} />
      <Route path="/group/new" element={<CreateGroupPage />} />
      <Route path="/group/invite" element={<InviteMembersPage />} />
      <Route path="/join" element={<EnterInviteLinkPage />} />
      <Route path="/join/confirm" element={<JoinGroupPage />} />
      <Route path="/nickname" element={<NicknamePage />} />
      <Route path="/group/done" element={<GroupCompletePage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  );
}
