import * as XLSX from 'xlsx';

export function readExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

export function exportToExcel(sheetsData: { sheetName: string; data: any[] }[], filename: string) {
  const workbook = XLSX.utils.book_new();
  sheetsData.forEach(({ sheetName, data }) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31));
  });
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function downloadUserImportTemplate() {
  const templateData = [
    {
      'Nama Lengkap': 'Ahmad Fauzi',
      'Email': 'fauzi@mhs.poltek.ac.id',
      'Username/NIM/NIP': '2101034',
      'Password Initial': 'SIAKAL2026!',
      'Role': 'mahasiswa', // admin, mahasiswa, dosen, pembimbing_lapangan, alumni, unit_approver
      'Prodi': 'Studi Nautika',
      'Angkatan': 2023,
    },
    {
      'Nama Lengkap': 'Capt. Budi Santoso, M.Mar.',
      'Email': 'budi@dosen.poltek.ac.id',
      'Username/NIM/NIP': '198503152010121002',
      'Password Initial': 'Dosen2026!',
      'Role': 'dosen',
      'Prodi': 'Studi Nautika',
      'Angkatan': '',
    },
    {
      'Nama Lengkap': 'Unit Perpustakaan',
      'Email': 'perpus@poltek.ac.id',
      'Username/NIM/NIP': 'UNIT-PERPUS-03',
      'Password Initial': 'Perpus2026!',
      'Role': 'unit_approver',
      'Prodi': '',
      'Angkatan': '',
    },
  ];
  exportToExcel([{ sheetName: 'Template Import Akun', data: templateData }], 'Template_Import_Akun_SIAKAL');
}
