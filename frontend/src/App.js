import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// Pages
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import PoemDetail from "./pages/PoemDetail";
import CreatePoem from "./pages/CreatePoem";
import MyPoems from "./pages/MyPoems";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    {children}
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/*  PUBLIC ROUTES  */}
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />

        <Route
          path="/feed"
          element={
            <Layout>
              <Feed />
            </Layout>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public view of a specific poem */}
        <Route
          path="/poem/:id"
          element={
            <Layout>
              <PoemDetail />
            </Layout>
          }
        />

        {/* Public view of another user's profile */}
        <Route
          path="/profile/:userId"
          element={
            <Layout>
              <UserProfile />
            </Layout>
          }
        />
        <Route element={<ProtectedRoute />}>
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
