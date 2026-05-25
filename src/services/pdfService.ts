import jsPDF from 'jspdf';
import type { ServiceRequest, Village } from '../types/app';
import { formatDate } from '../utils/formatDate';

interface GenerateOptions {
  request: ServiceRequest;
  village: Village;
  letterNumber?: string;
  documentDate?: string;
  fullData?: Partial<{
    nik: string;
    kk_number: string;
    birth_place: string;
    birth_date: string;
    gender: string;
    address: string;
    hamlet: string;
    rt: string;
    rw: string;
  }>;
}

/**
 * Generate official letter PDF dengan kop surat desa.
 * Output: download otomatis sebagai file PDF.
 */
export function generateServiceLetterPDF({
  request,
  village,
  letterNumber,
  documentDate,
  fullData,
}: GenerateOptions): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Kop Surat — Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PEMERINTAH KABUPATEN ' + village.regency.toUpperCase(), pageWidth / 2, 20, { align: 'center' });
  doc.text('KECAMATAN ' + village.district.toUpperCase(), pageWidth / 2, 27, { align: 'center' });
  doc.setFontSize(16);
  doc.text(village.name.toUpperCase(), pageWidth / 2, 35, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(village.address, pageWidth / 2, 41, { align: 'center', maxWidth: pageWidth - margin * 2 });
  if (village.phone || village.email) {
    const contact = [village.phone, village.email].filter(Boolean).join(' · ');
    doc.text(contact, pageWidth / 2, 46, { align: 'center' });
  }

  // Garis pemisah kop surat
  doc.setLineWidth(0.7);
  doc.line(margin, 50, pageWidth - margin, 50);
  doc.setLineWidth(0.3);
  doc.line(margin, 51.5, pageWidth - margin, 51.5);

  // Judul surat
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const serviceName = (request.service_name ?? 'SURAT KETERANGAN').toUpperCase();
  doc.text(serviceName, pageWidth / 2, 62, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const nomor = letterNumber ?? `${request.tracking_code}/${new Date().getFullYear()}`;
  doc.text(`Nomor: ${nomor}`, pageWidth / 2, 68, { align: 'center' });

  // Garis bawah judul
  const titleWidth = doc.getTextWidth(serviceName);
  doc.line(pageWidth / 2 - titleWidth / 2, 64, pageWidth / 2 + titleWidth / 2, 64);

  // Body
  let y = 80;
  doc.setFontSize(11);
  doc.text(
    `Yang bertanda tangan di bawah ini, Kepala ${village.name}, Kecamatan ${village.district}, Kabupaten ${village.regency}, dengan ini menerangkan bahwa:`,
    margin,
    y,
    { maxWidth: pageWidth - margin * 2, align: 'justify' }
  );
  y += 18;

  // Data warga
  const fields: Array<[string, string]> = [
    ['Nama', request.citizen_name],
    ...(fullData?.nik ? [['NIK', fullData.nik] as [string, string]] : []),
    ...(fullData?.kk_number ? [['No. KK', fullData.kk_number] as [string, string]] : []),
    ...(fullData?.birth_place && fullData?.birth_date
      ? [['Tempat/Tgl. Lahir', `${fullData.birth_place}, ${formatDate(fullData.birth_date)}`] as [string, string]]
      : []),
    ...(fullData?.gender ? [['Jenis Kelamin', fullData.gender] as [string, string]] : []),
    ...(fullData?.address
      ? [['Alamat', `${fullData.address}${fullData.rt ? `, RT ${fullData.rt}` : ''}${fullData.rw ? `/RW ${fullData.rw}` : ''}${fullData.hamlet ? `, Dusun ${fullData.hamlet}` : ''}`] as [string, string]]
      : []),
  ];

  fields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin + 5, y);
    doc.text(':', margin + 50, y);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value, pageWidth - margin * 2 - 60);
    doc.text(lines, margin + 55, y);
    y += 6 * lines.length;
  });

  y += 4;

  // Keperluan
  doc.text(
    `Adalah benar warga ${village.name} yang bersangkutan memerlukan surat keterangan ini untuk keperluan: ${request.purpose}.`,
    margin,
    y,
    { maxWidth: pageWidth - margin * 2, align: 'justify' }
  );
  y += 14;

  doc.text(
    `Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.`,
    margin,
    y,
    { maxWidth: pageWidth - margin * 2, align: 'justify' }
  );
  y += 20;

  // Tanda tangan
  const dateStr = formatDate(documentDate ?? new Date().toISOString());
  const signX = pageWidth - margin - 65;
  doc.text(`${village.name}, ${dateStr}`, signX, y);
  y += 6;
  doc.text(`Kepala ${village.name}`, signX, y);
  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.text('( ........................................ )', signX, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y += 5;
  doc.text('NIP. -', signX, y);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    `Dokumen ini dikeluarkan melalui sistem AksesDesa · Kode tracking: ${request.tracking_code}`,
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  // Simpan
  const filename = `${request.tracking_code}_${request.citizen_name.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
