import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";

function App() {

  const [authUser] = useAuthState(auth);

  return (
    <PageLayout>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/auth' />} />
        <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to='/' />} />
        <Route path='/:username' element={<ProfilePage />} />
      </Routes>
    </PageLayout>
  );
}

export default App;


// 기본 세팅
// 로그인 페이지, AuthForm
// 홈페이지 만들기전 모든 화면에 있는 사이드바 생성