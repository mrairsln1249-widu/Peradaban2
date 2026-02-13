const SPREADSHEET_ID = '1Yz3W9vB9ho7byIqoTuN5PCTsEVuvazRijMuYx-8dS1w';
const SHEET_NAME = 'Pendaftaran';
const HEADERS = [
  'id_pendaftaran',
  'tanggal_submit',
  'waktu_submit',
  'nama_santri',
  'nama_panggilan',
  'tempat_lahir',
  'tanggal_lahir',
  'jenis_kelamin',
  'agama',
  'alamat_santri',
  'no_hp_santri',
  'email_santri',
  'sekolah_asal',
  'kelas_dituju',
  'hobi_bakat',
  'status_ortu',
  'nama_ayah',
  'pekerjaan_ayah',
  'pendidikan_ayah',
  'no_hp_ayah',
  'nama_ibu',
  'pekerjaan_ibu',
  'pendidikan_ibu',
  'no_hp_ibu',
  'email_ortu',
  'alamat_ortu',
  'hubungan_dengan_santri',
  'program_dipilih',
  'tahun_ajaran',
  'cara_kirim_berkas',
  'tahu_dari',
  'catatan_tambahan',
  'berkas_foto',
  'berkas_rapor',
  'berkas_akta',
  'berkas_kk',
  'berkas_surat_sehat',
  'berkas_surat_nilai',
  'confirm_data',
  'agree_terms',
  'source_page'
];

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Web app aktif. Gunakan method POST untuk kirim data.',
    sheet_name: SHEET_NAME
  });
}

function doPost(e) {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('SPREADSHEET_ID belum diisi.');
    }

    const payload = parsePayload_(e);
    const sheet = getOrCreateSheet_();

    ensureHeader_(sheet);

    const row = HEADERS.map((key) => {
      const value = payload[key];
      return value === undefined || value === null ? '' : value;
    });

    sheet.appendRow(row);

    return jsonResponse_({ ok: true, inserted_row: sheet.getLastRow() });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error) });
  }
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
}

function parsePayload_(e) {
  const raw = (e && e.postData && e.postData.contents) || '';
  if (!raw) {
    return {};
  }

  // Primary format from frontend: JSON string.
  try {
    return JSON.parse(raw);
  } catch (jsonError) {
    // Fallback: application/x-www-form-urlencoded
    const output = {};
    raw.split('&').forEach((pair) => {
      if (!pair) return;
      const parts = pair.split('=');
      const key = decodeURIComponent(parts[0] || '').trim();
      const value = decodeURIComponent((parts[1] || '').replace(/\+/g, ' '));
      if (key) {
        output[key] = value;
      }
    });
    return output;
  }
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
