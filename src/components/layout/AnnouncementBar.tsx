// ============================================================
// Component — AnnouncementBar with Inline Editable Text
// ============================================================
import React from 'react';
import { EditableText } from '../cms/EditableText';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="w-full bg-charcoal text-white h-10 border-b border-line/20 select-none">
      <div className="site-container h-full flex items-center justify-center relative text-center">
        <div className="text-white text-xs uppercase tracking-[0.18em] font-sans truncate m-0">
          <EditableText
            contentKey="announcement.text"
            defaultText="KOLEKSI RAYA BERSAMA 2025 KINI HADIR · PENGIRIMAN GRATIS KE SELURUH INDONESIA"
          />
        </div>
      </div>
    </div>
  );
};
