import { createContext, useState } from 'react';
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
import AliasPage from './pages/AliasPage';
import BannedPage from './pages/BannedPage';
import BannedAliasPage from './pages/BannedAliasPage';
import CorruptedDbPage from './pages/CorruptedDbPage';
import UninitializedUserStatusPage from './pages/UninitializedUserStatusPage';

type UserCacheType = {
  isPhoney: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  email: string;
  canonicalEmail: string;
  userId: string;
};

type UserContextType = {
  userCache: UserCacheType;
  setUserCache: React.Dispatch<React.SetStateAction<UserCacheType>>;
};

const bogusUserInfo = {
  isPhoney: true,
  isAdmin: false,
  isSuperAdmin: false,
  email: "canonicalBogusEmail+123@gmail.com",
  canonicalEmail: "canonicalBogusEmail@gmail.com",
  userId: "dsoowr989rhsfaflweru_BOGUS"
};

export const UserContext = createContext<UserContextType>({
  userCache: bogusUserInfo,
  setUserCache: () => {}, // This will be replaced by the real setter in the provider
});

function App() {
  const [ userCache, setUserCache ] = useState(bogusUserInfo);
  const combinedStateAndSetter = { userCache, setUserCache };
  console.log("In App, userCache=", userCache);

  return (
    <UserContext.Provider value={combinedStateAndSetter}> {/* Placeholder value */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
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
        </Routes>
      </Router>
      </UserContext.Provider>
  );
}

export default App;
