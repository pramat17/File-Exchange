import React from 'react';
import { useParams } from 'react-router-dom';
import FileList from '../components/FileList';

const FileListPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        {category ? `Documents pour ${category}` : 'Tous les fichiers'}
      </h2>
      <FileList filterCategory={category || null} />
    </div>
  );
};

export default FileListPage;