import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Edit2, Check, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, updateSettings, isEditMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(settings.announcement);

  const handleSave = () => {
    if (editText.trim()) {
      updateSettings({ announcement: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(settings.announcement);
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-charcoal text-white h-10 border-b border-line/20 select-none">
      <div className="site-container h-full flex items-center justify-center relative">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full max-w-xl px-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-white/10 text-white text-[11px] uppercase tracking-[0.18em] px-2 py-1 border border-white/30 focus:border-white focus:outline-none"
              style={{ borderRadius: '2px' }}
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-1 hover:bg-white/20 text-white"
              title="Simpan"
            >
              <Check size={14} className="stroke-[1.5]" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-white/20 text-white/70"
              title="Batal"
            >
              <X size={14} className="stroke-[1.5]" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 overflow-hidden px-4 w-full text-center">
            <p className="text-white text-xs uppercase tracking-[0.18em] font-sans truncate m-0">
              {settings.announcement}
            </p>
            {isEditMode && (
              <button
                onClick={() => {
                  setEditText(settings.announcement);
                  setIsEditing(true);
                }}
                className="text-white/60 hover:text-white p-1 ml-1 shrink-0"
                title="Edit teks pengumuman"
              >
                <Edit2 size={12} className="stroke-[1.25]" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
