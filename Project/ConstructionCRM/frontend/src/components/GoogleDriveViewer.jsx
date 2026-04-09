import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';

const GoogleDriveViewer = ({ folderId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!folderId) return;
      setLoading(true);
      setError(null);
      try {
        const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
        const token = userInfo ? userInfo.token : null;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Отримуємо список файлів з твого бекенду
        const { data } = await axios.get(`http://localhost:5000/api/drive/folder/${folderId}`, config);
        setFiles(data);
      } catch (err) {
        console.error("Помилка Drive API:", err); 
        setError("Не вдалося завантажити креслення з хмари.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folderId]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#38bdf8' }}>
      <Loader2 className="animate-spin" size={40} style={{ margin: '0 auto' }} />
      <p style={{ marginTop: '10px' }}>З'єднання з Google Drive...</p>
    </div>
  );

  if (error) return (
    <div style={{ color: '#f87171', padding: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
      {error}
    </div>
  );

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8', fontSize: '18px', fontWeight: '700', textTransform: 'uppercase' }}>
        <FileText size={24} /> Технічна документація
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {files.map(file => (
          <div key={file.id} style={{ background: '#1e293b', borderRadius: '16px', padding: '15px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: 'white', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                {file.name}
              </span>
              <a 
                href={file.webViewLink} 
                target="_blank" 
                rel="noreferrer" 
                title="Відкрити у новому вікні"
                style={{ transition: '0.2s', padding: '4px' }}
              >
                <ExternalLink size={18} color="#38bdf8" />
              </a>
            </div>
            
            {/* ВИПРАВЛЕНО: Використовуємо шлях /preview для стабільної роботи iframe.
                Це дозволяє уникнути помилки 400 Bad Request.
            */}
            <iframe
              src={`https://drive.google.com/file/d/${file.id}/preview`}
              width="100%"
              height="400px"
              style={{ borderRadius: '8px', border: 'none', background: '#0f172a' }}
              title={file.name}
              allow="autoplay"
            ></iframe>
          </div>
        ))}
      </div>
      
      {files.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', border: '2px dashed #334155', borderRadius: '16px' }}>
          <p>У цій папці ще немає завантажених креслень.</p>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveViewer;