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
      'Role': 'mahasiswa',
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
  ];
  exportToExcel([{ sheetName: 'Template Import Akun', data: templateData }], 'Template_Import_Akun_SIAKAL');
}

export function downloadMahasiswaBiodataTemplate() {
  const templateData = [
    {
      'NIM': '2026001',
      'Nama Lengkap': 'Ahmad Fauzi',
      'Program Studi': 'D3 Permesinan Kapal',
      'Angkatan': 2026,
      'Status Akademik': 'Aktif',
      'Tempat Lahir': 'Palembang',
      'Tanggal Lahir': '2004-05-14',
      'Jenis Kelamin': 'Laki-laki',
      'Agama': 'Islam',
      'NIK (KTP)': '1671011405040001',
      'NISN': '0041234567',
      'NPWP': '92.123.456.7-301.000',
      'Email': 'fauzi@mhs.poltek.ac.id',
      'No HP': '081234567890',
      'Jalan': 'Jl. Merdeka No. 45',
      'Dusun': 'Dusun II',
      'RT': '002',
      'RW': '001',
      'Kelurahan': 'Bukit Kecil',
      'Kecamatan': 'Ilir Barat I',
      'Kode Pos': '30135',
      'Alat Transportasi': 'Sepeda motor',
      'Status Tempat Tinggal': 'Bersama orang tua',
      'Nama Ayah': 'Herman Prasetyo',
      'NIK Ayah': '1671011002750002',
      'Tanggal Lahir Ayah': '1975-02-10',
      'Pendidikan Ayah': 'S1 / D4',
      'Pekerjaan Ayah': 'Wiraswasta',
      'Penghasilan Ayah': 'Rp. 5,000,000 - Rp. 20,000,000',
      'Nama Ibu': 'Siti Rahmah',
      'NIK Ibu': '1671011508780003',
      'Tanggal Lahir Ibu': '1978-08-15',
      'Pendidikan Ibu': 'SMA / SMK',
      'Pekerjaan Ibu': 'Wirausaha',
      'Penghasilan Ibu': 'Rp. 2,000,000 - Rp. 4,999,999',
    },
  ];
  exportToExcel([{ sheetName: 'Biodata Mahasiswa Lengkap', data: templateData }], 'Template_Biodata_Mahasiswa_Lengkap_32_Item');
}
