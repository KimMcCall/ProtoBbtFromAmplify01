import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import Todos from "./pages/Todos";
import PublicPage01 from "./pages/PublicPage01";
import PublicPage02 from "./pages/PublicPage02";
import SketchPage from "./pages/SketchPage";
import ProtectedPage01 from "./pages/ProtectedPage01";
import ProtectedPage02 from "./pages/ProtectedPage02";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/public01" element={<PublicPage01 />} />
        <Route path="/public02" element={<PublicPage02 />} />
        <Route path="/sketch" element={<SketchPage />} />
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
      </Routes>
    </Router>
  );
}

export default App;
