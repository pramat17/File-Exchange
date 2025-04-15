// src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FolderUp } from 'lucide-react';
import logo from '../assets/logo.svg.png';  // Assure-toi que le fichier logo.png est dans src/assets/

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-[#FFC72C] shadow-lg">
      {/* Navbar responsive : en colonne sur mobile, en ligne sur écran md et supérieurs */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        {/* Logo et titre */}
        <Link to="/" className="flex items-center gap-2">
          {/* Affichage du logo personnalisé */}
          <img src={logo} alt="Logo Stade Rochelais" className="h-10 w-auto" />
          <span className="text-xl md:text-2xl font-bold text-black">
            Stade Rochelais - Partage de document technique
          </span>
        </Link>

        {/* Boutons de navigation */}
        <div className="mt-4 md:mt-0 flex gap-4">
          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2 bg-black text-white rounded-lg 
                       hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Upload size={20} />
            Téléverser
          </button>
          <button
            onClick={() => navigate('/files')}
            className="px-4 py-2 bg-black text-white rounded-lg 
                       hover:bg-gray-800 transition-colors flex items-center gap-2"
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