import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  LogOut, User, Menu, X, LayoutDashboard, Database, 
  Edit, Trash2, Printer, Plus, ShieldCheck, Landmark, Home, MapPin, AlertTriangle, FileText, Search, ClipboardList, Banknote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  Alert, Snackbar, IconButton, Tooltip
} from '@mui/material';

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  body, html { margin: 0; padding: 0; background-color: #0a0f16; color: white; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  * { box-sizing: border-box; }
  @media print { 
    .no-print { display: none !important; }
    body { background: white !important; color: black !important; padding: 0 !important; }
    .print-box { border: 2px solid #38bdf8 !important; padding: 25px !important; margin-bottom: 25px !important; page-break-inside: avoid !important; border-radius: 15px !important; }
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
  background: rgba(30, 41, 59, 0.4); padding: 20px 30px; border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); margin-bottom: 30px;
`;

const FilterSection = styled.div`
  width: 100%; display: grid; grid-template-columns: 2.5fr 1fr 1fr; gap: 20px; margin-bottom: 20px;
  background: rgba(30, 41, 59, 0.2); padding: 15px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.05);
`;

const StyledInput = styled.input`
  padding: 12px 18px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px; color: white; font-size: 14px;
  &:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2); }
`;

const TableContainer = styled.div`
  background: rgba(30, 41, 59, 0.3); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%; border-collapse: collapse; color: #e2e8f0;
  th { background: rgba(15, 23, 42, 0.5); padding: 18px; text-align: left; color: #38bdf8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
  td { padding: 18px; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 14px; }
  tr:hover { background: rgba(56, 189, 248, 0.02); }
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
  textarea { resize: vertical; min-height: 100px; }
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

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [buildingObjects, setBuildingObjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openObjForm, setOpenObjForm] = useState(false);
  const [openPaymentForm, setOpenPaymentForm] = useState(false);
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

  const [payFormData, setPayFormData] = useState({
    amount: 0, status: 'Pending', accountNumber: '', clientId: '', objectId: '', note: ''
  });

  // --- API Functions ---
  const fetchAllData = useCallback(async () => {
    if (!userInfo?.token) return;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      const responses = await Promise.allSettled([
        axios.get('http://localhost:5000/api/clients', config),
        axios.get('http://localhost:5000/api/building-objects', config),
        axios.get('http://localhost:5000/api/templates', config),
        axios.get('http://localhost:5000/api/payments', config)
      ]);

      if (responses[0].status === 'fulfilled') {
        setClients(responses[0].value.data.map(c => ({
          ...c,
          series: c.passport?.series || '',
          number: c.passport?.number || '',
          issueDate: c.passport?.issueDate ? c.passport.issueDate.split('T')[0] : '',
          issuedBy: c.passport?.issuedBy || '',
          iban: c.bank?.iban || '',
          bankName: c.bank?.bankName || '',
          accountOwner: c.bank?.accountOwner || ''
        })));
      }
      if (responses[1].status === 'fulfilled') setBuildingObjects(responses[1].value.data);
      if (responses[2].status === 'fulfilled') setTemplates(responses[2].value.data);
      if (responses[3].status === 'fulfilled') setPayments(responses[3].value.data);
      else setPayments([]);

    } catch (err) {
      console.error("Critical Load Error:", err);
      setNotify({ open: true, message: 'Помилка синхронізації даних', severity: 'error' });
    }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'Manager') {
      navigate('/login');
    } else {
      const init = async () => { await fetchAllData(); };
      init();
    }
  }, [userInfo, navigate, fetchAllData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
    setSearchTerm('');
    setFilterDate('');
  };

  const getFullClientData = useCallback((idOrObj) => {
    const id = typeof idOrObj === 'object' ? idOrObj?._id : idOrObj;
    return clients.find(c => c._id === id);
  }, [clients]);

  // --- Валідації ---
  const validatePhone = (phone) => /^\+380\d{9}$/.test(phone);
  const validateIBAN = (iban) => /^UA\d{27}$/.test(iban);
  const validateAccNumber = (num) => /^\d{3,20}$/.test(num);

  // --- Обробники ---
  const handleSubmitClient = async (e) => {
    e.preventDefault();
    if (!validatePhone(formData.phone)) {
      setNotify({ open: true, message: 'Телефон: +380XXXXXXXXX', severity: 'warning' }); return;
    }
    if (!validateIBAN(formData.iban)) {
      setNotify({ open: true, message: 'IBAN: UA + 27 цифр', severity: 'warning' }); return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const payload = {
        ...formData,
        passport: { series: formData.series, number: formData.number, issueDate: formData.issueDate, issuedBy: formData.issuedBy },
        bank: { iban: formData.iban, bankName: formData.bankName, accountOwner: formData.accountOwner }
      };
      if (editingId) await axios.put(`http://localhost:5000/api/clients/${editingId}`, payload, config);
      else await axios.post('http://localhost:5000/api/clients', payload, config);
      setOpenForm(false); setEditingId(null); await fetchAllData();
      setNotify({ open: true, message: 'Клієнта успішно збережено!', severity: 'success' });
    } catch (err) { console.error("Client Submit Error:", err); }
  };

  const handleSubmitObject = async (e) => {
    e.preventDefault();
    if (parseFloat(objFormData.area) <= 0) {
      setNotify({ open: true, message: 'Вкажіть площу більше 0', severity: 'warning' }); return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (editingId) await axios.put(`http://localhost:5000/api/building-objects/${editingId}`, objFormData, config);
      else await axios.post('http://localhost:5000/api/building-objects', objFormData, config);
      setOpenObjForm(false); setEditingId(null); await fetchAllData();
      setNotify({ open: true, message: 'Об’єкт збережено!', severity: 'success' });
    } catch (err) { console.error("Object Submit Error:", err); }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!payFormData.objectId || !payFormData.clientId) {
      setNotify({ open: true, message: 'Оберіть об’єкт будівництва зі списку', severity: 'warning' }); return;
    }
    if (!validateAccNumber(payFormData.accountNumber)) {
      setNotify({ open: true, message: 'Номер рахунку: мінімум 3 цифри', severity: 'warning' }); return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const payload = { ...payFormData, amount: 0 };
      if (editingId) await axios.put(`http://localhost:5000/api/payments/${editingId}`, payload, config);
      else await axios.post('http://localhost:5000/api/payments', payload, config);
      setOpenPaymentForm(false); setEditingId(null); await fetchAllData();
      setNotify({ open: true, message: 'Фінансовий стан зафіксовано!', severity: 'success' });
    } catch (err) {
      console.error("Payment Submit Error:", err);
      setNotify({ open: true, message: 'Помилка БД! Перевірте обов’язкові поля.', severity: 'error' });
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm('Видалити цей запис назавжди?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const urls = {
        client: `http://localhost:5000/api/clients/${id}`,
        object: `http://localhost:5000/api/building-objects/${id}`,
        payment: `http://localhost:5000/api/payments/${id}`
      };
      await axios.delete(urls[type], config);
      setNotify({ open: true, message: 'Запис видалено успішно', severity: 'info' });
      await fetchAllData();
    } catch (err) { console.error("Delete Fail:", err); }
  };

  // --- Filtering ---
  const filteredClients = useMemo(() => clients.filter(c => 
    `${c.surname} ${c.firstName} ${c.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
    && (filterDate ? c.createdAt.startsWith(filterDate) : true)
  ), [clients, searchTerm, filterDate]);

  const filteredObjects = useMemo(() => buildingObjects.filter(o => {
    const client = getFullClientData(o.clientId);
    return `${o.address} ${client?.surname || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    && (filterDate ? o.createdAt.startsWith(filterDate) : true);
  }), [buildingObjects, searchTerm, filterDate, getFullClientData]);

  const filteredPayments = useMemo(() => payments.filter(p => {
    const client = getFullClientData(p.clientId);
    const obj = buildingObjects.find(x => x._id === (p.objectId?._id || p.objectId));
    return `${client?.surname || ''} ${obj?.address || ''} ${p.accountNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
    && (filterDate ? p.paymentDate.startsWith(filterDate) : true);
  }), [payments, searchTerm, filterDate, getFullClientData, buildingObjects]);

  const suggestedTemplates = useMemo(() => {
    if (!suggestParams.rooms && !suggestParams.bathrooms) return templates;
    return templates.filter(t => {
      const matchRooms = suggestParams.rooms ? t.rooms === parseInt(suggestParams.rooms) : true;
      const matchBath = suggestParams.bathrooms ? t.bathrooms === parseInt(suggestParams.bathrooms) : true;
      return matchRooms && matchBath;
    });
  }, [templates, suggestParams]);

  // --- PRINTS (ПОВНИЙ ОБСЯГ) ---
  const handleFullExtract = (obj) => {
    const win = window.open('', '_blank');
    const c = getFullClientData(obj.clientId);
    const p = payments.find(pay => (pay.objectId?._id || pay.objectId) === obj._id);
    const passDate = c?.issueDate ? new Date(c.issueDate).toLocaleDateString('uk-UA') : '—';
    const regDate = new Date(obj.createdAt).toLocaleDateString('uk-UA');

    win.document.write(`
      <html><head><title>Витяг №${obj._id.toUpperCase()}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #1e293b; line-height: 1.5; padding: 30px; font-size: 13px; }
        .h { text-align: center; border-bottom: 3px solid #38bdf8; margin-bottom: 30px; padding-bottom: 10px; }
        .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #f8fafc; margin-bottom: 20px; page-break-inside: avoid; }
        h2 { font-size: 15px; color: #38bdf8; text-transform: uppercase; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
        .g { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        b { color: #64748b; font-size: 10px; text-transform: uppercase; display: block; letter-spacing: 0.5px; }
        span { font-size: 15px; font-weight: 600; display: block; margin-bottom: 10px; color: #0f172a; }
        .footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px; }
      </style></head>
      <body>
        <div class="h"><h1>ПОВНИЙ ВИТЯГ З РЕЄСТРУ БУДІВНИЦТВА</h1><p>ID: ${obj._id.toUpperCase()}</p></div>
        <div class="box"><h2>I. ПЕРСОНАЛЬНІ ДАНІ ЗАМОВНИКА</h2><div class="g">
          <div><b>Прізвище, Ім'я, По батькові</b><span>${c?.surname || ''} ${c?.firstName || ''} ${c?.patronymic || ''}</span></div>
          <div><b>Контактний телефон / Email</b><span>${c?.phone || '—'} / ${c?.email || '—'}</span></div>
          <div><b>Паспортні реквізити</b><span>${c?.series || ''}${c?.number || ''} (вид. ${passDate})</span></div>
          <div><b>Орган, що видав документ</b><span>${c?.passport?.issuedBy || '—'}</span></div>
          <div><b>Банківський IBAN Рахунок</b><span style="font-family:monospace">${c?.bank?.iban || '—'}</span></div>
          <div><b>Банк та Власник рахунку</b><span>${c?.bank?.bankName || '—'} / ${c?.bank?.accountOwner || '—'}</span></div>
        </div></div>
        <div class="box"><h2>II. ТЕХНІЧНІ ТА ФІНАНСОВІ ХАРАКТЕРИСТИКИ</h2><div class="g">
          <div style="grid-column: span 2;"><b>Адреса забудови</b><span>${obj.address}</span></div>
          <div><b>Проєктна площа забудови</b><span>${obj.area} м²</span></div>
          <div><b>Координати об'єкта GPS</b><span>${obj.coordinates || 'Не встановлено'}</span></div>
          <div><b>Поточний стан оплати</b><span style="color: #38bdf8; font-weight: 900">${p?.status || 'Pending'}</span></div>
          <div><b>Дата реєстрації в базі</b><span>${regDate}</span></div>
          <div style="grid-column: span 2;"><b>Технічний опис проєкту</b><span>${obj.description}</span></div>
        </div></div>
        <div class="footer">CRM BUILD System | ${new Date().toLocaleString('uk-UA')}</div>
        <script>window.onload=function(){window.print();window.close();}</script>
      </body></html>
    `);
    win.document.close();
  };

  const handlePrintClient = (c) => {
    const win = window.open('', '_blank');
    const passDate = c?.issueDate ? new Date(c.issueDate).toLocaleDateString('uk-UA') : '—';
    win.document.write(`
      <html><head><title>Анкета клієнта</title><style>
        body{font-family:sans-serif;padding:40px;color:#1e293b;line-height:1.6;}
        h1{color:#38bdf8;border-bottom:4px solid #38bdf8;padding-bottom:15px;text-align:center;text-transform:uppercase;font-size:22px;}
        .section{margin-top:25px;border:1px solid #e2e8f0;padding:20px;border-radius:10px;background:#f8fafc;}
        h3{color:#38bdf8;margin-top:0;font-size:16px;text-transform:uppercase;border-bottom:1px solid #e2e8f0;padding-bottom:5px;}
        b{color:#64748b;font-size:12px;text-transform:uppercase;display:block;margin-top:10px;}
        p{margin:0;font-weight:600;font-size:15px;}
      </style></head>
      <body>
        <h1>АНКЕТА КЛІЄНТА: ${c.surname.toUpperCase()}</h1>
        <div class="section">
          <h3>Персональна інформація</h3>
          <b>ПІБ:</b><p>${c.surname} ${c.firstName} ${c.patronymic}</p>
          <b>Телефон:</b><p>${c.phone}</p>
          <b>Електронна адреса:</b><p>${c.email}</p>
        </div>
        <div class="section">
          <h3>Документи та реквізити</h3>
          <b>Паспорт:</b><p>${c.series}${c.number} (вид. ${passDate})</p>
          <b>Виданий:</b><p>${c.issuedBy}</p>
          <b>IBAN:</b><p style="font-family:monospace">${c.iban}</p>
          <b>Банк / Власник:</b><p>${c.bankName} / ${c.accountOwner}</p>
        </div>
        <script>window.onload=function(){window.print();window.close();}</script>
      </body></html>
    `);
    win.document.close();
  };

  const handlePrintPaymentCertificate = (p) => {
    const win = window.open('', '_blank');
    const c = getFullClientData(p.clientId);
    const obj = buildingObjects.find(o => o._id === (p.objectId?._id || p.objectId));
    const payDate = new Date(p.paymentDate).toLocaleDateString('uk-UA');
    const passDate = c?.issueDate ? new Date(c.issueDate).toLocaleDateString('uk-UA') : '—';

    win.document.write(`
      <html><head><title>Довідка про сплату</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 50px; color: #000; line-height: 1.6; }
        .h { text-align: center; text-transform: uppercase; font-weight: bold; font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
        .info { margin-bottom: 20px; font-size: 16px; }
        .info b { display: inline-block; width: 220px; }
        .status-box { border: 2px solid #000; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; margin-top: 30px; }
        .footer { margin-top: 60px; display: flex; justify-content: space-between; font-size: 14px; }
        .stamp { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; }
      </style></head>
      <body>
        <div class="h">ДОВІДКА ПРО СТАН ВЗАЄМОРОЗРАХУНКІВ</div>
        <p>Ця довідка видана замовнику за проєктом будівництва житлового будинку.</p>
        <div class="info"><b>Замовник (ПІБ):</b> ${c?.surname} ${c?.firstName} ${c?.patronymic}</div>
        <div class="info"><b>Паспортні дані:</b> ${c?.series}${c?.number} (вид. ${passDate})</div>
        <div class="info"><b>Адреса об'єкта:</b> ${obj?.address}</div>
        <div class="info"><b>Номер договору/рахунку:</b> ${p.accountNumber}</div>
        <div class="info"><b>IBAN замовника:</b> ${c?.iban}</div>
        <div class="info"><b>Дата реєстрації платежу:</b> ${payDate}</div>
        
        <div class="status-box">СТАТУС: ${p.status === 'Completed' ? 'ПОВНІСТЮ СПЛАЧЕНО' : p.status === 'Pending' ? 'В ОЧІКУВАННІ' : 'БОРГ / ВІДХИЛЕНО'}</div>
        
        <p style="margin-top: 30px;"><b>Нотатки менеджера:</b> ${p.note || 'Відсутні'}</p>

        <div class="footer">
          <div>Дата формування: ${new Date().toLocaleDateString('uk-UA')}</div>
          <div class="stamp">Менеджер (підпис)</div>
        </div>
        <script>window.onload=function(){window.print();window.close();}</script>
      </body></html>
    `);
    win.document.close();
  };

  const handleTemplateSelect = (id) => {
    const t = templates.find(item => item._id === id);
    if (t) {
      setObjFormData({ ...objFormData, templateId: id, area: t.estimatedArea,
        description: `Проєкт: ${t.name}. Кількість кімнат: ${t.rooms}. Одноповерховий тип забудови.`
      });
    }
  };

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <Sidebar $isOpen={menuOpen}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'45px'}}>
          <h2 style={{color:'#38bdf8', margin:0, fontWeight: 900}}>BUILD CRM</h2>
          <IconButton onClick={() => setMenuOpen(false)} style={{color: '#94a3b8'}}><X /></IconButton>
        </div>
        <SidebarItem $active={activeTab === 'dashboard'} onClick={() => handleTabChange('dashboard')}><LayoutDashboard size={20}/> Огляд</SidebarItem>
        <SidebarItem $active={activeTab === 'clients'} onClick={() => handleTabChange('clients')}><Database size={20}/> База клієнтів</SidebarItem>
        <SidebarItem $active={activeTab === 'objects'} onClick={() => handleTabChange('objects')}><Home size={20}/> Об'єкти будівництва</SidebarItem>
        <SidebarItem $active={activeTab === 'payments'} onClick={() => handleTabChange('payments')}><Banknote size={20}/> Стан сплати</SidebarItem>
        <SidebarItem $active={activeTab === 'templates'} onClick={() => handleTabChange('templates')}><FileText size={20}/> Опорні плани</SidebarItem>
        <SidebarItem onClick={() => setLogoutDialogOpen(true)} style={{marginTop:'auto', color:'#ef4444'}}><LogOut size={20}/> Вийти з системи</SidebarItem>
      </Sidebar>

      <MainContent $isMenuOpen={menuOpen}>
        <HeaderSection>
          <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
            {!menuOpen && <IconButton onClick={() => setMenuOpen(true)} style={{color: '#38bdf8'}}><Menu /></IconButton>}
            <div><h3 style={{margin:0}}>{userInfo?.login}</h3><p style={{margin:0, fontSize:'12px', color:'#38bdf8', fontWeight: 700}}>МЕНЕДЖЕР СИСТЕМИ</p></div>
          </div>
          {activeTab === 'clients' && <ActionButton onClick={() => { setFormData({surname:'',firstName:'',patronymic:'',phone:'',email:'',series:'',number:'',issueDate:'',issuedBy:'',iban:'',bankName:'',accountOwner:''}); setEditingId(null); setOpenForm(true); }}><Plus size={18}/> ДОДАТИ КЛІЄНТА</ActionButton>}
          {activeTab === 'objects' && <ActionButton onClick={() => { setObjFormData({address:'', coordinates:'', area:'', description:'', clientId:'', templateId:''}); setSuggestParams({rooms:'', bathrooms:''}); setEditingId(null); setOpenObjForm(true); }}><Plus size={18}/> НОВИЙ ОБ'ЄКТ</ActionButton>}
          {activeTab === 'payments' && <ActionButton onClick={() => { setPayFormData({amount:0, status:'Pending', accountNumber:'', clientId:'', objectId:'', note:''}); setEditingId(null); setOpenPaymentForm(true); }}><Plus size={18}/> ФІКСУВАТИ ПЛАТІЖ</ActionButton>}
        </HeaderSection>

        {(activeTab === 'clients' || activeTab === 'objects' || activeTab === 'payments') && (
          <FilterSection>
            <StyledInput placeholder="Швидкий пошук (ПІБ, адреса, рахунок)..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <StyledInput type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
            <Button onClick={() => {setSearchTerm(''); setFilterDate('');}} style={{color:'#94a3b8', border: '1px solid #334155', borderRadius: '12px'}}>Скинути фільтри</Button>
          </FilterSection>
        )}

        {activeTab === 'clients' && (
          <TableContainer><StyledTable><thead><tr><th>ПІБ Клієнта</th><th>Контакти</th><th>IBAN рахунок</th><th style={{textAlign:'right'}}>Дії</th></tr></thead><tbody>
            {filteredClients.map(c => (<tr key={c._id}><td><b>{c.surname} {c.firstName}</b></td><td>{c.phone}</td><td style={{color:'#38bdf8', fontFamily: 'monospace'}}>{c.iban}</td><td style={{textAlign:'right'}}>
              <IconButton onClick={()=>handlePrintClient(c)} style={{color:'#38bdf8'}}><Printer size={18}/></IconButton>
              <IconButton onClick={()=>{setFormData({...c, ...c.passport, ...c.bank}); setEditingId(c._id); setOpenForm(true);}} style={{color:'#fbbf24'}}><Edit size={18}/></IconButton>
              <IconButton onClick={()=>handleDeleteItem('client', c._id)} style={{color:'#ef4444'}}><Trash2 size={18}/></IconButton>
            </td></tr>))}
          </tbody></StyledTable></TableContainer>
        )}

        {activeTab === 'objects' && (
          <TableContainer><StyledTable><thead><tr><th>Адреса будівництва</th><th>Площа</th><th>Замовник</th><th style={{textAlign:'right'}}>Дії</th></tr></thead><tbody>
            {filteredObjects.map(obj => {
              const client = getFullClientData(obj.clientId);
              return (
                <tr key={obj._id}><td><b>{obj.address}</b></td><td>{obj.area} м²</td><td>{client?.surname || '—'}</td><td style={{textAlign:'right'}}>
                  <IconButton onClick={() => handleFullExtract(obj)} style={{color:'#10b981'}}><ClipboardList size={18}/></IconButton>
                  <IconButton onClick={()=>{setObjFormData({address:obj.address, area:obj.area, coordinates:obj.coordinates, description:obj.description, clientId:client?._id, templateId:obj.templateId}); setEditingId(obj._id); setOpenObjForm(true);}} style={{color:'#fbbf24'}}><Edit size={18}/></IconButton>
                  <IconButton onClick={()=>handleDeleteItem('object', obj._id)} style={{color:'#ef4444'}}><Trash2 size={18}/></IconButton>
                </td></tr>
              )})}
          </tbody></StyledTable></TableContainer>
        )}

        {activeTab === 'payments' && (
          <TableContainer><StyledTable><thead><tr><th>Дата</th><th>Рахунок</th><th>За об'єкт</th><th>Статус</th><th style={{textAlign:'right'}}>Дії</th></tr></thead><tbody>
            {filteredPayments.map(p => {
              const obj = buildingObjects.find(x => x._id === (p.objectId?._id || p.objectId));
              return (
                <tr key={p._id}><td>{new Date(p.paymentDate).toLocaleDateString()}</td><td><b style={{color: '#38bdf8'}}>{p.accountNumber}</b></td><td>{obj?.address || '—'}</td><td>
                  <span style={{color: p.status === 'Completed' ? '#10b981' : p.status === 'Pending' ? '#fbbf24' : '#ef4444', fontWeight: 900}}>{p.status}</span>
                </td><td style={{textAlign:'right'}}>
                  <IconButton onClick={()=>handlePrintPaymentCertificate(p)} style={{color:'#38bdf8'}}><Printer size={18}/></IconButton>
                  <IconButton onClick={()=>{setPayFormData({...p, clientId: p.clientId?._id || p.clientId, objectId: p.objectId?._id || p.objectId}); setEditingId(p._id); setOpenPaymentForm(true);}} style={{color:'#fbbf24'}}><Edit size={18}/></IconButton>
                  <IconButton onClick={()=>handleDeleteItem('payment', p._id)} style={{color:'#ef4444'}}><Trash2 size={18}/></IconButton>
                </td></tr>
              )})}
          </tbody></StyledTable></TableContainer>
        )}

        {activeTab === 'templates' && (
          <TableContainer><StyledTable><thead><tr><th>Назва опорного проєкту</th><th>Кімнати</th><th>Площа</th></tr></thead><tbody>
            {templates.map(t => (<tr key={t._id}><td><b style={{color: '#38bdf8'}}>{t.name}</b></td><td>{t.rooms}</td><td>{t.estimatedArea} м²</td></tr>))}
          </tbody></StyledTable></TableContainer>
        )}

        {activeTab === 'dashboard' && <div style={{textAlign:'center', marginTop:'120px'}}><Home size={100} color="#38bdf8" style={{opacity: 0.2, marginBottom: '20px'}} /><h2>BUILD CRM System</h2><p style={{color: '#94a3b8'}}>Система управління базою клієнтів та планування будівництва.</p></div>}
      </MainContent>

      {/* --- КЛІЄНТ ДІАЛОГ --- */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'24px'}}}>
        <DialogContent><h2 style={{color:'#38bdf8', marginBottom:'20px'}}>{editingId ? 'Редагувати клієнта' : 'Реєстрація клієнта'}</h2>
          <FormGrid onSubmit={handleSubmitClient} id="cf">
            <SectionTitle><User size={14}/> Особисті дані</SectionTitle>
            <InputGroup><label>Прізвище</label><input required value={formData.surname} onChange={e=>setFormData({...formData, surname:e.target.value})}/></InputGroup>
            <InputGroup><label>Ім'я</label><input required value={formData.firstName} onChange={e=>setFormData({...formData, firstName:e.target.value})}/></InputGroup>
            <InputGroup><label>По батькові</label><input required value={formData.patronymic} onChange={e=>setFormData({...formData, patronymic:e.target.value})}/></InputGroup>
            <InputGroup><label>Телефон</label><input required placeholder="+380..." value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})}/></InputGroup>
            <InputGroup $span={2}><label>Email адреса</label><input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})}/></InputGroup>
            <SectionTitle><ShieldCheck size={14}/> Паспортні дані</SectionTitle>
            <InputGroup><label>Серія</label><input required maxLength={2} value={formData.series} onChange={e=>setFormData({...formData, series:e.target.value.toUpperCase()})}/></InputGroup>
            <InputGroup><label>Номер</label><input required value={formData.number} onChange={e=>setFormData({...formData, number:e.target.value})}/></InputGroup>
            <InputGroup><label>Дата видачі</label><input type="date" required value={formData.issueDate} onChange={e=>setFormData({...formData, issueDate:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>Орган видачі</label><input required value={formData.issuedBy} onChange={e=>setFormData({...formData, issuedBy:e.target.value})}/></InputGroup>
            <SectionTitle><Landmark size={14}/> Банківські реквізити</SectionTitle>
            <InputGroup $span={2}><label>IBAN рахунок</label><input required placeholder="UA..." value={formData.iban} onChange={e=>setFormData({...formData, iban:e.target.value.toUpperCase()})}/></InputGroup>
            <InputGroup><label>Назва банку</label><input required value={formData.bankName} onChange={e=>setFormData({...formData, bankName:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>Власник рахунку (ПІБ)</label><input required value={formData.accountOwner} onChange={e=>setFormData({...formData, accountOwner:e.target.value})}/></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}><Button onClick={()=>setOpenForm(false)} style={{color:'#94a3b8'}}>Скасувати</Button><Button type="submit" form="cf" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight:'bold', borderRadius: '10px'}}>Зберегти</Button></DialogActions>
      </Dialog>

      {/* --- ОБ'ЄКТ ДІАЛОГ --- */}
      <Dialog open={openObjForm} onClose={() => setOpenObjForm(false)} maxWidth="md" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'24px'}}}>
        <DialogContent><h2 style={{color:'#38bdf8', marginBottom:'20px'}}>Паспорт об'єкта</h2>
          <FormGrid onSubmit={handleSubmitObject} id="of">
            <SectionTitle><Search size={14}/> Проєкт та Параметри</SectionTitle>
            <InputGroup><label>Кімнат</label><input type="number" value={suggestParams.rooms} onChange={e=>setSuggestParams({...suggestParams, rooms:e.target.value})}/></InputGroup>
            <InputGroup><label>Санвузлів</label><input type="number" value={suggestParams.bathrooms} onChange={e=>setSuggestParams({...suggestParams, bathrooms:e.target.value})}/></InputGroup>
            <InputGroup><label>Варіант проєкту</label><select value={objFormData.templateId} onChange={e=>handleTemplateSelect(e.target.value)}><option value="">Оберіть проєкт...</option>{suggestedTemplates.map(t=><option key={t._id} value={t._id}>{t.name}</option>)}</select></InputGroup>
            <SectionTitle><MapPin size={14}/> Локація забудови</SectionTitle>
            <InputGroup $span={2}><label>Адреса будівництва</label><input required value={objFormData.address} onChange={e=>setObjFormData({...objFormData, address:e.target.value})}/></InputGroup>
            <InputGroup><label>Площа (м²)</label><input type="number" required min="1" value={objFormData.area} onChange={e=>setObjFormData({...objFormData, area:e.target.value})}/></InputGroup>
            <InputGroup $span={2}><label>Замовник</label><select required value={objFormData.clientId} onChange={e=>setObjFormData({...objFormData, clientId:e.target.value})}><option value="">Оберіть замовника...</option>{clients.map(c=><option key={c._id} value={c._id}>{c.surname} {c.firstName}</option>)}</select></InputGroup>
            <InputGroup><label>Координати GPS</label><input value={objFormData.coordinates} onChange={e=>setObjFormData({...objFormData, coordinates:e.target.value})}/></InputGroup>
            <SectionTitle><FileText size={14}/> Технічний опис</SectionTitle>
            <InputGroup $span={3}><textarea required value={objFormData.description} onChange={e=>setObjFormData({...objFormData, description:e.target.value})}/></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}><Button onClick={()=>setOpenObjForm(false)} style={{color:'#94a3b8'}}>Скасувати</Button><Button type="submit" form="of" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight:'bold', borderRadius: '10px'}}>Зберегти</Button></DialogActions>
      </Dialog>

      {/* --- СПЛАТА ДІАЛОГ --- */}
      <Dialog open={openPaymentForm} onClose={() => setOpenPaymentForm(false)} maxWidth="sm" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'24px'}}}>
        <DialogContent><h2 style={{color:'#38bdf8', marginBottom:'20px'}}>Стан сплати</h2>
          <FormGrid onSubmit={handleSubmitPayment} id="pf">
            <InputGroup $span={3}><label>Об'єкт будівництва (за адресою)</label>
              <select required value={payFormData.objectId} onChange={e=>{
                const obj = buildingObjects.find(x=>x._id===e.target.value);
                setPayFormData({...payFormData, objectId: e.target.value, clientId: obj?.clientId?._id || obj?.clientId});
              }}>
                <option value="">Оберіть об'єкт із реєстру...</option>
                {buildingObjects.map(o=><option key={o._id} value={o._id}>{o.address}</option>)}
              </select>
            </InputGroup>
            <InputGroup $span={3}><label>Номер договору / рахунку (цифри)</label><input required placeholder="Введіть номер" value={payFormData.accountNumber} onChange={e=>setPayFormData({...payFormData, accountNumber:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>Нотатки щодо оплати</label><textarea placeholder="Додаткова інформація..." value={payFormData.note} onChange={e=>setPayFormData({...payFormData, note:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>Поточний статус</label><select value={payFormData.status} onChange={e=>setPayFormData({...payFormData, status:e.target.value})}><option value="Pending">В очікуванні</option><option value="Completed">Повністю сплачено</option><option value="Failed">Борг / Відхилено</option></select></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}><Button onClick={()=>setOpenPaymentForm(false)} style={{color:'#94a3b8'}}>Скасувати</Button><Button type="submit" form="pf" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight:'bold', borderRadius: '10px'}}>Зафіксувати</Button></DialogActions>
      </Dialog>

      {/* --- ВИХІД ДІАЛОГ --- */}
      <Dialog 
        open={logoutDialogOpen} 
        onClose={() => setLogoutDialogOpen(false)} 
        maxWidth="xs"
        fullWidth
        PaperProps={{ style: { backgroundColor: '#1e293b', borderRadius: '40px', padding: '15px' } }}
      >
        <DialogContent style={{ padding: '10px' }}>
          <OrangeAlertBar>
            <AlertText><AlertTriangle size={24} /> Вийти з<br/>системи?</AlertText>
            <ConfirmButton onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }}>Так, Вийти</ConfirmButton>
          </OrangeAlertBar>
          <CancelLink onClick={() => setLogoutDialogOpen(false)}>СКАСУВАТИ</CancelLink>
        </DialogContent>
      </Dialog>
      
      <Snackbar open={notify.open} autoHideDuration={3000} onClose={()=>setNotify({...notify, open:false})} anchorOrigin={{vertical:'top',horizontal:'right'}}><Alert severity={notify.severity} variant="filled" style={{borderRadius: '15px'}}>{notify.message}</Alert></Snackbar>
    </DashboardWrapper>
  );
};

export default ManagerDashboard;