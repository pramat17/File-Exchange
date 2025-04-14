import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import HomePage from './pages/HomePage.tsx';
import UploadPage from './pages/UploadPage.tsx';
import FileListPage from './pages/FileListPage.tsx';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8D0] to-[#FFFFFF]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/files" element={<FileListPage />} />
          {/* Route pour filtrer par catégorie */}
          <Route path="/category/:category" element={<FileListPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;