import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import { useAuth } from './context/AuthContext'; 

// All your pages
import Home from './pages/Home';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import AddCourse from './pages/AddCourse';
import AdminPanel from './pages/AdminPanel';
import StudentProgress from './pages/StudentProgress';
import AIDoubtChat from './pages/AIDoubtChat';
import ProtectedRoute from './components/ProtectedRoute'; 
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails';
import DoubtSolver from './components/DoubtSolver';



const App = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route
          path="/teacher/add"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <AddCourse />
            </ProtectedRoute>
          }
        />
       <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
<Route
  path="/teacher/dashboard"
  element={
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/progress"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentProgress />
    </ProtectedRoute>
  }
/>
<Route
  path="/ask-ai"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <DoubtSolver />
    </ProtectedRoute>
  }
/>
      </Routes>
    </>
  );
};

export default App;
