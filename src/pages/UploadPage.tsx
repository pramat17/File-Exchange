import React from 'react';
import FileUpload from '../components/FileUpload';

const UploadPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Téléversement de Fichiers</h2>
      <FileUpload />
    </div>
  );
};

export default UploadPage;