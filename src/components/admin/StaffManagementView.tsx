// ============================================================
// Component — Staff Accounts Management (Owner-Only)
// ============================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { authService } from '../../services/auth';
import type { User, StaffRole } from '../../types/auth';
import { Modal } from '../ui/Modal';
import {
  Users,
  UserPlus,
  Search,
  KeyRound,
  Shield,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Copy,
} from 'lucide-react';

export const StaffManagementView: React.FC = () => {
  const { currentUser, isOwner } = useAuth();
  const { showToast } = useOverlay();

  const [staffList, setStaffList] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal "+ Tambah Staf"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addRole, setAddRole] = useState<StaffRole>('staf');
  const [addPassword, setAddPassword] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  // Modal "Edit Staf"
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<StaffRole>('staf');
  const [editIsActive, setEditIsActive] = useState(true);

  // Temporary password display on screen
  const [resetModalStaff, setResetModalStaff] = useState<User | null>(null);
  const [tempPasswordOnScreen, setTempPasswordOnScreen] = useState<string | null>(null);

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      const list = await authService.getStaffAccounts(searchQuery);
      setStaffList(list);
    } catch {
      showToast('Gagal memuat akun staf.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [searchQuery]);

  if (!isOwner || !currentUser) {
    return (
      <div className="p-8 text-center text-muted font-sans text-sm bg-surface border border-line">
        Hanya akun dengan peran <strong>Owner</strong> yang dapat mengakses dan mengelola akun staf.
      </div>
    );
  }

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    try {
      await authService.createStaffAccount(
        {
          name: addName,
          email: addEmail,
          phone: addPhone,
          role: addRole,
          initialPassword: addPassword,
        },
        currentUser
      );
      showToast(`Akun staf ${addName} (${addRole}) berhasil dibuat.`);
      setIsAddModalOpen(false);
      setAddName('');
      setAddEmail('');
      setAddPhone('');
      setAddPassword('');
      loadStaff();
    } catch (err: any) {
      setAddError(err.message || 'Gagal membuat akun staf.');
    }
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    try {
      await authService.updateStaffAccount(
        {
          id: editingStaff.id,
          role: editRole,
          isActive: editIsActive,
        },
        currentUser
      );
      showToast('Data staf berhasil diperbarui.');
      setEditingStaff(null);
      loadStaff();
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui staf.');
    }
  };

  const handleResetPassword = async (staff: User) => {
    try {
      const tempPass = await authService.resetStaffPassword(staff.id, currentUser);
      setResetModalStaff(staff);
      setTempPasswordOnScreen(tempPass);
      showToast('Kata sandi sementara berhasil dibuat.');
    } catch (err: any) {
      showToast(err.message || 'Gagal mereset kata sandi.');
    }
  };

  const handleDeleteStaff = async (staff: User) => {
    if (window.confirm(`Yakin ingin menghapus akun staf "${staff.name}" (${staff.role})? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await authService.deleteStaffAccount(staff.id, currentUser);
        showToast('Akun staf berhasil dihapus.');
        loadStaff();
      } catch (err: any) {
        showToast(err.message || 'Gagal menghapus akun staf.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-charcoal text-2xl font-light m-0">
            Manajemen Akun Staf & Hak Akses
          </h2>
          <p className="text-xs text-muted font-sans m-0 mt-0.5">
            Kelola peran pengguna back-office: Owner, Admin, dan Staf operasional.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setAddError(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <UserPlus size={14} /> Tambah Staf Baru
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Cari nama, surel, atau peran..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-line text-sm text-ink bg-white rounded-[2px] focus:outline-none focus:border-charcoal font-sans"
        />
        <Search size={15} className="absolute left-3 top-2.5 text-muted" />
      </div>

      {/* Staff Table */}
      <div className="border border-line bg-white rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-surface border-b border-line text-[11px] uppercase tracking-wider text-muted">
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Surel & Kontak</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Terdaftar</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    Tidak ada akun staf yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                staffList.map((st) => (
                  <tr key={st.id} className="hover:bg-surface/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-charcoal">{st.name}</div>
                      {st.id === currentUser.id && (
                        <span className="text-[10px] text-caramel-deep font-sans tracking-wider uppercase font-medium">
                          (Akun Anda)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-ink">{st.email}</div>
                      <div className="text-muted text-[11px]">{st.phone || '-'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] uppercase font-sans tracking-widest rounded-[2px] ${
                          st.role === 'owner'
                            ? 'bg-charcoal text-white font-medium'
                            : st.role === 'admin'
                            ? 'bg-indigo text-white font-medium'
                            : 'bg-surface text-ink border border-line'
                        }`}
                      >
                        {st.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-sans ${
                          st.isActive ? 'text-status-available font-medium' : 'text-status-occupied'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${st.isActive ? 'bg-status-available' : 'bg-status-occupied'}`} />
                        {st.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-muted">
                      {new Date(st.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStaff(st);
                            setEditRole(st.role as StaffRole);
                            setEditIsActive(st.isActive);
                          }}
                          className="p-1 text-muted hover:text-charcoal rounded-[2px]"
                          title="Ubah Peran / Status"
                        >
                          <Edit2 size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResetPassword(st)}
                          className="p-1 text-muted hover:text-caramel-deep rounded-[2px]"
                          title="Reset Kata Sandi"
                        >
                          <KeyRound size={13} />
                        </button>

                        {/* Only allow delete if not self */}
                        {st.id !== currentUser.id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(st)}
                            className="p-1 text-muted hover:text-status-occupied rounded-[2px]"
                            title="Hapus Akun"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Staf */}
      {isAddModalOpen && (
        <Modal
          id="modal-add-staff"
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Tambah Akun Staf Baru"
          maxWidth="md"
        >
          <form onSubmit={handleCreateStaff} className="space-y-4">
            {addError && (
              <div className="p-3 bg-status-occupied/10 border border-status-occupied/30 text-status-occupied text-xs flex items-center gap-2 rounded-[2px]">
                <AlertCircle size={14} />
                <span>{addError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Misal: Siti Nurhaliza"
                className="w-full px-3 py-2 border border-line text-sm text-ink bg-white rounded-[2px]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                Alamat Surel
              </label>
              <input
                type="email"
                required
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                placeholder="nama@reamanda.com"
                className="w-full px-3 py-2 border border-line text-sm text-ink bg-white rounded-[2px]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                Nomor WhatsApp / HP
              </label>
              <input
                type="tel"
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                placeholder="0812..."
                className="w-full px-3 py-2 border border-line text-sm text-ink bg-white rounded-[2px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                  Peran (Role)
                </label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value as StaffRole)}
                  className="w-full px-3 py-2 border border-line text-sm text-ink bg-white rounded-[2px]"
                >
                  <option value="staf">Staf (Pesanan & Inquiries)</option>
                  <option value="admin">Admin (Konten, Produk & Pesanan)</option>
                  <option value="owner">Owner (Akses Penuh & Staf)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                  Kata Sandi Awal
                </label>
                <input
                  type="password"
                  required
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3 py-2 border border-line text-sm text-ink bg-white rounded-[2px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px] transition-colors"
            >
              Simpan & Daftarkan Staf
            </button>
          </form>
        </Modal>
      )}

      {/* Modal Edit Staf */}
      {editingStaff && (
        <Modal
          id="modal-edit-staff"
          isOpen={Boolean(editingStaff)}
          onClose={() => setEditingStaff(null)}
          title={`Sunting Staf — ${editingStaff.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleUpdateStaff} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                Peran Pengguna
              </label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as StaffRole)}
                className="w-full px-3 py-2 border border-line text-sm text-ink bg-white rounded-[2px]"
              >
                <option value="staf">Staf (Pesanan & Inquiries)</option>
                <option value="admin">Admin (Konten, Produk & Pesanan)</option>
                <option value="owner">Owner (Akses Penuh & Staf)</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-ink">
                <input
                  type="checkbox"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="rounded border-line text-charcoal focus:ring-0"
                />
                <span>Status Akun Aktif</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px]"
            >
              Simpan Perubahan
            </button>
          </form>
        </Modal>
      )}

      {/* Modal Reset Password (shows temporary password once on screen) */}
      {resetModalStaff && tempPasswordOnScreen && (
        <Modal
          id="modal-reset-staff-pass"
          isOpen={Boolean(tempPasswordOnScreen)}
          onClose={() => {
            setResetModalStaff(null);
            setTempPasswordOnScreen(null);
          }}
          title="Kata Sandi Sementara Dibuat"
          maxWidth="md"
        >
          <div className="space-y-4">
            <p className="text-xs text-muted font-sans m-0">
              Kata sandi sementara untuk staf <strong>{resetModalStaff.name}</strong> berhasil dibuat. Harap salin dan berikan kepada yang bersangkutan.
            </p>

            <div className="p-4 bg-surface border border-line text-center rounded-[2px] space-y-1">
              <span className="text-[11px] uppercase font-sans tracking-wider text-muted block">
                Kata Sandi Sementara:
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl font-bold text-charcoal tracking-wider">
                  {tempPasswordOnScreen}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(tempPasswordOnScreen);
                    showToast('Kata sandi disalin ke papan klip.');
                  }}
                  className="p-1.5 border border-line bg-white hover:bg-surface-2 rounded-[2px]"
                  title="Salin Sandi"
                >
                  <Copy size={13} />
                </button>
              </div>
              <span className="text-[10px] text-muted block">
                Staf dapat langsung menggunakannya untuk masuk dan menggantinya di profil akun.
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setResetModalStaff(null);
                setTempPasswordOnScreen(null);
              }}
              className="w-full py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px]"
            >
              Tutup
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
