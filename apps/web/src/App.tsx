import { Route, Routes } from 'react-router';

import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { CameraPage } from './pages/camera/CameraPage';
import { GroupsPage } from './pages/groups/GroupsPage';
import { HomePage } from './pages/home/HomePage';
import { LandingPage } from './pages/landing/LandingPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { AgreementDetailPage } from './pages/onboarding/AgreementDetailPage';
import { AgreementPage } from './pages/onboarding/AgreementPage';
import { CreateGroupPage } from './pages/onboarding/CreateGroupPage';
import { EnterInviteLinkPage } from './pages/onboarding/EnterInviteLinkPage';
import { GroupCompletePage } from './pages/onboarding/GroupCompletePage';
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
      <Route path="/agreement" element={<AgreementPage />} />
      <Route
        path="/agreement/terms"
        element={<AgreementDetailPage id="terms" title="서비스 이용 약관" />}
      />
      <Route
        path="/agreement/privacy"
        element={<AgreementDetailPage id="privacy" title="개인정보처리방침" />}
      />
      <Route path="/group/new" element={<CreateGroupPage />} />
      <Route path="/group/invite" element={<InviteMembersPage />} />
      <Route path="/join" element={<EnterInviteLinkPage />} />
      <Route path="/join/confirm" element={<JoinGroupPage />} />
      <Route path="/nickname" element={<NicknamePage />} />
      <Route path="/group/done" element={<GroupCompletePage />} />
      <Route element={<TabLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/groups" element={<GroupsPage />} />
      </Route>
      <Route path="/camera" element={<CameraPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  );
}
