// ============================================================
// Component — AnnouncementBar with Inline Editable Text
// ============================================================
import React from 'react';
import { EditableText } from '../cms/EditableText';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="hidden sm:block w-full bg-charcoal text-white h-10 border-b border-line/20 select-none">
      <div className="site-container h-full flex items-center justify-center relative text-center">
        <div className="text-white text-sm font-medium tracking-[0.02em] font-sans truncate m-0">
          <EditableText
            contentKey="announcement.group.text"
            defaultText="TUMBUH DENGAN TUJUAN · MELAYANI DENGAN HATI"
          />
        </div>
      </div>
    </div>
  );
};
