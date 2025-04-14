import { Link, useNavigate } from 'react-router-dom';
import { FolderUp, Upload } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="bg-[#FFC72C] shadow-lg">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link
          to="/"
          className="text-[#000000] text-3xl font-bold flex items-center gap-2"
        >
          <FolderUp size={32} />
          Hub de Partage
        </Link>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Upload size={20} />
            Téléverser
          </button>
          <button
            onClick={() => navigate('/files')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <FolderUp size={20} />
            Fichiers
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;