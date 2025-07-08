import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import AllTasksPage from '@/components/pages/AllTasksPage';
import TodayPage from '@/components/pages/TodayPage';
import UpcomingPage from '@/components/pages/UpcomingPage';
import ListPage from '@/components/pages/ListPage';
import ArchivePage from '@/components/pages/ArchivePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<TodayPage />} />
            <Route path="/all-tasks" element={<AllTasksPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/upcoming" element={<UpcomingPage />} />
            <Route path="/list/:listId" element={<ListPage />} />
            <Route path="/archive" element={<ArchivePage />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </Router>
  );
}

export default App;