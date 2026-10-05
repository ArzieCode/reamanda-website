// ============================================================
// Page — Karier (/karier)
// Job openings list, company culture, application form modal
// ============================================================
import React, { useState } from 'react';
import { Briefcase, MapPin, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const OPENINGS: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Fashion Textile Designer',
    department: 'Kreatif & Desain Busana',
    location: 'Jakarta Selatan',
    type: 'Penuh Waktu (Full-time)',
    description: 'Mengembangkan motif print kain eksklusif, riset palet warna bumi, dan eksplorasi material tenun lokal untuk koleksi musiman.',
  },
  {
    id: 'job-2',
    title: 'Property Investment Analyst',
    department: 'Lini Properti & Hotel',
    location: 'Jakarta Selatan',
    type: 'Penuh Waktu (Full-time)',
    description: 'Menganalisis valuasi aset vila dan residensial lelang, menyusun memorandum investasi, dan memfasilitasi survei investor VIP.',
  },
  {
    id: 'job-3',
    title: 'Executive Chef & Banquet Manager',
    department: 'Lini Katering & Kuliner',
    location: 'Jakarta Selatan / Tangerang',
    type: 'Penuh Waktu (Full-time)',
    description: 'Memimpin operasional dapur katering berskala besar, standardisasi higienitas halal, dan inovasi resep hidangan nusantara.',
  },
  {
    id: 'job-4',
    title: 'Customer Experience & Loyalty Specialist',
    department: 'Layanan Pelanggan & Komunitas',
    location: 'Jakarta Selatan',
    type: 'Penuh Waktu (Full-time)',
    description: 'Mengelola interaksi anggota privilege, aktivasi program poin, dan koordinasi gathering komunitas pecinta mode muslimah.',
  },
];

export default function KarierPage() {
  const { showToast } = useToast();
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone) {
      showToast('Mohon lengkapi nama, email, dan nomor telepon.', 'error');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast(`Lamaran untuk posisi "${selectedJob?.title}" berhasil dikirim. Tim HR kami akan menghubungi Anda!`, 'success');
      setSelectedJob(null);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
      setResumeLink('');
    }, 800);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20 pb-28 md:pb-36">
      <div className="max-w-2xl mb-12">
        <p className="nav-label text-caramel-deep mb-3" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          TUMBUH BERSAMA KAMI
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal leading-tight">
          Karier di RiaMiranda
        </h1>
        <p className="text-sm font-light text-muted mt-3" style={{ fontFamily: 'Jost, sans-serif' }}>
          Bergabunglah bersama keluarga besar RiaMiranda untuk menciptakan karya yang bermakna bagi industri gaya hidup santun di Indonesia.
        </p>
      </div>

      {/* Openings Grid */}
      <div className="space-y-4 mb-16">
        {OPENINGS.map((job) => (
          <div
            key={job.id}
            className="p-6 border border-line bg-bg hover:border-charcoal transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <span className="nav-label text-caramel-deep text-[10px]" style={{ letterSpacing: '0.14em' }}>
                {job.department.toUpperCase()}
              </span>
              <h3 className="font-cormorant font-light text-2xl text-charcoal">
                {job.title}
              </h3>
              <p className="text-xs text-muted font-light leading-relaxed max-w-2xl" style={{ fontFamily: 'Jost, sans-serif' }}>
                {job.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted font-light pt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                <span className="flex items-center gap-1.5"><MapPin size={13} /> {job.location}</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><Briefcase size={13} /> {job.type}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedJob(job)}
              className="nav-label min-h-[44px] px-6 py-3 bg-charcoal text-white hover:opacity-85 transition-opacity whitespace-nowrap self-start md:self-center focus-visible:outline-none"
              style={{ fontSize: '10px', letterSpacing: '0.14em' }}
            >
              LAMAR POSISI INI
            </button>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-charcoal/50 transition-opacity"
            onClick={() => setSelectedJob(null)}
            aria-hidden
          />
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label={`Formulir Lamaran: ${selectedJob.title}`}
          >
            <div
              className="pointer-events-auto w-full max-w-lg bg-bg border border-line p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
                <div>
                  <p className="nav-label text-caramel-deep" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
                    FORMULIR LAMARAN
                  </p>
                  <h3 className="font-cormorant font-light text-2xl text-charcoal">
                    {selectedJob.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-1 hover:opacity-60 focus-visible:outline-none"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-5">
                <div>
                  <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    NAMA LENGKAP *
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="input-underline min-h-[44px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="email@domain.com"
                      className="input-underline min-h-[44px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                      NOMOR WHATSAPP *
                    </label>
                    <input
                      type="tel"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="08123456789"
                      className="input-underline min-h-[44px]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    LINK CV / PORTOFOLIO (GOOGLE DRIVE / LINKEDIN)
                  </label>
                  <input
                    type="url"
                    value={resumeLink}
                    onChange={(e) => setResumeLink(e.target.value)}
                    placeholder="https://..."
                    className="input-underline min-h-[44px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full nav-label min-h-[44px] py-4 bg-charcoal text-white hover:opacity-85 transition-opacity disabled:opacity-50 mt-4 focus-visible:outline-none"
                  style={{ fontSize: '11px', letterSpacing: '0.18em' }}
                >
                  {submitting ? 'MENGIRIMKAN LAMARAN...' : 'KIRIMKAN LAMARAN KERJA'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
