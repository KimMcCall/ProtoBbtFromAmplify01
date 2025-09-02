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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/sketch" element={<SketchPage />} />
        <Route
          path="/suggestion"
          element={
            <ProtectedRoute>
              <SuggestionPage />
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
