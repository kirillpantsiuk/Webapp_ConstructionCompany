import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  LogOut, User, Menu, X, LayoutDashboard, Database, 
  Edit, Trash2, Printer, Plus, ShieldCheck, Landmark, Home, MapPin, AlertTriangle, FileText, Search, ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  Alert, Snackbar, IconButton, Tooltip
} from '@mui/material';

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  body, html { margin: 0; padding: 0; background-color: #0a0f16; color: white; font-family: 'Inter', sans-serif; }
  * { box-sizing: border-box; }
  @media print { .no-print { display: none !important; } }
`;

// --- Styled Components ---
const DashboardWrapper = styled.div`
  min-height: 100vh; display: flex;
  background: radial-gradient(circle at 50% 50%, #111827 0%, #0a0f16 100%);
`;

const Sidebar = styled.div`
  position: fixed; left: ${props => (props.$isOpen ? '0' : '-280px')};
  top: 0; width: 280px; height: 100%; background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px); border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease; z-index: 1000; padding: 30px 20px; display: flex; flex-direction: column;
`;

const SidebarItem = styled.div`
  display: flex; align-items: center; gap: 15px; padding: 14px 18px; border-radius: 12px;
  cursor: pointer; color: ${props => (props.$active ? '#38bdf8' : '#94a3b8')};
  background: ${props => (props.$active ? 'rgba(56, 189, 248, 0.1)' : 'transparent')};
  margin-bottom: 8px; transition: 0.2s;
  &:hover { background: rgba(56, 189, 248, 0.05); color: white; }
`;

const MainContent = styled.div`
  flex: 1; padding: 40px; margin-left: ${props => (props.$isMenuOpen ? '280px' : '0')}; transition: margin 0.3s ease;
`;

const HeaderSection = styled.div`
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  background: rgba(30, 41, 59, 0.4); padding: 20px 30px; border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); margin-bottom: 30px;
`;

const FilterSection = styled.div`
  width: 100%; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px; margin-bottom: 20px;
  background: rgba(30, 41, 59, 0.2); padding: 15px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.05);
`;

const StyledInput = styled.input`
  padding: 10px 15px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px; color: white; font-size: 14px;
  &:focus { outline: none; border-color: #38bdf8; }
`;

const TableContainer = styled.div`
  background: rgba(30, 41, 59, 0.3); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%; border-collapse: collapse; color: #e2e8f0;
  th { background: rgba(15, 23, 42, 0.5); padding: 15px; text-align: left; color: #38bdf8; font-size: 13px; text-transform: uppercase; }
  td { padding: 15px; border-top: 1px solid rgba(255, 255, 255, 0.05); }
  tr:hover { background: rgba(56, 189, 248, 0.02); }
`;

const ActionButton = styled.button`
  background: #38bdf8; color: #0a0f16; border: none; padding: 10px 20px; border-radius: 10px;
  font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;
`;

const SectionTitle = styled.h4`
  display: flex; align-items: center; gap: 10px; color: #38bdf8; margin: 15px 0 10px 0;
  text-transform: uppercase; font-size: 11px; grid-column: 1/4; border-bottom: 1px solid rgba(56, 189, 248, 0.2);
`;

const FormGrid = styled.form` display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; padding: 20px; `;

const InputGroup = styled.div`
  display: flex; flex-direction: column; gap: 5px; grid-column: ${props => props.$span ? `span ${props.$span}` : 'auto'};
  label { font-size: 11px; color: #94a3b8; }
  input, select, textarea { padding: 10px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: white; font-family: inherit; }
  textarea { resize: vertical; min-height: 80px; }
`;

const OrangeAlertBar = styled.div`
  background: #f97316; border-radius: 40px; padding: 20px 30px; display: flex;
  align-items: center; justify-content: space-between; gap: 20px; width: 100%;
  box-shadow: 0 10px 30px rgba(249, 115, 22, 0.2);
`;

const AlertText = styled.div`
  display: flex; align-items: center; gap: 15px; color: white; font-size: 18px; font-weight: 700;
`;

const ConfirmButton = styled.button`
  background: transparent; border: none; color: white; font-size: 18px;
  font-weight: 900; cursor: pointer; text-transform: uppercase;
`;

const CancelLink = styled.div`
  color: #94a3b8; font-size: 18px; margin-top: 30px; cursor: pointer;
  text-decoration: underline; text-align: center; font-weight: 500;
`;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [buildingObjects, setBuildingObjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openObjForm, setOpenObjForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });
  const [suggestParams, setSuggestParams] = useState({ rooms: '', bathrooms: '' });

  const [userInfo] = useState(() => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null;
  });

  const [formData, setFormData] = useState({
    surname: '', firstName: '', patronymic: '', phone: '', email: '',
    series: '', number: '', issueDate: '', issuedBy: '', iban: '', bankName: '', accountOwner: ''
  });

  const [objFormData, setObjFormData] = useState({
    address: '', coordinates: '', area: '', description: '', clientId: '', templateId: ''
  });

  const fetchClients = useCallback(async () => {
    if (!userInfo?.token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/clients', config);
      const processed = data.map(c => ({
        ...c,
        series: c.passport?.series || '',
        number: c.passport?.number || '',
        issueDate: c.passport?.issueDate ? c.passport.issueDate.split('T')[0] : '',
        issuedBy: c.passport?.issuedBy || '',
        iban: c.bank?.iban || '',
        bankName: c.bank?.bankName || '',
        accountOwner: c.bank?.accountOwner || ''
      }));
      setClients(processed);
    } catch (err) { console.error("Client fetch error", err); }
  }, [userInfo]);

  const fetchBuildingObjects = useCallback(async () => {
    if (!userInfo?.token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/building-objects', config);
      setBuildingObjects(data);
    } catch (err) { console.error("Object fetch error", err); }
  }, [userInfo]);

  const fetchTemplates = useCallback(async () => {
    if (!userInfo?.token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/templates', config);
      setTemplates(data);
    } catch (err) { console.error("Template fetch error", err); }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'Manager') navigate('/login');
  }, [userInfo, navigate]);

  useEffect(() => {
    const loadAll = async () => {
      if (userInfo?.token) {
        await fetchTemplates();
        await fetchClients();
        await fetchBuildingObjects();
      }
    };
    loadAll();
  }, [userInfo?.token, fetchTemplates, fetchClients, fetchBuildingObjects]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
    setSearchTerm('');
    setFilterDate('');
    if (tab === 'clients') fetchClients();
    if (tab === 'objects') fetchBuildingObjects();
    if (tab === 'templates') fetchTemplates();
  };

  const filteredClients = useMemo(() => clients.filter(c => 
    `${c.surname} ${c.firstName} ${c.patronymic} ${c.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
    && (filterDate ? c.createdAt.startsWith(filterDate) : true)
  ), [clients, searchTerm, filterDate]);

  const filteredObjects = useMemo(() => buildingObjects.filter(o => {
    const client = clients.find(c => c._id === (o.clientId?._id || o.clientId));
    const clientName = client ? `${client.surname} ${client.firstName}` : '';
    return `${o.address} ${clientName}`.toLowerCase().includes(searchTerm.toLowerCase())
    && (filterDate ? o.createdAt.startsWith(filterDate) : true);
  }), [buildingObjects, searchTerm, filterDate, clients]);

  const suggestedTemplates = useMemo(() => {
    if (!suggestParams.rooms && !suggestParams.bathrooms) return templates;
    return templates.filter(t => {
      const matchRooms = suggestParams.rooms ? t.rooms === parseInt(suggestParams.rooms) : true;
      const matchBath = suggestParams.bathrooms ? t.bathrooms === parseInt(suggestParams.bathrooms) : true;
      return matchRooms && matchBath;
    });
  }, [templates, suggestParams]);

  const validateClient = () => {
    const nameRegex = /^[A-Za-zА-Яа-яІіЇїЄє' ]+$/;
    if (!nameRegex.test(formData.surname) || !nameRegex.test(formData.firstName)) {
      setNotify({ open: true, message: "Прізвище та ім'я повинні містити лише літери", severity: 'warning' });
      return false;
    }
    if (!formData.phone.startsWith('+380') || formData.phone.length !== 13) {
      setNotify({ open: true, message: 'Номер телефону має бути у форматі +380XXXXXXXXX', severity: 'warning' });
      return false;
    }
    if (!formData.iban.startsWith('UA') || formData.iban.length < 15) {
      setNotify({ open: true, message: 'Некоректний формат IBAN (має починатися з UA)', severity: 'warning' });
      return false;
    }
    const seriesRegex = /^[A-ZА-Я]{2}$/;
    if (!seriesRegex.test(formData.series.toUpperCase())) {
      setNotify({ open: true, message: 'Серія паспорта має бути 2 великі літери', severity: 'warning' });
      return false;
    }
    return true;
  };

  const validateObject = () => {
    if (parseFloat(objFormData.area) <= 0) {
      setNotify({ open: true, message: 'Площа будівництва повинна бути більшою за 0', severity: 'warning' });
      return false;
    }
    if (!objFormData.clientId) {
      setNotify({ open: true, message: 'Будь ласка, оберіть замовника зі списку', severity: 'warning' });
      return false;
    }
    if (objFormData.description.length < 5) {
      setNotify({ open: true, message: 'Опис занадто короткий', severity: 'warning' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateClient()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const payload = {
        ...formData,
        passport: { series: formData.series, number: formData.number, issueDate: formData.issueDate, issuedBy: formData.issuedBy },
        bank: { iban: formData.iban, bankName: formData.bankName, accountOwner: formData.accountOwner }
      };
      if (editingId) await axios.put(`http://localhost:5000/api/clients/${editingId}`, payload, config);
      else await axios.post('http://localhost:5000/api/clients', payload, config);
      setOpenForm(false); setEditingId(null); fetchClients();
      setNotify({ open: true, message: 'Дані клієнта збережено!', severity: 'success' });
    } catch (error) { 
      console.error("Client save error:", error);
      setNotify({ open: true, message: 'Помилка при збереженні', severity: 'error' }); 
    }
  };

  const handleObjectSubmit = async (e) => {
    e.preventDefault();
    if (!validateObject()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (editingId) await axios.put(`http://localhost:5000/api/building-objects/${editingId}`, objFormData, config);
      else await axios.post('http://localhost:5000/api/building-objects', objFormData, config);
      setOpenObjForm(false); setEditingId(null); fetchBuildingObjects();
      setNotify({ open: true, message: 'Об’єкт будівництва збережено!', severity: 'success' });
    } catch (error) { 
      console.error("Object save error:", error);
      setNotify({ open: true, message: 'Помилка при збереженні об’єкта', severity: 'error' });
    }
  };

  const handleTemplateSelect = (id) => {
    const template = templates.find(t => t._id === id);
    if (template) {
      setObjFormData({
        ...objFormData,
        templateId: id,
        area: template.estimatedArea,
        description: `Проєкт: ${template.name}. Склад: ${template.configuration}. Одноповерховий тип забудови. Кількість кімнат: ${template.rooms}.`
      });
    }
  };

  const getFullClientData = (clientIdOrObj) => {
    const id = typeof clientIdOrObj === 'object' ? clientIdOrObj._id : clientIdOrObj;
    return clients.find(c => c._id === id);
  };

  const handleFullExtract = (obj) => {
    const win = window.open('', '_blank');
    const c = getFullClientData(obj.clientId);
    const regDate = new Date(obj.createdAt).toLocaleDateString('uk-UA');
    const passDate = c?.issueDate ? new Date(c.issueDate).toLocaleDateString('uk-UA') : '—';

    win.document.write(`
      <html><head><title>Витяг - ${c?.surname || 'Обʼєкт'}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 0; color: #0f172a; line-height: 1.4; font-size: 13px; }
        .header { text-align: center; border-bottom: 3px solid #38bdf8; padding-bottom: 10px; margin-bottom: 20px; }
        h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
        h2 { font-size: 15px; color: #38bdf8; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-top: 15px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
        .item { margin-bottom: 5px; page-break-inside: avoid; }
        .label { color: #64748b; font-size: 9px; text-transform: uppercase; display: block; font-weight: bold; }
        .value { font-weight: 600; color: #1e293b; }
        .box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc; page-break-inside: avoid; }
        .footer { text-align: center; margin-top: 25px; font-size: 10px; color: #94a3b8; border-top: 1px solid #eee; padding-top: 10px; page-break-inside: avoid; }
      </style></head>
      <body>
        <div class="header"><h1>ПОВНИЙ ВИТЯГ З РЕЄСТРУ БУДІВНИЦТВА</h1><p>Документ № ${obj._id.toUpperCase()}</p></div>
        <div class="box">
          <h2>I. ІНФОРМАЦІЯ ПРО ЗАМОВНИКА</h2>
          <div class="grid">
            <div class="item"><span class="label">Прізвище, Ім'я, По батькові</span><span class="value">${c?.surname || ''} ${c?.firstName || ''} ${c?.patronymic || ''}</span></div>
            <div class="item"><span class="label">Телефон</span><span class="value">${c?.phone || '—'}</span></div>
            <div class="item"><span class="label">Електронна пошта</span><span class="value">${c?.email || '—'}</span></div>
            <div class="item"><span class="label">Паспортні дані</span><span class="value">${c?.series || ''} ${c?.number || ''}</span></div>
            <div class="item"><span class="label">Дата видачі</span><span class="value">${passDate}</span></div>
            <div class="item"><span class="label">Ким виданий</span><span class="value">${c?.issuedBy || '—'}</span></div>
            <div class="item" style="grid-column: span 2;"><span class="label">IBAN Рахунок</span><span class="value" style="font-family: monospace;">${c?.iban || '—'}</span></div>
            <div class="item"><span class="label">Банк</span><span class="value">${c?.bankName || '—'}</span></div>
            <div class="item"><span class="label">Власник рахунку</span><span class="value">${c?.accountOwner || '—'}</span></div>
          </div>
        </div>
        <div class="box" style="margin-top: 15px;">
          <h2>II. ТЕХНІЧНІ ДАНІ ОБ'ЄКТА</h2>
          <div class="grid">
            <div class="item" style="grid-column: span 2;"><span class="label">Адреса забудови</span><span class="value">${obj.address}</span></div>
            <div class="item"><span class="label">GPS Координати</span><span class="value">${obj.coordinates || 'Не встановлено'}</span></div>
            <div class="item"><span class="label">Проєктна площа</span><span class="value">${obj.area} м²</span></div>
            <div class="item" style="grid-column: span 2;"><span class="label">Технічний опис</span><span class="value">${obj.description}</span></div>
            <div class="item"><span class="label">Дата внесення</span><span class="value">${regDate}</span></div>
          </div>
        </div>
        <div class="footer">Витяг сформовано CRM BUILD - ${new Date().toLocaleString('uk-UA')}</div>
        <script>window.onload = function(){ window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  const handlePrintObject = (obj) => {
    const win = window.open('', '_blank');
    const c = getFullClientData(obj.clientId);
    win.document.write(`
      <html><head><title>Паспорт об'єкта</title><style>
        @page { size: A4; margin: 15mm; }
        body { font-family: sans-serif; padding: 0; color: #1e293b; line-height: 1.5; font-size: 14px; }
        .header { text-align: center; text-transform: uppercase; font-size: 22px; font-weight: bold; border-bottom: 3px solid #38bdf8; padding-bottom: 10px; margin-bottom: 25px; }
        .row { margin-bottom: 15px; page-break-inside: avoid; }
        b { color: #64748b; margin-right: 10px; text-transform: uppercase; font-size: 11px; }
        .footer { border-top: 1px solid #eee; margin-top: 30px; padding-top: 15px; font-weight: bold; page-break-inside: avoid; }
      </style></head><body>
        <div class="header">ТЕХНІЧНИЙ ПАСПОРТ ОБ'ЄКТА</div>
        <div class="row"><b>Адреса:</b> ${obj.address}</div>
        <div class="row"><b>GPS:</b> ${obj.coordinates || 'Не вказано'}</div>
        <div class="row"><b>Площа:</b> ${obj.area} м²</div>
        <div class="row"><b>Опис:</b><br/> ${obj.description}</div>
        <div class="footer">ЗАМОВНИК: ${c?.surname} ${c?.firstName} ${c?.patronymic}</div>
        <div style="font-size: 10px; color: #999; margin-top: 10px;">Дата: ${new Date(obj.createdAt).toLocaleDateString('uk-UA')}</div>
        <script>window.onload = function(){ window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  const handlePrintClient = (c) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Анкета клієнта</title><style>
        @page { size: A4; margin: 15mm; }
        body { font-family: sans-serif; padding: 0; line-height: 1.4; font-size: 14px; }
        h1 { color: #38bdf8; border-bottom: 2px solid #38bdf8; padding-bottom: 10px; font-size: 20px; }
        .line { margin-bottom: 12px; page-break-inside: avoid; }
        b { width: 180px; display: inline-block; color: #64748b; font-size: 11px; text-transform: uppercase; }
      </style></head><body>
        <h1>АНКЕТА КЛІЄНТА: ${c.surname}</h1>
        <div class="line"><b>ПІБ:</b> ${c.surname} ${c.firstName} ${c.patronymic}</div>
        <div class="line"><b>Телефон:</b> ${c.phone}</div>
        <div class="line"><b>Email:</b> ${c.email}</div>
        <div class="line"><b>Паспорт:</b> ${c.series} ${c.number}</div>
        <div class="line"><b>Виданий:</b> ${c.issuedBy} від ${new Date(c.issueDate).toLocaleDateString()}</div>
        <div class="line"><b>IBAN:</b> ${c.iban}</div>
        <div class="line"><b>Банк:</b> ${c.bankName}</div>
        <script>window.onload = function(){ window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  const deleteClient = async (id) => {
    if (window.confirm('Видалити клієнта та всі пов’язані дані?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/clients/${id}`, config);
        fetchClients();
        setNotify({ open: true, message: 'Клієнта видалено', severity: 'info' });
      } catch (error) { console.error("Client delete error:", error); }
    }
  };

  const deleteObject = async (id) => {
    if (window.confirm('Видалити цей об’єкт будівництва?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/building-objects/${id}`, config);
        fetchBuildingObjects();
        setNotify({ open: true, message: 'Об’єкт видалено', severity: 'info' });
      } catch (error) { console.error("Object delete error:", error); }
    }
  };

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <Sidebar $isOpen={menuOpen}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'40px'}}>
          <h2 style={{color:'#38bdf8', margin:0}}>BUILD CRM</h2>
          <X style={{cursor:'pointer'}} onClick={() => setMenuOpen(false)} />
        </div>
        <SidebarItem $active={activeTab === 'dashboard'} onClick={() => handleTabChange('dashboard')}><LayoutDashboard size={20}/> Огляд</SidebarItem>
        <SidebarItem $active={activeTab === 'clients'} onClick={() => handleTabChange('clients')}><Database size={20}/> База клієнтів</SidebarItem>
        <SidebarItem $active={activeTab === 'objects'} onClick={() => handleTabChange('objects')}><Home size={20}/> Об'єкти будівництва</SidebarItem>
        <SidebarItem $active={activeTab === 'templates'} onClick={() => handleTabChange('templates')}><FileText size={20}/> Опорні плани</SidebarItem>
        <SidebarItem onClick={() => setLogoutDialogOpen(true)} style={{marginTop:'auto', color:'#ef4444'}}><LogOut size={20}/> Вийти</SidebarItem>
      </Sidebar>

      <MainContent $isMenuOpen={menuOpen}>
        <HeaderSection>
          <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
            {!menuOpen && <Menu style={{cursor:'pointer', color:'#38bdf8'}} onClick={() => setMenuOpen(true)} />}
            <div><h3 style={{margin:0}}>{userInfo?.login}</h3><p style={{margin:0, fontSize:'12px', color:'#94a3b8'}}>Менеджер системи</p></div>
          </div>
          {activeTab === 'clients' && <ActionButton onClick={() => { setFormData({surname:'',firstName:'',patronymic:'',phone:'',email:'',series:'',number:'',issueDate:'',issuedBy:'',iban:'',bankName:'',accountOwner:''}); setEditingId(null); setOpenForm(true); }}><Plus size={18}/> Додати клієнта</ActionButton>}
          {activeTab === 'objects' && <ActionButton onClick={() => { setObjFormData({address:'', coordinates:'', area:'', description:'', clientId:'', templateId:''}); setSuggestParams({rooms:'', bathrooms:''}); setEditingId(null); setOpenObjForm(true); }}><Plus size={18}/> Новий об'єкт</ActionButton>}
        </HeaderSection>

        {(activeTab === 'clients' || activeTab === 'objects') && (
          <FilterSection>
            <StyledInput placeholder="Пошук за текстом..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <StyledInput type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
            <Button variant="outlined" style={{color:'#94a3b8', borderColor:'#334155'}} onClick={() => {setSearchTerm(''); setFilterDate('');}}>Скинути</Button>
          </FilterSection>
        )}

        {activeTab === 'clients' && (
          <TableContainer><StyledTable><thead><tr><th>Повний ПІБ клієнта</th><th>Контакти</th><th>IBAN</th><th style={{textAlign:'right'}}>Дії</th></tr></thead><tbody>{filteredClients.map(c => (<tr key={c._id}><td><b>{c.surname} {c.firstName} {c.patronymic}</b></td><td>{c.phone}<br/><small>{c.email}</small></td><td style={{color:'#38bdf8'}}>{c.iban}</td><td style={{textAlign:'right'}}><IconButton onClick={()=>handlePrintClient(c)} style={{color:'#38bdf8'}}><Printer size={18}/></IconButton><IconButton onClick={() => {setFormData(c); setEditingId(c._id); setOpenForm(true);}} style={{color:'#fbbf24'}}><Edit size={18}/></IconButton><IconButton onClick={()=>deleteClient(c._id)} style={{color:'#ef4444'}}><Trash2 size={18}/></IconButton></td></tr>))}</tbody></StyledTable></TableContainer>
        )}

        {activeTab === 'objects' && (
          <TableContainer><StyledTable><thead><tr><th>Адреса будівництва</th><th>Площа</th><th>Замовник</th><th style={{textAlign:'right'}}>Дії</th></tr></thead><tbody>{filteredObjects.map(obj => {
            const client = getFullClientData(obj.clientId);
            return (
              <tr key={obj._id}><td><b>{obj.address}</b></td><td>{obj.area} м²</td><td>{client?.surname || '—'} {client?.firstName ? client.firstName[0] + '.' : ''}</td><td style={{textAlign:'right'}}>
                <IconButton onClick={() => handleFullExtract(obj)} style={{color:'#10b981'}}><ClipboardList size={18}/></IconButton>
                <IconButton onClick={() => handlePrintObject(obj)} style={{color:'#38bdf8'}}><Printer size={18}/></IconButton>
                <IconButton onClick={() => {setObjFormData({address:obj.address, area:obj.area, coordinates:obj.coordinates, description:obj.description, clientId:client?._id, templateId:obj.templateId || ''}); setEditingId(obj._id); setOpenObjForm(true);}} style={{color:'#fbbf24'}}><Edit size={18}/></IconButton>
                <IconButton onClick={()=>deleteObject(obj._id)} style={{color:'#ef4444'}}><Trash2 size={18}/></IconButton>
              </td></tr>
            )})}</tbody></StyledTable></TableContainer>
        )}

        {activeTab === 'templates' && (
          <TableContainer><StyledTable><thead><tr><th>Назва плану</th><th>Конфігурація</th><th>Кімнати</th><th>СВ</th><th>Площа</th></tr></thead><tbody>{templates.map(t => (<tr key={t._id}><td><b style={{color: '#38bdf8'}}>{t.name}</b></td><td>{t.configuration}</td><td>{t.rooms}</td><td>{t.bathrooms}</td><td>{t.estimatedArea} м²</td></tr>))}</tbody></StyledTable></TableContainer>
        )}

        {activeTab === 'dashboard' && (
          <div style={{textAlign:'center', marginTop:'100px'}}><Home size={80} color="#38bdf8" style={{opacity: 0.2, marginBottom: '20px'}} /><h2 style={{color: '#94a3b8'}}>Система планування будівництва</h2><p style={{color: '#64748b'}}>Керуйте базою клієнтів та об'єктами одноповерхової забудови.</p></div>
        )}
      </MainContent>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'20px'}}}>
        <DialogContent>
          <h2 style={{color:'#38bdf8', marginBottom:'20px'}}>{editingId ? 'Редагування клієнта' : 'Новий клієнт'}</h2>
          <FormGrid onSubmit={handleSubmit} id="clientForm">
            <SectionTitle><User size={14}/> Особисті дані</SectionTitle>
            <InputGroup><label>Прізвище</label><input required value={formData.surname} onChange={e=>setFormData({...formData, surname:e.target.value})}/></InputGroup>
            <InputGroup><label>Ім'я</label><input required value={formData.firstName} onChange={e=>setFormData({...formData, firstName:e.target.value})}/></InputGroup>
            <InputGroup><label>По батькові</label><input required value={formData.patronymic} onChange={e=>setFormData({...formData, patronymic:e.target.value})}/></InputGroup>
            <InputGroup><label>Телефон</label><input required placeholder="+380XXXXXXXXX" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})}/></InputGroup>
            <InputGroup $span={2}><label>Email</label><input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})}/></InputGroup>
            <SectionTitle><ShieldCheck size={14}/> Паспорт</SectionTitle>
            <InputGroup><label>Серія</label><input required maxLength={2} value={formData.series} onChange={e=>setFormData({...formData, series:e.target.value.toUpperCase()})}/></InputGroup>
            <InputGroup><label>Номер</label><input required value={formData.number} onChange={e=>setFormData({...formData, number:e.target.value})}/></InputGroup>
            <InputGroup><label>Дата видачі</label><input type="date" required value={formData.issueDate} onChange={e=>setFormData({...formData, issueDate:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>Ким виданий</label><input required value={formData.issuedBy} onChange={e=>setFormData({...formData, issuedBy:e.target.value})}/></InputGroup>
            <SectionTitle><Landmark size={14}/> Банк</SectionTitle>
            <InputGroup $span={2}><label>IBAN</label><input required placeholder="UA..." value={formData.iban} onChange={e=>setFormData({...formData, iban:e.target.value.toUpperCase()})}/></InputGroup>
            <InputGroup><label>Назва банку</label><input required value={formData.bankName} onChange={e=>setFormData({...formData, bankName:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>Власник рахунку (ПІБ)</label><input required value={formData.accountOwner} onChange={e=>setFormData({...formData, accountOwner:e.target.value})}/></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}><Button onClick={()=>setOpenForm(false)} style={{color:'#94a3b8'}}>Скасувати</Button><Button type="submit" form="clientForm" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight:'bold'}}>Зберегти</Button></DialogActions>
      </Dialog>

      <Dialog open={openObjForm} onClose={() => setOpenObjForm(false)} maxWidth="md" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'20px'}}}>
        <DialogContent>
          <h2 style={{color:'#38bdf8', marginBottom:'20px'}}>{editingId ? 'Редагування' : 'Новий об’єкт'}</h2>
          <FormGrid onSubmit={handleObjectSubmit} id="objForm">
            <SectionTitle><Search size={14}/> Проєкт</SectionTitle>
            <InputGroup><label>Кімнат</label><input type="number" value={suggestParams.rooms} onChange={e=>setSuggestParams({...suggestParams, rooms:e.target.value})}/></InputGroup>
            <InputGroup><label>Санвузлів</label><input type="number" value={suggestParams.bathrooms} onChange={e=>setSuggestParams({...suggestParams, bathrooms:e.target.value})}/></InputGroup>
            <InputGroup><label>Варіант</label><select value={objFormData.templateId} onChange={e => handleTemplateSelect(e.target.value)}><option value="">Оберіть проєкт...</option>{suggestedTemplates.map(t => <option key={t._id} value={t._id}>{t.name} ({t.estimatedArea} м²)</option>)}</select></InputGroup>
            <SectionTitle><MapPin size={14}/> Локація</SectionTitle>
            <InputGroup $span={2}><label>Адреса</label><input required value={objFormData.address} onChange={e=>setObjFormData({...objFormData, address:e.target.value})}/></InputGroup>
            <InputGroup><label>Площа (м²)</label><input type="number" required min="1" value={objFormData.area} onChange={e=>setObjFormData({...objFormData, area:e.target.value})}/></InputGroup>
            <InputGroup $span={2}><label>Замовник</label><select required value={objFormData.clientId} onChange={e=>setObjFormData({...objFormData, clientId:e.target.value})}><option value="">Оберіть...</option>{clients.map(c => <option key={c._id} value={c._id}>{c.surname} {c.firstName}</option>)}</select></InputGroup>
            <InputGroup><label>Координати</label><input value={objFormData.coordinates} onChange={e=>setObjFormData({...objFormData, coordinates:e.target.value})}/></InputGroup>
            <SectionTitle><FileText size={14}/> Опис</SectionTitle>
            <InputGroup $span={3}><textarea required value={objFormData.description} onChange={e=>setObjFormData({...objFormData, description:e.target.value})}/></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}><Button onClick={()=>setOpenObjForm(false)} style={{color:'#94a3b8'}}>Скасувати</Button><Button type="submit" form="objForm" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight:'bold'}}>Зберегти</Button></DialogActions>
      </Dialog>

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} PaperProps={{ style: { backgroundColor: '#1e293b', borderRadius: '40px', padding: '25px', minWidth: '600px' } }}>
        <DialogContent style={{ padding: 0 }}><OrangeAlertBar><AlertText><AlertTriangle size={28} /> Ви впевнені, що хочете вийти з системи?</AlertText><ConfirmButton onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }}>ТАК, ВИЙТИ</ConfirmButton></OrangeAlertBar><CancelLink onClick={() => setLogoutDialogOpen(false)}>Скасувати</CancelLink></DialogContent>
      </Dialog>
      
      <Snackbar open={notify.open} autoHideDuration={3000} onClose={()=>setNotify({...notify, open:false})} anchorOrigin={{vertical:'top',horizontal:'right'}}><Alert severity={notify.severity} variant="filled">{notify.message}</Alert></Snackbar>
    </DashboardWrapper>
  );
};

export default ManagerDashboard;