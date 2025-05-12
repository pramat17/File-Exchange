import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabase';
import { FileIcon, Upload } from 'lucide-react';

const THEMES = [
  'Séance complète',
  'Documents Techniques',
  'FIO',
  'FID',
  'Préparation Physique',
  'Jeu Rapide / Surnombre',
  'Défense'
];

const CATEGORIES = [
  'Pepinière',
  'Academie',
  'Fabrique'
];

const FileUpload: React.FC = () => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Compression de l'image si nécessaire.
  const maybeCompressFile = async (file: File): Promise<File> => {
    if (file.type.startsWith('image/')) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedBlob = await imageCompression(file, options);
        return new File([compressedBlob], file.name, { type: compressedBlob.type });
      } catch (err) {
        console.error('Erreur de compression :', err);
        return file;
      }
    }
    return file;
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    if (!selectedCategory) {
      alert('Veuillez sélectionner une catégorie.');
      return;
    }
    if (selectedThemes.length === 0) {
      alert('Veuillez sélectionner au moins un thème.');
      return;
    }

    setIsUploading(true);
    const totalFiles = files.length;
    let uploadedFiles = 0;

    for (const originalFile of Array.from(files)) {
      // 1. Compression si nécessaire.
      const fileToUpload = await maybeCompressFile(originalFile);
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // 2. Téléversement vers Supabase Storage.
      const { error: storageError } = await supabase.storage
        .from('files')
        .upload(fileName, fileToUpload);
      if (storageError) {
        console.error('Erreur lors du téléversement :', storageError);
        alert(`Erreur lors du téléversement de ${originalFile.name} : ${storageError.message}`);
        continue;
      }

      // 3. Récupération de l'URL publique.
      const { data: urlData } = supabase.storage
        .from('files')
        .getPublicUrl(fileName);

      // 4. Insertion dans la table (avec le champ "category").
      const { error: dbError } = await supabase.from('shared_files').insert({
        name: originalFile.name,
        storage_path: fileName,
        themes: selectedThemes,
        category: selectedCategory,
        url: urlData?.publicUrl,
      });

      if (dbError) {
        console.error('Erreur lors de l’enregistrement en base :', dbError);
        alert(`Erreur lors de l’enregistrement de ${originalFile.name} : ${dbError.message}`);
      }

      uploadedFiles++;
      setUploadProgress(Math.round((uploadedFiles / totalFiles) * 100));
    }

    // Réinitialisation après upload.
    setIsUploading(false);
    setUploadProgress(0);
    setSelectedThemes([]);
    setSelectedCategory(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Upload size={24} className="text-[#FFC72C]" />
        Téléverser des fichiers
      </h2>
      
      {/* Sélection de la catégorie */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Sélectionnez une catégorie (requis) :
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-[#FFC72C] text-black shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
        {!selectedCategory && (
          <p className="text-red-500 text-sm mt-2">
            Veuillez sélectionner une catégorie.
          </p>
        )}
      </div>

      {/* Sélection des thèmes */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Sélectionnez un ou plusieurs thèmes (requis) :
        </h3>
        <div className="flex flex-wrap gap-2">
          {THEMES.map(theme => (
            <button
              key={theme}
              onClick={() =>
                setSelectedThemes(prev =>
                  prev.includes(theme)
                    ? prev.filter(t => t !== theme)
                    : [...prev, theme]
                )
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedThemes.includes(theme)
                  ? 'bg-[#FFC72C] text-black shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {theme}
            </button>
          ))}
        </div>
        {selectedThemes.length === 0 && (
          <p className="text-red-500 text-sm mt-2">
            Veuillez sélectionner au moins un thème.
          </p>
        )}
      </div>

      {/* Zone de dépôt (drag & drop) */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragging ? 'border-[#FFC72C] bg-[#FFC72C]/10' : 'border-gray-300 hover:border-[#FFC72C]'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!isUploading) {
            handleFileUpload(e.dataTransfer.files);
          }
        }}
        onClick={() => {
          if (!isUploading) {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = (e) =>
              handleFileUpload((e.target as HTMLInputElement).files);
            input.click();
          }
        }}
      >
        <FileIcon className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-600">
          {isUploading
            ? "Téléversement en cours..."
            : isDragging
              ? "Déposez vos fichiers ici..."
              : "Glissez-déposez vos fichiers ici, ou cliquez pour les sélectionner"
          }
        </p>
      </div>

      {/* Barre de progression */}
      {isUploading && (
        <div className="mt-4">
          <progress value={uploadProgress} max="100" className="w-full"></progress>
          <span>{uploadProgress}%</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;