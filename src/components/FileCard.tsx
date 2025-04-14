import React, { useState } from 'react';
import { Pencil, Save, Tag } from 'lucide-react';

export interface FileItem {
  id: string;
  name: string;
  themes: string[];
  category?: string;
  url: string;
  created_at: string;
}

interface FileCardProps {
  file: FileItem;
  onUpdate: (id: string, newName: string, newThemes: string[]) => Promise<void>;
}

const FileCard: React.FC<FileCardProps> = ({ file, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(file.name);
  const [tempThemes, setTempThemes] = useState<string[]>(file.themes);

  const toggleTheme = (theme: string) => {
    setTempThemes((prev) =>
      prev.includes(theme)
        ? prev.filter((t) => t !== theme)
        : [...prev, theme]
    );
  };

  const handleSave = async () => {
    if (tempName.trim() === '') {
      alert("Le nom du fichier ne peut pas être vide.");
      return;
    }
    await onUpdate(file.id, tempName, tempThemes);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col gap-3">
      {isEditing ? (
        <>
          <div className="flex gap-2 items-center">
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
              autoFocus
            />
            <button
              onClick={handleSave}
              className="text-white bg-[#FFC72C] hover:bg-yellow-400 rounded px-2 py-1 flex items-center gap-1"
            >
              <Save size={16} />
              Enregistrer
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {file.themes.map((theme) => (
              <button
                key={theme}
                onClick={() => toggleTheme(theme)}
                className={`px-3 py-1 rounded-full text-xs transition-colors
                  ${tempThemes.includes(theme)
                    ? 'bg-[#FFC72C] text-black shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Tag size={12} className="mr-1" />
                {theme}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 text-sm break-all">
              {file.name}
            </h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Pencil size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {file.themes.map(theme => (
              <span
                key={theme}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#FFC72C]/20 text-black"
              >
                <Tag size={12} className="mr-1" />
                {theme}
              </span>
            ))}
          </div>
        </>
      )}
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center text-sm text-[#000000] hover:text-[#FFC72C]"
      >
        Télécharger
      </a>
    </div>
  );
};

export default FileCard;