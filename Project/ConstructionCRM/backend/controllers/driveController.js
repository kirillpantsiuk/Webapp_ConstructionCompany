const { google } = require('googleapis');
const path = require('path');

// Файл ключа лежить в корені бекенду
const KEYFILEPATH = path.join(__dirname, '../google-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

/**
 * @desc    Отримати список файлів з конкретної папки Google Drive
 * @route   GET /api/drive/folder/:folderId
 */
const getFilesFromFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    if (!folderId || folderId === 'undefined') {
      return res.status(400).json({ message: 'ID папки не вказано або некоректне' });
    }

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, webViewLink, thumbnailLink, mimeType)',
    });

    res.status(200).json(response.data.files);
  } catch (error) {
    console.error('Drive API Error:', error.message);
    res.status(500).json({ message: 'Помилка при зчитуванні з Google Drive', error: error.message });
  }
};

module.exports = {
  getFilesFromFolder,
};