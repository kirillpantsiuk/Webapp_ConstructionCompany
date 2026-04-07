import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  LogOut, Menu, X, LayoutDashboard, 
  Edit, Trash2, Printer, Plus, Home, MapPin, AlertTriangle, Eye, Zap, ClipboardCheck, Truck, Construction, Droplets, Flame, ShieldAlert, User, CheckCircle2, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  Alert, Snackbar, IconButton, Switch, FormControlLabel
} from '@mui/material';

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  body, html { margin: 0; padding: 0; background-color: #0a0f16; color: white; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  * { box-sizing: border-box; }
  @media print { 
    .no-print { display: none !important; }
    body { background: white !important; color: black !important; padding: 0 !important; }
  }
`;

// --- Styled Components ---
const DashboardWrapper = styled.div`
  min-height: 100vh; display: flex;
  background: radial-gradient(circle at 50% 50%, #111827 0%, #0a0f16 100%);
`;

const Sidebar = styled.div`
  position: fixed; left: ${props => (props.$isOpen ? '0' : '-280px')};
  top: 0; width: 280px; height: 100%; background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(25px); border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1000; padding: 30px 20px; display: flex; flex-direction: column;
`;

const SidebarItem = styled.div`
  display: flex; align-items: center; gap: 15px; padding: 14px 18px; border-radius: 12px;
  cursor: pointer; color: ${props => (props.$active ? '#38bdf8' : '#94a3b8')};
  background: ${props => (props.$active ? 'rgba(56, 189, 248, 0.1)' : 'transparent')};
  margin-bottom: 8px; transition: 0.2s;
  &:hover { background: rgba(56, 189, 248, 0.05); color: white; transform: translateX(5px); }
`;

const MainContent = styled.div`
  flex: 1; padding: 40px; margin-left: ${props => (props.$isMenuOpen ? '280px' : '0')}; transition: margin 0.3s ease;
`;

const HeaderSection = styled.div`
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  background: rgba(30, 41, 59, 0.4); padding: 15px 30px; border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); margin-bottom: 30px;
`;

const UserInfoContainer = styled.div`
  display: flex; flex-direction: column;
  .login { font-size: 16px; font-weight: 700; color: white; line-height: 1.2; }
  .role { font-size: 11px; font-weight: 600; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; }
`;

const StyledInput = styled.input`
  padding: 12px 18px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px; color: white; font-size: 14px; width: 100%;
  &:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2); }
`;

const TableContainer = styled.div`
  background: rgba(30, 41, 59, 0.3); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%; border-collapse: collapse; color: #e2e8f0;
  th { background: rgba(15, 23, 42, 0.5); padding: 18px; text-align: left; color: #38bdf8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
  td { padding: 18px; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 14px; vertical-align: middle; }
  tr:hover { background: rgba(56, 189, 248, 0.02); }
`;

const StatusBadge = styled.div`
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px;
  font-size: 12px; font-weight: 600; text-transform: uppercase;
  background: ${props => props.$active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.$active ? '#4ade80' : '#f87171'};
  border: 1px solid ${props => props.$active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

const ActionButton = styled.button`
  background: #38bdf8; color: #0a0f16; border: none; padding: 12px 24px; border-radius: 12px;
  font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.2s;
  &:hover { background: #7dd3fc; transform: translateY(-1px); }
`;

const SectionTitle = styled.h4`
  display: flex; align-items: center; gap: 10px; color: #38bdf8; margin: 20px 0 15px 0;
  text-transform: uppercase; font-size: 12px; font-weight: 800; grid-column: 1 / 4; border-bottom: 1px solid rgba(56, 189, 248, 0.2); padding-bottom: 8px;
`;

const FormGrid = styled.form` display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; padding: 25px; `;

const InputGroup = styled.div`
  display: flex; flex-direction: column; gap: 6px; grid-column: ${props => props.$span ? `span ${props.$span}` : 'auto'};
  label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
  input, select, textarea { padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; color: white; font-family: inherit; font-size: 14px; }
  textarea { resize: vertical; min-height: 80px; }
  input:focus { border-color: #38bdf8; outline: none; }
`;

const OrangeAlertBar = styled.div`
  background: #f97316; border-radius: 35px; padding: 20px 30px; display: flex;
  align-items: center; justify-content: space-between; gap: 15px; width: 100%;
  box-shadow: 0 15px 30px rgba(249, 115, 22, 0.3);
`;

const AlertText = styled.div`
  display: flex; align-items: center; gap: 12px; color: white; font-size: 18px; font-weight: 800;
  line-height: 1.2; text-transform: uppercase;
`;

const ConfirmButton = styled.button`
  background: rgba(255, 255, 255, 0.2); border: 2px solid white; color: white; padding: 8px 18px;
  border-radius: 25px; font-size: 14px; font-weight: 900; cursor: pointer; text-transform: uppercase;
  transition: 0.2s; &:hover { background: white; color: #f97316; }
`;

const CancelLink = styled.div`
  color: #94a3b8; font-size: 14px; margin-top: 20px; cursor: pointer;
  text-decoration: underline; text-align: center; font-weight: 600;
  &:hover { color: white; }
`;

const TechnicalDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [openInspectionForm, setOpenInspectionForm] = useState(false);
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });
  
  const [buildingObjects, setBuildingObjects] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const userInfo = useMemo(() => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null;
  }, []);

  const initialInspectionState = useMemo(() => ({
    objectId: '', soilType: 'Чорнозем', groundwaterLevel: 'Низький (>3м)', relief: '', 
    electricity: { status: 'Відсутнє', distance: 0, phases: 'Невідомо' },
    water: { status: 'Відсутнє', depthExpected: 0 },
    gas: { status: 'Відсутнє' },
    accessRoads: 'Грунтові дороги', truckAccess: true, storageArea: 'Достатньо місця',
    existingStructures: '', neighborConstraints: '', powerLines: false, recommendations: ''
  }), []);

  const [inspectionData, setInspectionData] = useState(initialInspectionState);

  const fetchData = useCallback(async () => {
    if (!userInfo?.token || userInfo.role !== 'TechnicalCoordinator') return;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      const resObjs = await axios.get('http://localhost:5000/api/building-objects', config);
      setBuildingObjects(Array.isArray(resObjs.data) ? resObjs.data : []);
      const resInsp = await axios.get('http://localhost:5000/api/site-inspections', config);
      setInspections(Array.isArray(resInsp.data) ? resInsp.data : []);
    } catch (err) { console.error("API Fetch error:", err); }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'TechnicalCoordinator') {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => { if (userInfo?.token) fetchData(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchData, userInfo?.token]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
    setSearchTerm('');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleSubmitInspection = async (e) => {
    e.preventDefault();
    if (!inspectionData.objectId) {
      setNotify({ open: true, message: 'Оберіть об’єкт!', severity: 'error' });
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const payload = {
        ...inspectionData,
        electricity: { ...inspectionData.electricity, distance: Number(inspectionData.electricity.distance) || 0 },
        water: { ...inspectionData.water, depthExpected: Number(inspectionData.water?.depthExpected) || 0 }
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/site-inspections/${editingId}`, payload, config);
      } else {
        await axios.post('http://localhost:5000/api/site-inspections', payload, config);
      }
      setNotify({ open: true, message: 'Збережено успішно!', severity: 'success' });
      setOpenInspectionForm(false); setEditingId(null); fetchData();
    } catch (err) {
      console.error("Submit error:", err);
      setNotify({ open: true, message: 'Помилка при збереженні!', severity: 'error' });
    }
  };

  const handleDeleteInspection = async (id) => {
    if (!window.confirm('Видалити акт огляду?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5000/api/site-inspections/${id}`, config);
      setNotify({ open: true, message: 'Видалено', severity: 'info' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const filteredInspections = useMemo(() => {
    return inspections.filter(ins => {
      const objId = ins.objectId?._id || ins.objectId;
      const obj = buildingObjects.find(o => o._id === objId);
      return (obj?.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [inspections, buildingObjects, searchTerm]);

  const handlePrintInspection = (ins) => {
    const objId = ins.objectId?._id || ins.objectId;
    const obj = buildingObjects.find(o => o._id === objId);
    const inspectorName = ins.inspectorId ? `${ins.inspectorId.surname} ${ins.inspectorId.firstName}` : userInfo.login;
    const rawDate = ins.createdAt ? new Date(ins.createdAt) : new Date();
    const dateStr = rawDate.toLocaleString('uk-UA');

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
      <head>
        <title>АКТ ТЕХНІЧНОГО ОГЛЯДУ - ${obj?.address}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 24px; color: #0f172a; text-transform: uppercase; }
          .brand { color: #0ea5e9; font-weight: 800; font-size: 14px; }
          
          .section { margin-bottom: 30px; page-break-inside: avoid; }
          .section-title { font-weight: 700; font-size: 15px; color: #0ea5e9; text-transform: uppercase; background: #f0f9ff; padding: 8px 15px; border-left: 5px solid #0ea5e9; margin-bottom: 15px; }
          
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 30px; margin-bottom: 10px; }
          .item { border-bottom: 1px solid #f1f5f9; padding: 8px 0; }
          .item b { font-size: 11px; color: #64748b; display: block; text-transform: uppercase; margin-bottom: 2px; }
          .item span { font-size: 14px; font-weight: 600; color: #0f172a; }
          .full { grid-column: span 2; }
          
          .text-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; font-size: 14px; margin-top: 5px; }
          
          .footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: center; }
          .sign-line { border-top: 2px solid #0f172a; width: 250px; text-align: center; font-size: 12px; padding-top: 8px; margin-top: 40px; }
          .stamp { border: 2px dashed #cbd5e1; width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; text-align: center; font-size: 10px; color: #94a3b8; text-transform: uppercase; }

          @media print { body { padding: 20px; } .section-title { -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Акт технічного огляду</h1>
            <div class="brand">BUILD CRM System | ТЕХНІЧНИЙ ДЕПАРТАМЕНТ</div>
          </div>
          <div style="text-align: right">
            <div style="font-size: 12px; color: #64748b">Документ №: ${ins._id?.substring(18).toUpperCase()}</div>
            <div style="font-size: 14px; font-weight: 700">${dateStr}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">I. Дані про об'єкт та відповідальну особу</div>
          <div class="grid">
            <div class="item full"><b>Адреса об'єкта</b><span>${obj?.address || '—'}</span></div>
            <div class="item"><b>Технічний координатор</b><span>${inspectorName}</span></div>
            <div class="item"><b>Площа ділянки</b><span>${obj?.area || '—'} м²</span></div>
            <div class="item full"><b>Координати</b><span>${obj?.coordinates || 'Не зафіксовано'}</span></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">II. Геологія та ландшафт</div>
          <div class="grid">
            <div class="item"><b>Тип ґрунту</b><span>${ins.soilType}</span></div>
            <div class="item"><b>Рівень ґрунтових вод</b><span>${ins.groundwaterLevel}</span></div>
            <div class="item full"><b>Опис рельєфу та перепади висот</b><span>${ins.relief || 'Відсутній опис'}</span></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">III. Стан інженерних комунікацій</div>
          <div class="grid">
            <div class="item"><b>Електроенергія</b><span>${ins.electricity?.status}</span></div>
            <div class="item"><b>Фази</b><span>${ins.electricity?.phases}</span></div>
            <div class="item"><b>Відстань до підключення</b><span>${ins.electricity?.distance} м</span></div>
            <div class="item"><b>Газопостачання</b><span>${ins.gas?.status || 'Немає'}</span></div>
            <div class="item"><b>Водопостачання</b><span>${ins.water?.status}</span></div>
            <div class="item"><b>Глибина буріння (очікувана)</b><span>${ins.water?.depthExpected} м</span></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">IV. Логістика та доступність</div>
          <div class="grid">
            <div class="item"><b>Тип під'їзних доріг</b><span>${ins.accessRoads}</span></div>
            <div class="item"><b>Місце для матеріалів</b><span>${ins.storageArea}</span></div>
            <div class="item"><b>Доступ важкої техніки (фури)</b><span>${ins.truckAccess ? 'ТАК, ДОСТУПНО' : 'НІ, ОБМЕЖЕНО'}</span></div>
            <div class="item"><b>Обмеження ЛЕП</b><span>${ins.powerLines ? 'ТАК, ПРИСУТНЯ ПОРУЧ' : 'ВІДСУТНЯ'}</span></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">V. Оточення та сторонні об'єкти</div>
          <div class="grid">
            <div class="item full"><b>Існуючі споруди на ділянці</b><span>${ins.existingStructures || 'Відсутні'}</span></div>
            <div class="item full"><b>Обмеження сусідів / Межі</b><span>${ins.neighborConstraints || 'Жодних обмежень не виявлено'}</span></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">VI. Технічні висновки та рекомендації</div>
          <div class="text-box">${ins.recommendations || 'Ділянка оглянута, спеціальних зауважень немає.'}</div>
        </div>

        <div class="footer">
          <div class="sign-line">Координатор: ${inspectorName}</div>
          <div class="stamp">BUILD CRM<br>DOCUMENT CONTROL</div>
          <div class="sign-line">Замовник будівництва</div>
        </div>

        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <DashboardWrapper>
      <GlobalStyle />
      
      <Sidebar $isOpen={menuOpen}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'45px'}}>
          <h2 style={{color:'#38bdf8', margin:0, fontWeight: 900}}>BUILD TECH</h2>
          <IconButton onClick={() => setMenuOpen(false)} style={{color: '#94a3b8'}}><X /></IconButton>
        </div>
        <SidebarItem $active={activeTab === 'dashboard'} onClick={() => handleTabChange('dashboard')}><LayoutDashboard size={20}/> Огляд</SidebarItem>
        <SidebarItem $active={activeTab === 'inspections'} onClick={() => handleTabChange('inspections')}><Eye size={20}/> Огляд ділянок</SidebarItem>
        <SidebarItem $active={activeTab === 'objects'} onClick={() => handleTabChange('objects')}><Home size={20}/> Об'єкти</SidebarItem>
        <SidebarItem onClick={() => setLogoutDialogOpen(true)} style={{marginTop:'auto', color:'#ef4444'}}><LogOut size={20}/> Вийти з системи</SidebarItem>
      </Sidebar>

      <MainContent $isMenuOpen={menuOpen}>
        <HeaderSection>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            {!menuOpen && <IconButton onClick={() => setMenuOpen(true)} style={{color: '#38bdf8'}}><Menu /></IconButton>}
            <UserInfoContainer>
              <span className="login">{userInfo?.login}</span>
              <span className="role">Технічний координатор</span>
            </UserInfoContainer>
          </div>
          {activeTab === 'inspections' && (
            <ActionButton onClick={() => { setInspectionData(initialInspectionState); setEditingId(null); setOpenInspectionForm(true); }}>
              <Plus size={18}/> НОВИЙ ОГЛЯД
            </ActionButton>
          )}
        </HeaderSection>

        {activeTab === 'inspections' && (
          <>
            <div style={{marginBottom: '20px'}}>
               <StyledInput placeholder="Пошук за адресою..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <TableContainer>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Адреса</th>
                    <th>Тип ґрунту</th>
                    <th>Електрика</th>
                    <th>Транспорт</th>
                    <th style={{textAlign:'right'}}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInspections.map(ins => {
                    const objId = ins.objectId?._id || ins.objectId;
                    const obj = buildingObjects.find(o => o._id === objId);
                    return (
                      <tr key={ins._id}>
                        <td><b>{obj?.address || 'Об\'єкт видалено'}</b></td>
                        <td>{ins.soilType}</td>
                        <td>{ins.electricity?.status}</td>
                        <td>
                          <StatusBadge $active={ins.truckAccess}>
                            {ins.truckAccess ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            {ins.truckAccess ? 'Доступно' : 'Обмежено'}
                          </StatusBadge>
                        </td>
                        <td style={{textAlign:'right'}}>
                          <IconButton onClick={() => handlePrintInspection(ins)} style={{color:'#38bdf8'}}><Printer size={18}/></IconButton>
                          <IconButton onClick={() => { setInspectionData(ins); setEditingId(ins._id); setOpenInspectionForm(true); }} style={{color:'#fbbf24'}}><Edit size={18}/></IconButton>
                          <IconButton onClick={() => handleDeleteInspection(ins._id)} style={{color:'#ef4444'}}><Trash2 size={18}/></IconButton>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </StyledTable>
            </TableContainer>
          </>
        )}

        {activeTab === 'objects' && (
           <TableContainer>
           <StyledTable>
             <thead>
               <tr><th>Адреса</th><th>Площа</th><th>Координати</th></tr>
             </thead>
             <tbody>
               {buildingObjects.map(obj => (
                 <tr key={obj._id}>
                   <td><b>{obj.address}</b></td>
                   <td>{obj.area} м²</td>
                   <td>{obj.coordinates || '—'}</td>
                 </tr>
               ))}
             </tbody>
           </StyledTable>
         </TableContainer>
        )}

        {activeTab === 'dashboard' && (
          <div style={{textAlign:'center', marginTop:'120px'}}>
             <Home size={100} color="#1e293b" style={{marginBottom: '20px'}} />
             <h2 style={{fontSize: '32px', marginBottom: '10px'}}>BUILD CRM System</h2>
             <p style={{color: '#94a3b8', fontSize: '18px'}}>Система управління базою клієнтів та технічного нагляду будівництва.</p>
          </div>
        )}
      </MainContent>

      <Dialog open={openInspectionForm} onClose={() => setOpenInspectionForm(false)} maxWidth="lg" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'24px'}}}>
        <DialogContent>
          <h2 style={{color:'#38bdf8'}}>{editingId ? 'Редагувати' : 'Повний технічний огляд'}</h2>
          <FormGrid onSubmit={handleSubmitInspection} id="insp-form">
            <SectionTitle><MapPin size={14}/> 1. Геологія та рельєф</SectionTitle>
            <InputGroup $span={1}>
              <label>Адреса об'єкта</label>
              <select required value={inspectionData.objectId} onChange={e => setInspectionData({...inspectionData, objectId: e.target.value})}>
                <option value="">Оберіть зі списку...</option>
                {buildingObjects.map((o) => (<option key={o._id} value={o._id}>{o.address}</option>))}
              </select>
            </InputGroup>
            <InputGroup><label>Тип ґрунту</label>
              <select value={inspectionData.soilType} onChange={e => setInspectionData({...inspectionData, soilType: e.target.value})}>
                {['Піщаний', 'Глинистий', 'Суглинок', 'Чорнозем', 'Кам’янистий', 'Насипний'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </InputGroup>
            <InputGroup><label>Рівень вод</label>
              <select value={inspectionData.groundwaterLevel} onChange={e => setInspectionData({...inspectionData, groundwaterLevel: e.target.value})}>
                {['Низький (>3м)', 'Середній (1.5-3м)', 'Високий (<1.5м)'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </InputGroup>
            <InputGroup $span={3}><label>Опис рельєфу</label><input placeholder="Напр. Схил на південь 1.5м" value={inspectionData.relief} onChange={e => setInspectionData({...inspectionData, relief: e.target.value})} /></InputGroup>

            <SectionTitle><Zap size={14}/> 2. Енергопостачання</SectionTitle>
            <InputGroup><label>Електрика</label>
              <select value={inspectionData.electricity?.status} onChange={e => setInspectionData({...inspectionData, electricity: {...inspectionData.electricity, status: e.target.value}})}>
                {['Підключено', 'Поруч (стовп)', 'Відсутнє'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </InputGroup>
            <InputGroup><label>Відстань (м)</label><input type="number" value={inspectionData.electricity?.distance || 0} onChange={e => setInspectionData({...inspectionData, electricity: {...inspectionData.electricity, distance: e.target.value}})} /></InputGroup>
            <InputGroup><label>Фази</label>
              <select value={inspectionData.electricity?.phases} onChange={e => setInspectionData({...inspectionData, electricity: {...inspectionData.electricity, phases: e.target.value}})}>
                {['1-фаза', '3-фази', 'Невідомо'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </InputGroup>

            <SectionTitle><Droplets size={14}/> 3. Вода та Газ <Flame size={14}/></SectionTitle>
            <InputGroup><label>Вода</label>
              <select value={inspectionData.water?.status} onChange={e => setInspectionData({...inspectionData, water: {...inspectionData.water, status: e.target.value}})}>
                {['Центральне', 'Свердловина (є)', 'Потрібна свердловина', 'Відсутнє', 'Централізоване'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </InputGroup>
            <InputGroup><label>Глибина (м)</label><input type="number" value={inspectionData.water?.depthExpected || 0} onChange={e => setInspectionData({...inspectionData, water: {...inspectionData.water, depthExpected: e.target.value}})} /></InputGroup>
            <InputGroup><label>Газ</label>
              <select value={inspectionData.gas?.status} onChange={e => setInspectionData({...inspectionData, gas: {status: e.target.value}})}>
                {['На ділянці', 'По вулиці', 'Відсутнє'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </InputGroup>

            <SectionTitle><Truck size={14}/> 4. Логістика</SectionTitle>
            <InputGroup><label>Дороги</label>
              <select value={inspectionData.accessRoads} onChange={e => setInspectionData({...inspectionData, accessRoads: e.target.value})}>
                {['Асфальт', 'Бетонні плити', 'Грунтові дороги', 'Грунтова (суха)', 'Грунтова (ускладнена)', 'Відсутня', 'Дороги відсутні'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </InputGroup>
            <InputGroup><label>Складування</label>
              <select value={inspectionData.storageArea} onChange={e => setInspectionData({...inspectionData, storageArea: e.target.value})}>
                {['Достатньо місця', 'Обмежений простір', 'Місце відсутнє'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </InputGroup>
            <div style={{display:'flex', gap:'20px', alignItems:'center', paddingLeft:'10px'}}>
                <FormControlLabel control={<Switch checked={inspectionData.truckAccess} onChange={e => setInspectionData({...inspectionData, truckAccess: e.target.checked})} color="primary" />} label="Доступ фури" />
                <FormControlLabel control={<Switch checked={inspectionData.powerLines} onChange={e => setInspectionData({...inspectionData, powerLines: e.target.checked})} color="warning" />} label="ЛЕП поруч" />
            </div>

            <SectionTitle><ShieldAlert size={14}/> 5. Обмеження</SectionTitle>
            <InputGroup $span={1.5}><label>Наявні споруди</label><textarea placeholder="Старі фундаменти..." value={inspectionData.existingStructures} onChange={e => setInspectionData({...inspectionData, existingStructures: e.target.value})} /></InputGroup>
            <InputGroup $span={1.5}><label>Обмеження (сусіди)</label><textarea placeholder="Близькість будинків сусідів..." value={inspectionData.neighborConstraints} onChange={e => setInspectionData({...inspectionData, neighborConstraints: e.target.value})} /></InputGroup>

            <SectionTitle><Construction size={14}/> 6. Підсумок</SectionTitle>
            <InputGroup $span={3}><label>Рекомендації</label><textarea placeholder="Технічні поради..." value={inspectionData.recommendations} onChange={e => setInspectionData({...inspectionData, recommendations: e.target.value})} /></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}>
          <Button onClick={()=>setOpenInspectionForm(false)} style={{color:'#94a3b8'}}>СКАСУВАТИ</Button>
          <Button type="submit" form="insp-form" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight:'bold'}}>ЗБЕРЕГТИ ПОВНИЙ АКТ</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ style: { backgroundColor: '#1e293b', borderRadius: '40px', padding: '15px' } }}>
        <DialogContent style={{ padding: '10px' }}>
          <OrangeAlertBar>
            <AlertText><AlertTriangle size={24} /> Вийти з<br/>системи?</AlertText>
            <ConfirmButton onClick={handleLogout}>Так, Вийти</ConfirmButton>
          </OrangeAlertBar>
          <CancelLink onClick={() => setLogoutDialogOpen(false)}>СКАСУВАТИ</CancelLink>
        </DialogContent>
      </Dialog>

      <Snackbar open={notify.open} autoHideDuration={3000} onClose={()=>setNotify({...notify, open:false})} anchorOrigin={{vertical:'top',horizontal:'right'}}>
        <Alert severity={notify.severity} variant="filled">{notify.message}</Alert>
      </Snackbar>
    </DashboardWrapper>
  );
};

export default TechnicalDashboard;