import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import ProfilePage from "./pages/ProfilePage";
import Todos from "./pages/Todos";
import SketchPage from "./pages/printing/SketchPage";
import SuggestionPage from "./pages/SuggestionsPage";
import MissionPage from './pages/MissionPage';
import DonatePage from './pages/DonatePage';
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
import AdminUsers from './pages/AdminUsers';
import AdminIssuesPage from './pages/AdminIssuesPage';
import AdminSubmissions from './pages/AdminSubmissionsPage';
import IssuePage from './pages/IssuePage';

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
          path="/suggest"
          element={
            <ProtectedRoute>
              <SuggestionPage />
            </ProtectedRoute>
          }
        />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/finances" element={<FinancesPage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route
          path="/adminUsers"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminIssues"
          element={
            <ProtectedRoute>
              <AdminIssuesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminSubmissions"
          element={
            <ProtectedRoute>
              <AdminSubmissions />
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
