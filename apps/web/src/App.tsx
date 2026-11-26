import { Route, Routes } from 'react-router';

import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { HomePage } from './pages/home/HomePage';
import { LandingPage } from './pages/landing/LandingPage';
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
import { TabLayout } from './shared/ui/TabLayout';

export function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/group" element={<GroupEntryPage />} />
      <Route path="/group/new" element={<CreateGroupPage />} />
      <Route path="/group/invite" element={<InviteMembersPage />} />
      <Route path="/join" element={<EnterInviteLinkPage />} />
      <Route path="/join/confirm" element={<JoinGroupPage />} />
      <Route path="/nickname" element={<NicknamePage />} />
      <Route path="/group/done" element={<GroupCompletePage />} />
      <Route element={<TabLayout />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  );
}
