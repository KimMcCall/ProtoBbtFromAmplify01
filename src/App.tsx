import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import ProfilePage from "./pages/ProfilePage";
import Todos from "./pages/Todos";
import SketchPage from "./pages/printing/SketchPage";
import SuggestionPage from "./pages/SuggestionsPage";
import MissionPage from './pages/MissionPage';
import FinancesPage from './pages/FinancesPage';
import PlayPage01 from './pages/PlayPage01';
import PlayPage02 from './pages/PlayPage02';
import PlayPage03 from './pages/PlayPage03';
import PlayPage04 from './pages/PlayPage04';
import AliasPage from './pages/AliasPage';
import BannedPage from './pages/BannedPage';
import BannedAliasPage from './pages/BannedAliasPage';
import CorruptedDbPage from './pages/CorruptedDbPage';
import UninitializedUserStatusPage from './pages/UninitializedUserStatusPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminIssuesPage from './pages/AdminIssuesPage';
import AdminSubmissions from './pages/AdminSubmissionsPage';
import IssuePage from './pages/IssuePage';
import HomePage from './pages/HomePage';
import CommentsPage from './pages/CommentsPage';
import NoProUrlPage from './pages/NoProUrlPage';
import NoConUrlPage from './pages/NoConUrlPage';
import AdminUrlSubmissions from './pages/AdminUrlSubmissions';
import AdminPage from './pages/AdminPage';
import DoBetterPage from './pages/DoBetterPage';
import AdminUncloisteredPage from './pages/AdminUncloisteredPage';
import AutoTimeout from './components/AutoTimeout.tsx';
import PolicyPage from './pages/PolicyPage.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/issue" element={<IssuePage />} />
        <Route
          path="/comments"
          element={
            <ProtectedRoute>
              <AutoTimeout>
                <CommentsPage />
              </AutoTimeout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggest"
          element={
            <ProtectedRoute>
              <AutoTimeout>
                <SuggestionPage />
              </AutoTimeout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doBetter"
          element={
            <ProtectedRoute>
              <AutoTimeout>
                <DoBetterPage />
              </AutoTimeout>
            </ProtectedRoute>
          }
        />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/finances" element={<FinancesPage />} />
        <Route path="/noProUrl" element={<NoProUrlPage />} />
        <Route path="/noConUrl" element={<NoConUrlPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AutoTimeout>
                <AdminPage />
              </AutoTimeout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminUrlSubmissions"
          element={
            <ProtectedRoute>
              <AutoTimeout>
                <AdminUrlSubmissions />
              </AutoTimeout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminUsers"
          element={
            <ProtectedRoute>
              <AutoTimeout>
                <AdminUsersPage />
              </AutoTimeout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminIssues"
          element={
            <ProtectedRoute>
              <AutoTimeout>
                <AdminIssuesPage />
              </AutoTimeout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminSubmissions"
          element={
            <ProtectedRoute>
              <AutoTimeout>
                <AdminSubmissions />
              </AutoTimeout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminUncloistered"
          element={
            <ProtectedRoute>
              <AutoTimeout>
                <AdminUncloisteredPage />
              </AutoTimeout>
            </ProtectedRoute>
          }
        />
        <Route path="/alias" element={<AliasPage />} />
        <Route path="/banned" element={<BannedPage />} />
        <Route path="/bannedAlias" element={<BannedAliasPage />} />
        <Route path="/corruptedDb" element={<CorruptedDbPage />} />
        <Route path="/uninitializedUserStatus" element={<UninitializedUserStatusPage />} />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <Todos />
            </ProtectedRoute>
          }
        />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/sketch" element={<SketchPage />} />
        <Route path="/play01" element={<PlayPage01 />} />
        <Route path="/play02" element={<PlayPage02 />} />
        <Route path="/play03" element={<PlayPage03 />} />
        <Route path="/play04" element={<PlayPage04 />} />
      </Routes>
    </Router>
  );
}

export default App;
