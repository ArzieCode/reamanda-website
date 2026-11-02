export interface ClientPhoto {
  src: string;
  alt: string;
}

// Kurasi dari folder Google Drive yang dibagikan klien. Foto belum dikaitkan
// dengan kamar, menu, paket, harga, atau ketersediaan tertentu.
export const CLIENT_PHOTOS = {
  kost: [
    { src: '/client-photos/polished/kost/kost-23.webp', alt: 'Kamar dengan jendela besar di akomodasi Rheamanda' },
    { src: '/client-photos/polished/kost/kost-21.webp', alt: 'Kamar dengan dinding aksen di akomodasi Rheamanda' },
    { src: '/client-photos/polished/kost/kost-18.webp', alt: 'Kamar bernuansa modern di akomodasi Rheamanda' },
    { src: '/client-photos/polished/kost/kost-02.webp', alt: 'Kamar dengan meja kerja di akomodasi Rheamanda' },
    { src: '/client-photos/polished/kost/kost-26.webp', alt: 'Area duduk semi-terbuka di akomodasi Rheamanda' },
    { src: '/client-photos/polished/kost/kost-24.webp', alt: 'Ruang penerimaan tamu akomodasi Rheamanda' },
    { src: '/client-photos/polished/kost/kost-08.webp', alt: 'Tampak depan bangunan akomodasi Rheamanda' },
    { src: '/client-photos/polished/kost/kost-12.webp', alt: 'Area bersama akomodasi Rheamanda, foto 1' },
    { src: '/client-photos/polished/kost/kost-15.webp', alt: 'Area bersama akomodasi Rheamanda, foto 2' },
    { src: '/client-photos/polished/kost/kost-22.webp', alt: 'Fasilitas kamar mandi akomodasi Rheamanda' },
    { src: '/client-photos/polished/kost/kost-01.webp', alt: 'Kamar akomodasi Rheamanda, foto 1' },
    { src: '/client-photos/polished/kost/kost-04.webp', alt: 'Tampak bangunan akomodasi Rheamanda, foto 1' },
    { src: '/client-photos/polished/kost/kost-09.webp', alt: 'Area dalam akomodasi Rheamanda, foto 1' },
    { src: '/client-photos/polished/kost/kost-19.webp', alt: 'Area dalam akomodasi Rheamanda, foto 2' },
    { src: '/client-photos/polished/kost/kost-20.webp', alt: 'Area dalam akomodasi Rheamanda, foto 3' },
    { src: '/client-photos/polished/kost/kost-27.webp', alt: 'Kamar akomodasi Rheamanda, foto 2' },
    { src: '/client-photos/polished/kost/kost-28.webp', alt: 'Fasilitas akomodasi Rheamanda, foto 2' },
    { src: '/client-photos/polished/kost/kost-29.webp', alt: 'Area dalam akomodasi Rheamanda, foto 4' },
    { src: '/client-photos/polished/kost/kost-30.webp', alt: 'Tampak bangunan akomodasi Rheamanda, foto 2' },
    { src: '/client-photos/polished/kost/kost-31.webp', alt: 'Area luar akomodasi Rheamanda, foto 1' },
    { src: '/client-photos/polished/kost/kost-32.webp', alt: 'Kamar akomodasi Rheamanda, foto 3' },
    { src: '/client-photos/polished/kost/kost-35.webp', alt: 'Area dalam akomodasi Rheamanda, foto 5' },
    { src: '/client-photos/polished/kost/kost-36.webp', alt: 'Area dalam akomodasi Rheamanda, foto 6' },
    { src: '/client-photos/polished/kost/kost-38.webp', alt: 'Tampak bangunan akomodasi Rheamanda, foto 3' },
  ],
  lunchBox: [
    { src: '/client-photos/polished/snack/snack-09.webp', alt: 'Dokumentasi nasi box lengkap dan buah dari klien' },
    { src: '/client-photos/polished/snack/snack-10.webp', alt: 'Dokumentasi sajian lauk dan nasi kotak dari klien' },
    { src: '/client-photos/polished/snack/snack-11.webp', alt: 'Dokumentasi nasi box dan buah dari klien' },
    { src: '/client-photos/polished/lunch/lunch-01.webp', alt: 'Dokumentasi lunch box dari klien' },
  ],
  snackBox: [
    { src: '/client-photos/polished/snack/snack-08.webp', alt: 'Dokumentasi aneka sajian kudapan dari klien' },
    { src: '/client-photos/polished/snack/snack-01.webp', alt: 'Dokumentasi aneka snack box dari klien' },
    { src: '/client-photos/polished/snack/snack-06.webp', alt: 'Dokumentasi buah potong dalam kemasan dari klien' },
    { src: '/client-photos/polished/snack/snack-05.webp', alt: 'Dokumentasi kudapan dalam kemasan dari klien, foto 3' },
    { src: '/client-photos/polished/snack/snack-04.webp', alt: 'Dokumentasi kudapan dalam kemasan dari klien, foto 2' },
    { src: '/client-photos/polished/snack/snack-03.webp', alt: 'Dokumentasi kudapan dalam kemasan dari klien' },
    { src: '/client-photos/polished/snack/snack-07.webp', alt: 'Dokumentasi paket pendamping dan buah dari klien' },
    { src: '/client-photos/polished/snack/snack-02.webp', alt: 'Dokumentasi minuman pendamping dari klien' },
  ],
} satisfies Record<string, ClientPhoto[]>;
