import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoute";
import Todos from "./pages/Todos";
import LoginPage from "./pages/LoginPage";
import PublicPage01 from "./pages/PublicPage01";
import PublicPage02 from "./pages/PublicPage02";
import ProtectedPage01 from "./pages/ProtectedPage01";
import ProtectedPage02 from "./pages/ProtectedPage02";

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Todos />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/public01" element={<PublicPage01 />} />
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

          <Route path="public02" element={<PublicPage02 />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
