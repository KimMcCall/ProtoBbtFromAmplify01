import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import ProfilePage from "./pages/ProfilePage";
import Todos from "./pages/Todos";
import PublicPage01 from "./pages/PublicPage01";
import PublicPage02 from "./pages/PublicPage02";
import SketchPage from "./pages/printing/SketchPage";
import SuggestionPage from "./pages/SuggestionsPage";
import ProtectedPage01 from "./pages/ProtectedPage01";
import ProtectedPage02 from "./pages/ProtectedPage02";
import MissionPage from './pages/MissionPage';
import DonatePage from './pages/DonatePage';
import FinancesPage from './pages/FinancesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/public01" element={<PublicPage01 />} />
        <Route path="/public02" element={<PublicPage02 />} />
        <Route path="/sketch" element={<SketchPage />} />
        <Route
          path="/suggestion"
          element={
            <ProtectedRoute>
              <SuggestionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/protected01"
          element={
            <ProtectedRoute>
              <ProtectedPage01 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/protected02"
          element={
            <ProtectedRoute>
              <ProtectedPage02 />
            </ProtectedRoute>
          }
        />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/finances" element={<FinancesPage />} />
        <Route path="/donate" element={<DonatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
