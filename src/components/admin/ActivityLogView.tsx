// ============================================================
// Component — Activity & Audit Log View (Filterable Staff Audit Trail)
// ============================================================
import React, { useState, useEffect } from 'react';
import { getActivityLogs, type ActivityLog } from '../../services/activity';
import {
  Activity,
  Search,
  Filter,
  User,
  Clock,
  Shield,
  FileText,
} from 'lucide-react';

export const ActivityLogView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('all');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  const loadLogs = () => {
    const list = getActivityLogs({
      query: searchQuery,
      entityType: entityTypeFilter,
      userRole: userRoleFilter,
    });
    setLogs(list);
  };

  useEffect(() => {
    loadLogs();
  }, [searchQuery, entityTypeFilter, userRoleFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-line">
        <h2 className="font-serif text-charcoal text-2xl font-light m-0">Log Aktivitas & Audit Jejak</h2>
        <p className="text-xs text-muted font-sans m-0 mt-0.5">
          Catatan riwayat lengkap (siapa, apa, kapan, serta perubahan nilai sebelum dan sesudah) untuk seluruh operasi staf back-office.
        </p>
      </div>

      {/* Filter Strip */}
      <div className="p-4 bg-white border border-line rounded-[2px] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari aktivitas atau nama staf..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-line rounded-[2px] text-xs bg-white focus:outline-none focus:border-charcoal"
          />
          <Search size={14} className="absolute left-2.5 top-2 text-muted" />
        </div>

        <select
          value={entityTypeFilter}
          onChange={(e) => setEntityTypeFilter(e.target.value)}
          className="w-full px-2.5 py-1.5 border border-line rounded-[2px] text-xs bg-white text-ink"
        >
          <option value="all">Semua Tipe Entitas</option>
          <option value="product">Produk</option>
          <option value="order">Pesanan</option>
          <option value="content">Konten CMS</option>
          <option value="user">Pengguna & Staf</option>
          <option value="property">Properti</option>
          <option value="catering">Katering</option>
          <option value="auth">Autentikasi & Sesi</option>
          <option value="settings">Pengaturan</option>
        </select>

        <select
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value)}
          className="w-full px-2.5 py-1.5 border border-line rounded-[2px] text-xs bg-white text-ink"
        >
          <option value="all">Semua Peran Staf</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="staf">Staf</option>
          <option value="customer">Pelanggan</option>
        </select>
      </div>

      {/* Log Feed */}
      <div className="border border-line bg-white rounded-[2px] divide-y divide-line/60">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-muted font-sans text-xs">
            Belum ada aktivitas yang tercatat sesuai filter.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-surface/30 transition-colors space-y-2 text-xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-charcoal font-sans">{log.userName}</span>
                  <span className="text-[10px] uppercase font-sans tracking-wider px-1.5 py-0.2 bg-surface text-muted border border-line rounded-xs">
                    {log.userRole}
                  </span>
                  <span className="text-muted text-[11px]">→ {log.action}</span>
                </div>

                <div className="flex items-center gap-1.5 text-muted text-[11px]">
                  <Clock size={12} />
                  <span>
                    {new Date(log.timestamp).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <p className="text-ink m-0">{log.details}</p>

              {/* Before and After States display */}
              {(log.beforeState || log.afterState) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] font-mono">
                  {log.beforeState && (
                    <div className="p-2 bg-surface border border-line rounded-xs text-muted">
                      <span className="font-sans text-[10px] uppercase text-muted block mb-0.5">Sebelum:</span>
                      <pre className="m-0 whitespace-pre-wrap">{JSON.stringify(log.beforeState, null, 2)}</pre>
                    </div>
                  )}
                  {log.afterState && (
                    <div className="p-2 bg-surface border border-line rounded-xs text-charcoal">
                      <span className="font-sans text-[10px] uppercase text-status-available block mb-0.5 font-medium">Sesudah:</span>
                      <pre className="m-0 whitespace-pre-wrap">{JSON.stringify(log.afterState, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
