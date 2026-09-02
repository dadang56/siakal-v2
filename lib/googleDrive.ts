// Google Drive Cloud Storage Integration & Link Parser Helper for SIAKAL V2
// Politeknik Transportasi SDP Palembang

export interface GoogleDriveConfig {
  folderId?: string;
  folderUrl?: string;
  apiKey?: string;
  isDriveActive: boolean;
}

/**
 * Extracts Google Drive File ID from any Google Drive link format:
 * - https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing
 * - https://drive.google.com/open?id=1A2B3C4D5E...
 * - https://lh3.googleusercontent.com/d/1A2B3C4D5E...
 * - 1A2B3C4D5E... (raw file ID)
 */
export function extractGoogleDriveFileId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;

  const trimmed = urlOrId.trim();

  // 1. Check raw File ID format (typically 25-45 alphanumeric characters with _ or -)
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. Match /file/d/FILE_ID/
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // 3. Match /d/FILE_ID
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) {
    return dMatch[1];
  }

  // 4. Match ?id=FILE_ID
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  return null;
}

/**
 * Converts any Google Drive link or ID into a direct high-speed image stream URL:
 * Format: https://lh3.googleusercontent.com/d/FILE_ID
 * Fallback: https://drive.google.com/thumbnail?id=FILE_ID&sz=w1600
 */
export function getGoogleDriveDirectLink(urlOrId: string): string {
  if (!urlOrId) return '';

  // If already a standard http/base64 data URL and not Google Drive, return as-is
  if (!urlOrId.includes('drive.google.com') && !urlOrId.includes('googleusercontent.com')) {
    return urlOrId;
  }

  const fileId = extractGoogleDriveFileId(urlOrId);
  if (fileId) {
    // High-speed Google User Content CDN Direct Image Stream
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return urlOrId;
}

/**
 * Parses a Google Drive Folder Link to extract Folder ID
 */
export function extractGoogleDriveFolderId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }

  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Load Google Drive Configuration from LocalStorage
 */
export function loadGoogleDriveConfig(): GoogleDriveConfig {
  if (typeof window === 'undefined') {
    return { isDriveActive: false };
  }
  try {
    const stored = localStorage.getItem('siakal_google_drive_config');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {}
  return { isDriveActive: false };
}

/**
 * Save Google Drive Configuration to LocalStorage
 */
export function saveGoogleDriveConfig(config: GoogleDriveConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('siakal_google_drive_config', JSON.stringify(config));
    window.dispatchEvent(new Event('siakal_drive_config_updated'));
  } catch (e) {}
}
