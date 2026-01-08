import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import PoemDetail from "./pages/PoemDetail";
import CreatePoem from "./pages/CreatePoem";
import MyPoems from "./pages/MyPoems";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Rules from "./pages/Rules";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = ({ children }) => (
  <div className="min-h-screen bg-[#f8f5f2]">
    <Navbar />
    <div className="animate-fadeIn">{children}</div>
  </div>
);

function App() {
  return (
    <Router>
      {/* Toast Notifications Global Setup */}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <Routes>
        {/* --- PUBLIC ROUTES --- */}

        {/* Landing Page */}
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />

        {/* Rules Page */}
        <Route
          path="/rules"
          element={
            <Layout>
              <Rules />
            </Layout>
          }
        />

        {/*  Auth Pages  */}
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        {/* --- PROTECTED ROUTES --- */}
        {/* User must be logged in to access these */}

        <Route element={<ProtectedRoute />}>
          {/* View Poem Details */}
          <Route
            path="/poem/:id"
            element={
              <Layout>
                <PoemDetail />
              </Layout>
            }
          />

          {/* View Other User Profiles */}
          <Route
            path="/profile/:userId"
            element={
              <Layout>
                <UserProfile />
              </Layout>
            }
          />
          {/* Feed (Public) */}
          <Route
            path="/feed"
            element={
              <Layout>
                <Feed />
              </Layout>
            }
          />

          <Route
            path="/create"
            element={
              <Layout>
                <CreatePoem />
              </Layout>
            }
          />

          <Route
            path="/my-poems"
            element={
              <Layout>
                <MyPoems />
              </Layout>
            }
          />

          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
