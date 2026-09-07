import JSZip from 'jszip';
import * as XLSX from 'xlsx';

export async function createAcademicArchiveZip(
  academicYear: string,
  semester: string,
  modulesData: { [key: string]: any[] }
) {
  const zip = new JSZip();
  const folderName = `SIAKAL_Arsip_${academicYear.replace('/', '-')}_${semester}`;
  const folder = zip.folder(folderName);
  const rawDatabase = JSON.stringify({ academicYear, semester, exportedAt: new Date().toISOString(), collections: modulesData }, null, 2);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawDatabase));
  const checksum = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');

  folder?.file('database.json', rawDatabase);
  folder?.file('integrity.txt', `SHA-256 database.json: ${checksum}\n`);

  Object.entries(modulesData).forEach(([moduleName, data]) => {
    const workbook = XLSX.utils.book_new();
    const spreadsheetData = data.map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [
      key,
      typeof value === 'string' && value.startsWith('data:') ? '[Dokumen tersimpan di database.json]' : typeof value === 'object' ? JSON.stringify(value) : value,
    ])));
    const worksheet = XLSX.utils.json_to_sheet(spreadsheetData.length > 0 ? spreadsheetData : [{ Info: 'Tidak ada data untuk periode ini' }]);
    XLSX.utils.book_append_sheet(workbook, worksheet, moduleName);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    folder?.file(`${moduleName}.xlsx`, excelBuffer);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const element = document.createElement('a');
  element.href = URL.createObjectURL(content);
  element.download = `${folderName}.zip`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
}
