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

  Object.entries(modulesData).forEach(([moduleName, data]) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data.length > 0 ? data : [{ Info: 'Tidak ada data untuk periode ini' }]);
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
}
