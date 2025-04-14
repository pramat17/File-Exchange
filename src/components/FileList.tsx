import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import FileCard, { FileItem } from './FileCard';

interface FileListProps {
  filterCategory: string | null;
}

const FileList: React.FC<FileListProps> = ({ filterCategory }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const loadFiles = async () => {
    let query = supabase.from('shared_files').select('*');
    if (activeFilter) {
      query = query.contains('themes', [activeFilter]);
    }
    if (filterCategory) {
      query = query.eq('category', filterCategory);
    }
    const { data } = await query.order('created_at', { ascending: false });
    if (data) {
      setFiles(data);
    }
  };

  const handleUpdateFile = async (id: string, newName: string, newThemes: string[]) => {
    const { error } = await supabase
      .from('shared_files')
      .update({ name: newName, themes: newThemes })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la mise à jour :', error);
      alert(`Impossible de mettre à jour : ${error.message}`);
      return;
    }
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName, themes: newThemes } : f))
    );
  };

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, filterCategory]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Fichiers partagés</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors
              ${!activeFilter ? 'bg-[#FFC72C] text-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            Tous
          </button>
          {['Séance complète', 'FIO', 'FID', 'Surnombre', 'Rotation Def'].map(theme => (
            <button
              key={theme}
              onClick={() => setActiveFilter(theme)}
              className={`px-3 py-1 rounded-full text-sm transition-colors
                ${activeFilter === theme ? 'bg-[#FFC72C] text-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {files.map(file => (
          <FileCard key={file.id} file={file} onUpdate={handleUpdateFile} />
        ))}
      </div>
    </div>
  );
};

export default FileList;