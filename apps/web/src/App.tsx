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
import { ProfilePage } from './pages/profile/ProfilePage';
import { AuthGate } from './shared/auth/AuthGate';
import { TabLayout } from './shared/ui/TabLayout';

export function App() {
  return (
    <Routes>
      {/* 로그아웃 상태에서만 */}
      <Route element={<AuthGate allow="guest" />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* 로그인했지만 약관 동의 전에만 */}
      <Route element={<AuthGate allow="agreement" />}>
        <Route path="/agreement" element={<AgreementPage />} />
        <Route
          path="/agreement/terms"
          element={<AgreementDetailPage id="terms" title="서비스 이용 약관" />}
        />
        <Route
          path="/agreement/privacy"
          element={<AgreementDetailPage id="privacy" title="개인정보처리방침" />}
        />
      </Route>

      {/* 약관 동의까지 마친 뒤에만 */}
      <Route element={<AuthGate allow="member" />}>
        <Route path="/group/new" element={<CreateGroupPage />} />
        <Route path="/group/invite" element={<InviteMembersPage />} />
        <Route path="/join" element={<EnterInviteLinkPage />} />
        <Route path="/join/confirm" element={<JoinGroupPage />} />
        <Route path="/nickname" element={<NicknamePage />} />
        <Route path="/group/done" element={<GroupCompletePage />} />
        <Route element={<TabLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/camera" element={<CameraPage />} />
      </Route>

      {/* 누구나 */}
      <Route index element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  );
}
