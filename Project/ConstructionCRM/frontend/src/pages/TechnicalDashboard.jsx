import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  LogOut, Menu, X, LayoutDashboard, Edit, Trash2, Printer, Plus, Home, MapPin, 
  AlertTriangle, Eye, Zap, Truck, Construction, Droplets, Flame, ShieldAlert, 
  CheckCircle2, XCircle, FileText, Loader2, Maximize2, Search, FolderOpen, Info,
  Map as MapIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  Alert, Snackbar, IconButton, Switch, FormControlLabel, Tooltip
} from '@mui/material';

// --- Глобальні стилі ---
const GlobalStyle = createGlobalStyle`
  body, html { 
    margin: 0; padding: 0; 
    background-color: #0a0f16; color: white; 
    font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; 
  }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #38bdf8; }
  
  @media print { 
    .no-print { display: none !important; } 
    body { background: white !important; color: black !important; padding: 0 !important; } 
  }
`;

// --- Стилізовані компоненти (Layout) ---
const DashboardWrapper = styled.div`
  min-height: 100vh; display: flex;
  background: radial-gradient(circle at 50% 50%, #111827 0%, #0a0f16 100%);
`;

const Sidebar = styled.div`
  position: fixed; left: ${props => (props.$isOpen ? '0' : '-280px')};
  top: 0; width: 280px; height: 100%; background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(25px); border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: 0.4s; z-index: 1000; padding: 30px 20px; display: flex; flex-direction: column;
`;

const LogoContainer = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 45px;
  h2 { color: #38bdf8; margin: 0; font-weight: 900; letter-spacing: -0.02em; font-size: 24px; }
`;

const SidebarItem = styled.div`
  display: flex; align-items: center; gap: 15px; padding: 14px 18px; border-radius: 12px;
  cursor: pointer; color: ${props => (props.$active ? '#38bdf8' : '#94a3b8')};
  background: ${props => (props.$active ? 'rgba(56, 189, 248, 0.1)' : 'transparent')};
  margin-bottom: 8px; transition: 0.2s;
  &:hover { background: rgba(56, 189, 248, 0.05); color: white; transform: translateX(5px); }
`;

const MainContent = styled.div`
  flex: 1; padding: 40px; margin-left: ${props => (props.$isMenuOpen ? '280px' : '0')}; 
  transition: margin 0.3s ease;
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
  th { background: rgba(15, 23, 42, 0.5); padding: 18px; text-align: left; color: #38bdf8; font-size: 13px; text-transform: uppercase; }
  td { padding: 18px; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 14px; }
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

const BlueprintsGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); gap: 25px; padding: 10px;
`;

const BlueprintCard = styled.div`
  background: rgba(30, 41, 59, 0.5); border-radius: 24px; border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 20px; display: flex; flex-direction: column; gap: 15px; transition: transform 0.3s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  &:hover { transform: translateY(-5px); border-color: #38bdf8; box-shadow: 0 15px 40px rgba(56, 189, 248, 0.1); }
`;

const BlueprintTitleBox = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  span { font-size: 14px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; }
`;

const DrawingWrapper = styled.div`
  width: 100%; height: 380px; background: #0f172a; border-radius: 15px; overflow: hidden;
  border: 2px solid rgba(56, 189, 248, 0.4); box-shadow: inset 0 0 15px rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  img { width: 100%; height: 100%; object-fit: contain; }
`;

// --- Стилі вікна виходу (Manager Style) ---
const OrangeAlertBar = styled.div`
  background: #f97316; border-radius: 35px; padding: 20px 30px; display: flex;
  align-items: center; justify-content: space-between; gap: 15px; width: 100%;
  box-shadow: 0 15px 30px rgba(249, 115, 22, 0.3);
`;

const AlertText = styled.div`
  display: flex; align-items: center; gap: 12px; color: white; font-size: 18px; font-weight: 800;
  line-height: 1.2; text-transform: uppercase;
`;

const ConfirmLogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2); border: 2px solid white; color: white; padding: 8px 18px;
  border-radius: 25px; font-size: 14px; font-weight: 900; cursor: pointer; text-transform: uppercase;
  transition: 0.2s; &:hover { background: white; color: #f97316; }
`;

const CancelLogoutLink = styled.div`
  color: #94a3b8; font-size: 14px; margin-top: 20px; cursor: pointer;
  text-decoration: underline; text-align: center; font-weight: 600;
  &:hover { color: white; }
`;

// =============================================================================
// ОСНОВНИЙ КОМПОНЕНТ
// =============================================================================
const TechnicalDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inspections');
  const [searchTerm, setSearchTerm] = useState('');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [openInspectionForm, setOpenInspectionForm] = useState(false);
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'info' });
  
  const [buildingObjects, setBuildingObjects] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [blueprintsList, setBlueprintsList] = useState([]);
  const [loadingDrawings, setLoadingDrawings] = useState(false);

  const userInfo = useMemo(() => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null;
  }, []);

  const initialInspectionState = {
    objectId: '', soilType: 'Чорнозем', groundwaterLevel: 'Низький (>3м)', relief: '', 
    electricity: { status: 'Відсутнє', distance: 0, phases: 'Невідомо' },
    water: { status: 'Відсутнє', depthExpected: 0 },
    gas: { status: 'Відсутнє' },
    accessRoads: 'Грунтові дороги', truckAccess: true, storageArea: 'Достатньо місця',
    existingStructures: '', neighborConstraints: '', powerLines: false, recommendations: ''
  };

  const [inspectionData, setInspectionData] = useState(initialInspectionState);

  const fetchData = useCallback(async () => {
    if (!userInfo?.token || userInfo.role !== 'TechnicalCoordinator') return;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      setLoadingDrawings(true);
      const [resObjs, resInsp, resBlueprints] = await Promise.all([
        axios.get('http://localhost:5000/api/building-objects', config),
        axios.get('http://localhost:5000/api/site-inspections', config),
        axios.get('http://localhost:5000/api/blueprints', config).catch(() => ({ data: [] }))
      ]);
      setBuildingObjects(Array.isArray(resObjs.data) ? resObjs.data : []);
      setInspections(Array.isArray(resInsp.data) ? resInsp.data : []);
      setBlueprintsList(Array.isArray(resBlueprints.data) ? resBlueprints.data : []);
    } catch (err) { console.error("Fetch error:", err); } finally { setLoadingDrawings(false); }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'TechnicalCoordinator') navigate('/login');
    else fetchData();
  }, [userInfo, navigate, fetchData]);

  const handleLogout = () => { localStorage.removeItem('userInfo'); navigate('/login'); };

  const handlePrintInspection = (ins) => {
    const obj = buildingObjects.find(o => o._id === (ins.objectId?._id || ins.objectId));
    const inspectorName = ins.inspectorId ? `${ins.inspectorId.surname || ''} ${ins.inspectorId.firstName || ''}` : (userInfo?.login || "Координатор");
    const dateStr = new Date(ins.createdAt).toLocaleDateString('uk-UA');

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
      <head>
        <title>АКТ_${ins._id.slice(-8)}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
          body { font-family: 'Inter', sans-serif; color: #000; padding: 20px; line-height: 1.2; font-size: 11px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 15px; }
          h1 { margin: 0; font-size: 16px; text-transform: uppercase; font-weight: 800; }
          .section { margin-bottom: 12px; }
          .section-title { font-weight: 800; font-size: 10px; background: #f0f0f0; padding: 3px 8px; text-transform: uppercase; border-left: 4px solid #38bdf8; margin-bottom: 8px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 0 5px; }
          .item { display: flex; flex-direction: column; }
          .label { color: #555; font-size: 8px; text-transform: uppercase; font-weight: 600; margin-bottom: 1px; }
          .val { font-weight: 600; font-size: 11px; }
          .full { grid-column: span 3; }
          .box { background: #fafafa; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-style: italic; margin-top: 3px; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; }
          .sign-block { border-top: 1px solid #000; width: 180px; text-align: center; padding-top: 5px; font-weight: 600; font-size: 10px; margin-top: 25px; }
          @page { size: A4; margin: 10mm; }
        </style>
      </head>
      <body>
        <div class="header">
          <div><h1>Технічний акт огляду ділянки</h1><p style="margin:0;">BUILD CRM | ТЕХНІЧНИЙ НАГЛЯД</p></div>
          <div style="text-align:right"><b>№ ${ins._id.toUpperCase().slice(-8)}</b><br/>Дата: ${dateStr}</div>
        </div>
        <div class="section">
          <div class="section-title">01. Загальні дані</div>
          <div class="grid">
            <div class="item full"><span class="label">Об'єкт:</span><span class="val">${obj?.address || '—'}</span></div>
            <div class="item"><span class="label">Площа:</span><span class="val">${obj?.area || '—'} м²</span></div>
            <div class="item"><span class="label">Координати GPS:</span><span class="val">${obj?.coordinates || '—'}</span></div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">02. Геологія та рельєф</div>
          <div class="grid">
            <div class="item"><span class="label">Грунт:</span><span class="val">${ins.soilType}</span></div>
            <div class="item"><span class="label">Рівень вод:</span><span class="val">${ins.groundwaterLevel}</span></div>
            <div class="item full"><span class="label">Рельєф:</span><div class="box">${ins.relief}</div></div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">03. Комунікації (Мережі)</div>
          <div class="grid">
            <div class="item"><span class="label">Світло:</span><span class="val">${ins.electricity?.status} (${ins.electricity?.distance}м, ${ins.electricity?.phases})</span></div>
            <div class="item"><span class="label">Вода:</span><span class="val">${ins.water?.status} (${ins.water?.depthExpected}м)</span></div>
            <div class="item"><span class="label">Газ:</span><span class="val">${ins.gas?.status}</span></div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">04. Логістика та обмеження</div>
          <div class="grid">
            <div class="item"><span class="label">Дороги:</span><span class="val">${ins.accessRoads}</span></div>
            <div class="item"><span class="label">Фура:</span><span class="val">${ins.truckAccess ? 'Доступно' : 'Обмежено'}</span></div>
            <div class="item"><span class="label">ЛЕП:</span><span class="val">${ins.powerLines ? 'Є обмеження' : 'Відсутня'}</span></div>
            <div class="item full"><span class="label">Споруди:</span><span class="val">${ins.existingStructures || 'Відсутні'}</span></div>
            <div class="item full"><span class="label">Сусіди:</span><span class="val">${ins.neighborConstraints || 'Без зауважень'}</span></div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">05. Висновок спеціаліста</div>
          <div class="box" style="border-left: 3px solid #38bdf8; background: #f0faff;">${ins.recommendations}</div>
        </div>
        <div class="footer">
          <div class="sign-block">Координатор: ${inspectorName}</div>
          <div class="sign-block">Замовник будівництва</div>
        </div>
        <script>
          window.onload = function() { 
            window.print(); 
            window.onafterprint = function() { window.close(); };
            setTimeout(function() { window.close(); }, 500); 
          }
        </script>
      </body>
      </html>
    `);
    win.document.close();
  };

  const handleSubmitInspection = async (e) => {
    e.preventDefault();
    
    // --- СУВОРА ВАЛІДАЦІЯ УСІХ ПОЛІВ ---
    const { 
      objectId, soilType, groundwaterLevel, relief, electricity, water, gas, accessRoads, 
      storageArea, existingStructures, neighborConstraints, recommendations 
    } = inspectionData;

    const errors = [];
    if (!objectId) errors.push("Об'єкт будівництва");
    if (!soilType) errors.push("Тип ґрунту");
    if (!groundwaterLevel) errors.push("Рівень вод");
    if (!relief.trim()) errors.push("Опис рельєфу");
    if (!electricity.status) errors.push("Статус електроенергії");
    if (!electricity.phases) errors.push("Кількість фаз");
    if (!water.status) errors.push("Джерело води");
    if (!gas.status) errors.push("Газопостачання");
    if (!accessRoads) errors.push("Тип доріг");
    if (!storageArea) errors.push("Зона складування");
    if (!existingStructures.trim()) errors.push("Наявні споруди");
    if (!neighborConstraints.trim()) errors.push("Обмеження від сусідів");
    if (!recommendations.trim()) errors.push("Технічний висновок");

    if (errors.length > 0) {
      setNotify({ 
        open: true, 
        message: `Помилка: Заповніть усі обов'язкові поля!`, 
        severity: 'error' 
      });
      return;
    }

    if (Number(electricity.distance) < 0 || Number(water.depthExpected) < 0) {
      setNotify({ open: true, message: 'Значення не можуть бути від’ємними!', severity: 'error' });
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const payload = {
        ...inspectionData,
        objectId: inspectionData.objectId?._id || inspectionData.objectId,
        electricity: { ...inspectionData.electricity, distance: Number(inspectionData.electricity.distance) },
        water: { ...inspectionData.water, depthExpected: Number(inspectionData.water.depthExpected) },
        inspectorId: userInfo.id || userInfo._id,
        accessRoads: inspectionData.accessRoads === "Асфальтоване" ? "Асфальт" : inspectionData.accessRoads
      };

      if (editingId) await axios.put(`http://localhost:5000/api/site-inspections/${editingId}`, payload, config);
      else await axios.post('http://localhost:5000/api/site-inspections', payload, config);

      setNotify({ open: true, message: 'Запис успішно збережено', severity: 'info' });
      setOpenInspectionForm(false); setEditingId(null); fetchData();
    } catch (err) {
      console.error("Save error:", err);
      setNotify({ open: true, message: 'Помилка збереження даних!', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Видалити цей запис?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5000/api/site-inspections/${id}`, config);
      setNotify({ open: true, message: 'Запис успішно видалено', severity: 'info' });
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      setNotify({ open: true, message: 'Помилка при видаленні!', severity: 'error' });
    }
  };

  const filteredInspections = inspections.filter(ins => {
    const obj = buildingObjects.find(o => o._id === (ins.objectId?._id || ins.objectId));
    return (obj?.address || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredBlueprints = blueprintsList.filter(bp => bp.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <Sidebar $isOpen={menuOpen}>
        <LogoContainer>
          <h2>BUILD CRM</h2>
          <IconButton onClick={() => setMenuOpen(false)} style={{color: '#94a3b8'}}><X /></IconButton>
        </LogoContainer>
        <SidebarItem $active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setMenuOpen(false); }}><LayoutDashboard size={20}/> Огляд</SidebarItem>
        <SidebarItem $active={activeTab === 'inspections'} onClick={() => { setActiveTab('inspections'); setMenuOpen(false); }}><Eye size={20}/> Огляд ділянок</SidebarItem>
        <SidebarItem $active={activeTab === 'blueprints'} onClick={() => { setActiveTab('blueprints'); setMenuOpen(false); }}><FileText size={20}/> Креслення</SidebarItem>
        <SidebarItem $active={activeTab === 'tech_plans'} onClick={() => { setActiveTab('tech_plans'); setMenuOpen(false); }}><MapIcon size={20}/> Тех плани</SidebarItem>
        <SidebarItem $active={activeTab === 'objects'} onClick={() => { setActiveTab('objects'); setMenuOpen(false); }}><Home size={20}/> Об'єкти</SidebarItem>
        <SidebarItem onClick={() => setLogoutDialogOpen(true)} style={{marginTop:'auto', color:'#ef4444'}}>
          <LogOut size={20} color="#ef4444"/> Вийти з системи
        </SidebarItem>
      </Sidebar>

      <MainContent $isMenuOpen={menuOpen}>
        <HeaderSection>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            {!menuOpen && <IconButton onClick={() => setMenuOpen(true)} style={{color: '#38bdf8'}}><Menu /></IconButton>}
            <UserInfoContainer><span className="login">{userInfo?.login}</span><span className="role">Технічний координатор</span></UserInfoContainer>
          </div>
          {(activeTab === 'inspections' || activeTab === 'blueprints' || activeTab === 'objects' || activeTab === 'tech_plans') && (
            <div style={{position:'relative', width: '350px'}}>
              <Search size={18} style={{position: 'absolute', left: '15px', top: '13px', color: '#38bdf8'}} />
              <StyledInput placeholder="Швидкий пошук..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{paddingLeft: '45px'}} />
            </div>
          )}
          {activeTab === 'inspections' && <ActionButton onClick={() => { setInspectionData(initialInspectionState); setEditingId(null); setOpenInspectionForm(true); }}><Plus size={18}/> НОВИЙ ОГЛЯД</ActionButton>}
        </HeaderSection>

        {activeTab === 'dashboard' && (
          <div style={{textAlign:'center', marginTop:'120px'}}>
             <Home size={100} color="#1e293b" style={{marginBottom: '20px'}} />
             <h2 style={{fontSize: '32px', fontWeight: 900}}>BUILD CRM System</h2>
             <p style={{color: '#94a3b8', fontSize: '18px'}}>Система управління технічним наглядом.</p>
          </div>
        )}

        {activeTab === 'tech_plans' && (
          <div style={{textAlign:'center', marginTop:'120px'}}>
             <MapIcon size={100} color="#1e293b" style={{marginBottom: '20px'}} />
             <h2 style={{fontSize: '32px', fontWeight: 900}}>Технічні плани</h2>
             <p style={{color: '#94a3b8', fontSize: '18px'}}>Розділ знаходиться у розробці.</p>
          </div>
        )}

        {activeTab === 'inspections' && (
          <TableContainer>
            <StyledTable>
              <thead><tr><th>Адреса</th><th>Грунт</th><th>Електрика</th><th>Транспорт</th><th style={{textAlign:'right'}}>Дії</th></tr></thead>
              <tbody>
                {filteredInspections.map(ins => {
                  const obj = buildingObjects.find(o => o._id === (ins.objectId?._id || ins.objectId));
                  return (
                    <tr key={ins._id}>
                      <td><b>{obj?.address || '—'}</b></td>
                      <td>{ins.soilType}</td><td>{ins.electricity?.status}</td>
                      <td><StatusBadge $active={ins.truckAccess}>{ins.truckAccess ? <CheckCircle2 size={14} /> : <XCircle size={14} />}{ins.truckAccess ? 'Так' : 'Ні'}</StatusBadge></td>
                      <td style={{textAlign:'right'}}>
                        <IconButton onClick={() => handlePrintInspection(ins)} style={{color:'#38bdf8'}} title="Друк акту"><Printer size={18}/></IconButton>
                        <IconButton onClick={() => { setInspectionData(ins); setEditingId(ins._id); setOpenInspectionForm(true); }} style={{color:'#fbbf24'}} title="Редагувати"><Edit size={18}/></IconButton>
                        <IconButton onClick={() => handleDelete(ins._id)} style={{color:'#ef4444'}} title="Видалити"><Trash2 size={18}/></IconButton>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </StyledTable>
          </TableContainer>
        )}

        {activeTab === 'blueprints' && (
          <BlueprintsGrid>
            {loadingDrawings ? <div style={{gridColumn:'1/-1', textAlign:'center'}}><Loader2 size={40} className="animate-spin" /></div> : 
              filteredBlueprints.map(doc => (
                <BlueprintCard key={doc._id}>
                  <BlueprintTitleBox><div style={{display:'flex', alignItems:'center', gap:'10px'}}><FileText size={18} color="#38bdf8"/><span>{doc.name}</span></div><IconButton size="small" onClick={() => window.open(`http://localhost:5000${doc.imageUrl}`, '_blank')} style={{color:'#38bdf8'}}><Maximize2 size={16}/></IconButton></BlueprintTitleBox>
                  <DrawingWrapper><img src={`http://localhost:5000${doc.imageUrl}`} alt={doc.name} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div style="color:#475569">Фото не знайдено</div>'; }} /></DrawingWrapper>
                </BlueprintCard>
              ))
            }
          </BlueprintsGrid>
        )}

        {activeTab === 'objects' && (
            <TableContainer>
              <StyledTable>
                <thead><tr><th>Адреса</th><th>Площа</th><th>GPS Координати</th></tr></thead>
                <tbody>{buildingObjects.map(obj => (<tr key={obj._id}><td><b>{obj.address}</b></td><td>{obj.area} м²</td><td><code>{obj.coordinates || '—'}</code></td></tr>))}</tbody>
              </StyledTable>
            </TableContainer>
        )}
      </MainContent>

      <Dialog open={openInspectionForm} onClose={() => setOpenInspectionForm(false)} maxWidth="lg" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'24px'}}}>
        <DialogContent>
          <FormGrid onSubmit={handleSubmitInspection} id="insp-form">
            <SectionTitle><MapPin size={14}/> 1. Геологія</SectionTitle>
            <InputGroup><label>Об'єкт *</label><select required value={inspectionData.objectId?._id || inspectionData.objectId} onChange={e => setInspectionData({...inspectionData, objectId: e.target.value})}><option value="">Оберіть...</option>{buildingObjects.map(o => <option key={o._id} value={o._id}>{o.address}</option>)}</select></InputGroup>
            <InputGroup><label>Грунт *</label><select required value={inspectionData.soilType} onChange={e => setInspectionData({...inspectionData, soilType: e.target.value})}>{['Піщаний', 'Глинистий', 'Суглинок', 'Чорнозем', 'Кам’янистий', 'Насипний'].map(s => <option key={s} value={s}>{s}</option>)}</select></InputGroup>
            <InputGroup><label>Рівень вод *</label><select required value={inspectionData.groundwaterLevel} onChange={e => setInspectionData({...inspectionData, groundwaterLevel: e.target.value})}>{['Низький (>3м)', 'Середній (1.5-3м)', 'Високий (<1.5м)'].map(l => <option key={l} value={l}>{l}</option>)}</select></InputGroup>
            <InputGroup $span={3}><label>Рельєф *</label><input required value={inspectionData.relief} onChange={e => setInspectionData({...inspectionData, relief: e.target.value})} /></InputGroup>

            <SectionTitle><Zap size={14}/> 2. Мережі</SectionTitle>
            <InputGroup><label>Електрика *</label><select required value={inspectionData.electricity.status} onChange={e => setInspectionData({...inspectionData, electricity: {...inspectionData.electricity, status: e.target.value}})}><option value="Підключено">Підключено</option><option value="Поруч (стовп)">Поруч (стовп)</option><option value="Відсутнє">Відсутнє</option></select></InputGroup>
            <InputGroup><label>Відстань (м) *</label><input required type="number" value={inspectionData.electricity.distance} onChange={e => setInspectionData({...inspectionData, electricity: {...inspectionData.electricity, distance: e.target.value}})}/></InputGroup>
            <InputGroup><label>Фази *</label><select required value={inspectionData.electricity.phases} onChange={e => setInspectionData({...inspectionData, electricity: {...inspectionData.electricity, phases: e.target.value}})}><option value="1-фаза">1-фаза</option><option value="2-фаза">2-фази</option><option value="3-фази">3-фази</option><option value="Невідомо">Невідомо</option></select></InputGroup>

            <SectionTitle><Droplets size={14}/> 3. Вода та Газ</SectionTitle>
            <InputGroup><label>Вода *</label><select required value={inspectionData.water.status} onChange={e => setInspectionData({...inspectionData, water: {...inspectionData.water, status: e.target.value}})}><option value="Централізоване">Централізоване</option><option value="Свердловина (є)">Свердловина (є)</option><option value="Відсутнє">Відсутнє</option></select></InputGroup>
            <InputGroup><label>Глибина (м) *</label><input required type="number" value={inspectionData.water.depthExpected} onChange={e => setInspectionData({...inspectionData, water: {...inspectionData.water, depthExpected: e.target.value}})}/></InputGroup>
            <InputGroup><label>Газ *</label><select required value={inspectionData.gas.status} onChange={e => setInspectionData({...inspectionData, gas: {status: e.target.value}})}><option value="На ділянці">На ділянці</option><option value="По вулиці">По вулиці</option><option value="Відсутнє">Відсутнє</option></select></InputGroup>

            <SectionTitle><Truck size={14}/> 4. Логістика</SectionTitle>
            <InputGroup><label>Дороги *</label><select required value={inspectionData.accessRoads} onChange={e => setInspectionData({...inspectionData, accessRoads: e.target.value})}>{['Асфальтоване', 'Бетонні плити', 'Грунтові дороги', 'Ускладнений доїзд'].map(r => <option key={r} value={r}>{r}</option>)}</select></InputGroup>
            <InputGroup><label>Складування *</label><select required value={inspectionData.storageArea} onChange={e => setInspectionData({...inspectionData, storageArea: e.target.value})}>{['Достатньо місця', 'Обмежений простір', 'Місце відсутнє'].map(s => <option key={s} value={s}>{s}</option>)}</select></InputGroup>
            <div style={{display:'flex', gap:'20px', alignItems:'center', paddingLeft:'10px'}}><FormControlLabel control={<Switch checked={inspectionData.truckAccess} onChange={e => setInspectionData({...inspectionData, truckAccess: e.target.checked})} color="primary" />} label="Доступ фури" /><FormControlLabel control={<Switch checked={inspectionData.powerLines} onChange={e => setInspectionData({...inspectionData, powerLines: e.target.checked})} color="warning" />} label="ЛЕП" /></div>

            <SectionTitle><ShieldAlert size={14}/> 5. Обмеження</SectionTitle>
            <InputGroup $span={1.5}><label>Споруди *</label><textarea required value={inspectionData.existingStructures} onChange={e => setInspectionData({...inspectionData, existingStructures: e.target.value})} /></InputGroup>
            <InputGroup $span={1.5}><label>Сусіди *</label><textarea required value={inspectionData.neighborConstraints} onChange={e => setInspectionData({...inspectionData, neighborConstraints: e.target.value})} /></InputGroup>

            <SectionTitle><Construction size={14}/> 6. Висновок *</SectionTitle>
            <InputGroup $span={3}><label>Рекомендації *</label><textarea required value={inspectionData.recommendations} onChange={e => setInspectionData({...inspectionData, recommendations: e.target.value})} /></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding: 20}}>
          <Button onClick={()=>setOpenInspectionForm(false)} style={{color:'#94a3b8'}}>СКАСУВАТИ</Button>
          <Button type="submit" form="insp-form" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight: 'bold'}}>ЗБЕРЕГТИ АКТ</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ style: { backgroundColor: '#1e293b', borderRadius: '40px', padding: '15px' } }}>
        <DialogContent style={{ padding: '10px' }}>
          <OrangeAlertBar>
            <AlertText><AlertTriangle size={24} color="white"/> Вийти з системи?</AlertText>
            <ConfirmLogoutButton onClick={handleLogout}>ТАК ВИЙТИ</ConfirmLogoutButton>
          </OrangeAlertBar>
          <div style={{textAlign: 'center', marginTop: '15px'}}>
            <CancelLogoutLink onClick={() => setLogoutDialogOpen(false)}>СКАСУВАТИ</CancelLogoutLink>
          </div>
        </DialogContent>
      </Dialog>

      <Snackbar 
        open={notify.open} 
        autoHideDuration={3000} 
        onClose={()=>setNotify({...notify, open:false})} 
        anchorOrigin={{vertical:'top',horizontal:'right'}}
      >
        <Alert 
          icon={<Info size={18} />}
          severity={notify.severity} 
          variant="filled" 
          style={{ 
            backgroundColor: notify.severity === 'error' ? '#d32f2f' : '#0288d1', 
            color: '#fff', 
            borderRadius: '12px', 
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          {notify.message}
        </Alert>
      </Snackbar>
    </DashboardWrapper>
  );
};

export default TechnicalDashboard;