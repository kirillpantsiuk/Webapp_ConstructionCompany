import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  LogOut, User, Menu, X, LayoutDashboard, Database, 
  Edit, Trash2, Printer, Plus, ShieldCheck, Landmark, Home, MapPin, AlertTriangle, FileText, Search, ClipboardList, Banknote, BarChart3, Info
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
  td { padding: 18px; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 14px; vertical-align: middle; }
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
  input:focus, select:focus { border-color: #38bdf8; outline: none; }
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

  // --- API ---
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
      console.error("Помилка завантаження даних:", err);
      setNotify({ open: true, message: 'Помилка синхронізації бази даних', severity: 'error' });
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
  const validateAccNumber = (num) => /^\d{3,25}$/.test(num);
  const validateGPS = (coords) => /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(coords);

  // --- Обробники ---
  const handleSubmitClient = async (e) => {
    e.preventDefault();

    const requiredFields = ['surname', 'firstName', 'phone', 'series', 'number', 'issueDate', 'issuedBy', 'iban', 'bankName', 'accountOwner'];
    for (let field of requiredFields) {
      if (!formData[field] || String(formData[field]).trim() === '') {
        setNotify({ open: true, message: 'Заповніть всі обов\'язкові поля!', severity: 'error' });
        return;
      }
    }

    if (!validatePhone(formData.phone)) {
      setNotify({ open: true, message: 'Телефон: +380XXXXXXXXX', severity: 'warning' }); 
      return;
    }

    if (!validateIBAN(formData.iban)) {
      setNotify({ open: true, message: 'IBAN: UA + 27 цифр', severity: 'warning' }); 
      return;
    }

    if (formData.email && formData.email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setNotify({ open: true, message: 'Невірний формат Email!', severity: 'warning' }); 
      return;
    }

    if (new Date(formData.issueDate) > new Date()) {
      setNotify({ open: true, message: 'Дата видачі паспорта не може бути в майбутньому!', severity: 'warning' });
      return;
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
      setNotify({ open: true, message: 'Дані клієнта збережено!', severity: 'success' });
    } catch (err) { console.error("Client Submit Error:", err); setNotify({ open: true, message: 'Помилка збереження даних', severity: 'error' }); }
  };

  const handleSubmitObject = async (e) => {
    e.preventDefault();

    if (!objFormData.address || objFormData.address.trim().length < 5) {
      setNotify({ open: true, message: 'Вкажіть повну адресу будівництва!', severity: 'warning' }); 
      return;
    }

    const areaVal = parseFloat(objFormData.area);
    if (isNaN(areaVal) || areaVal <= 0) {
      setNotify({ open: true, message: 'Вкажіть коректну площу (більше 0)!', severity: 'warning' }); 
      return;
    }

    if (!objFormData.clientId) {
      setNotify({ open: true, message: 'Обов\'язково оберіть замовника зі списку!', severity: 'warning' }); 
      return;
    }

    if (!objFormData.description || objFormData.description.trim().length < 10) {
      setNotify({ open: true, message: 'Додайте детальний технічний опис проєкту!', severity: 'warning' }); 
      return;
    }

    if (objFormData.coordinates && objFormData.coordinates.trim() !== '' && !validateGPS(objFormData.coordinates)) {
      setNotify({ open: true, message: 'Невірний формат GPS (приклад: 49.0275, 33.6281)', severity: 'warning' });
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (editingId) await axios.put(`http://localhost:5000/api/building-objects/${editingId}`, objFormData, config);
      else await axios.post('http://localhost:5000/api/building-objects', objFormData, config);
      setOpenObjForm(false); setEditingId(null); await fetchAllData();
      setNotify({ open: true, message: 'Об’єкт зафіксовано!', severity: 'success' });
    } catch (err) { console.error("Object Submit Error:", err); setNotify({ open: true, message: 'Помилка збереження об\'єкта', severity: 'error' }); }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    
    if (!payFormData.objectId || !payFormData.clientId) {
      setNotify({ open: true, message: 'Спершу оберіть об’єкт будівництва!', severity: 'error' });
      return;
    }

    if (!payFormData.accountNumber || payFormData.accountNumber.trim() === '') {
      setNotify({ open: true, message: 'Введіть номер договору або рахунку!', severity: 'warning' });
      return;
    }
    if (!validateAccNumber(payFormData.accountNumber)) {
      setNotify({ open: true, message: 'Номер рахунку має містити від 3 до 25 цифр!', severity: 'warning' });
      return;
    }

    if (!payFormData.status) {
      setNotify({ open: true, message: 'Оберіть статус платежу!', severity: 'warning' });
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const payload = { ...payFormData, amount: 0 };
      if (editingId) await axios.put(`http://localhost:5000/api/payments/${editingId}`, payload, config);
      else await axios.post('http://localhost:5000/api/payments', payload, config);
      setOpenPaymentForm(false); setEditingId(null); await fetchAllData();
      setNotify({ open: true, message: 'Статус сплати зафіксовано!', severity: 'success' });
    } catch (err) { 
      console.error("Payment API Error:", err);
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
      setNotify({ open: true, message: 'Запис успішно видалено', severity: 'info' });
      await fetchAllData();
    } catch (err) { console.error("Delete Fail:", err); setNotify({ open: true, message: 'Помилка при видаленні', severity: 'error' }); }
  };

  // --- Filtering ---
  const filteredClients = useMemo(() => clients.filter(c => 
    `${c.surname} ${c.firstName} ${c.phone} ${c.iban}`.toLowerCase().includes(searchTerm.toLowerCase())
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

  // --- СТИЛЬНІ РОЗДРУКІВКИ ---
  const handlePrintClient = (c) => {
    const win = window.open('', '_blank');
    const passDate = c?.issueDate ? new Date(c.issueDate).toLocaleDateString('uk-UA') : '—';
    win.document.write(`
      <html><head><title>АНКЕТА: ${c.surname}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; background: #fff; line-height: 1.6; }
        .card { border: 2px solid #38bdf8; border-radius: 20px; padding: 35px; position: relative; }
        .card::before { content: "BUILD CRM"; position: absolute; top: -15px; left: 30px; background: #38bdf8; color: white; padding: 5px 15px; border-radius: 8px; font-weight: 900; font-size: 14px; }
        h1 { color: #38bdf8; text-transform: uppercase; font-size: 26px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 30px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .item label { display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 800; }
        .item span { font-size: 16px; font-weight: 600; color: #0f172a; }
        .sec-title { grid-column: 1/3; margin-top: 20px; color: #38bdf8; font-size: 14px; text-transform: uppercase; border-left: 4px solid #38bdf8; padding-left: 10px; }
        .footer { margin-top: 50px; text-align: right; font-size: 12px; color: #94a3b8; border-top: 1px solid #eee; padding-top: 10px; }
      </style></head>
      <body>
        <div class="card">
          <h1>Анкета Замовника</h1>
          <div class="grid">
            <div class="sec-title">Особисті дані</div>
            <div class="item"><label>Прізвище, Ім'я, По батькові</label><span>${c.surname} ${c.firstName} ${c.patronymic}</span></div>
            <div class="item"><label>Контактний телефон</label><span>${c.phone}</span></div>
            <div class="item" style="grid-column: span 2;"><label>Електронна адреса</label><span>${c.email || '—'}</span></div>
            <div class="sec-title">Документи та реквізити</div>
            <div class="item"><label>Паспортні дані</label><span>${c.series} ${c.number} (вид. ${passDate})</span></div>
            <div class="item"><label>Орган видачі</label><span>${c.issuedBy}</span></div>
            <div class="item" style="grid-column: span 2;"><label>IBAN Рахунок</label><span style="font-family: monospace;">${c.iban}</span></div>
            <div class="item"><label>Назва банку</label><span>${c.bankName}</span></div>
            <div class="item"><label>Власник рахунку</label><span>${c.accountOwner}</span></div>
          </div>
          <div class="footer">BUILD CRM | Сформовано автоматично: ${new Date().toLocaleString('uk-UA')}</div>
        </div>
        <script>window.onload=function(){window.print();window.close();}</script>
      </body></html>
    `);
    win.document.close();
  };

  const handleFullExtract = (obj) => {
    const win = window.open('', '_blank');
    const c = getFullClientData(obj.clientId);
    const p = payments.find(pay => (pay.objectId?._id || pay.objectId) === obj._id);
    const regDate = new Date(obj.createdAt).toLocaleDateString('uk-UA');

    win.document.write(`
      <html><head><title>Витяг - ${obj._id}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
        .doc { border: 4px solid #0f172a; padding: 40px; border-radius: 15px; background: #fff; }
        .h-block { text-align: center; margin-bottom: 40px; }
        h1 { color: #0f172a; text-transform: uppercase; border-bottom: 5px solid #38bdf8; display: inline-block; padding-bottom: 10px; font-size: 24px; }
        .sec { margin-top: 35px; background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .sec h3 { margin: 0 0 15px 0; font-size: 14px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .cell b { font-size: 11px; color: #94a3b8; text-transform: uppercase; display: block; }
        .cell span { font-size: 17px; font-weight: 600; color: #0f172a; }
        .status-badge { float: right; background: #38bdf8; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 800; font-size: 12px; }
        .footer { margin-top: 60px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
      </style></head>
      <body>
        <div class="doc">
          <div class="status-badge">${p?.status || 'PENDING'}</div>
          <div class="h-block"><h1>Паспорт Об'єкта Будівництва</h1><p>Системний ID: ${obj._id.toUpperCase()}</p></div>
          <div class="sec"><h3>Технічні характеристики</h3>
            <div class="row">
              <div class="cell"><b>Адреса забудови</b><span>${obj.address}</span></div>
              <div class="cell"><b>Проєктна площа</b><span>${obj.area} м²</span></div>
              <div class="cell"><b>GPS Координати</b><span>${obj.coordinates || '—'}</span></div>
              <div class="cell"><b>Дата реєстрації</b><span>${regDate}</span></div>
            </div>
            <div style="margin-top:20px; padding:15px; background:#fff; border-radius:8px;"><b>Опис проєкту:</b><br/>${obj.description}</div>
          </div>
          <div class="sec"><h3>Відомості про Замовника</h3>
            <div class="row">
              <div class="cell"><b>ПІБ Замовника</b><span>${c?.surname} ${c?.firstName}</span></div>
              <div class="cell"><b>Контактний телефон</b><span>${c?.phone || '—'}</span></div>
            </div>
          </div>
          <div class="footer"><div>BUILD CRM SYSTEM v2.0</div><div>Стор. 1 з 1</div></div>
        </div>
        <script>window.onload=function(){window.print();window.close();}</script>
      </body></html>
    `);
    win.document.close();
  };

  const handlePrintCertificate = (p) => {
    const win = window.open('', '_blank');
    const c = getFullClientData(p.clientId);
    const obj = buildingObjects.find(o => o._id === (p.objectId?._id || p.objectId));
    win.document.write(`
      <html><head><title>Довідка про сплату</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 60px; line-height: 1.8; color: #000; }
        .h { text-align: center; font-weight: bold; font-size: 22px; text-transform: uppercase; border-bottom: 2px solid #000; margin-bottom: 40px; padding-bottom: 10px; }
        .row { margin-bottom: 15px; border-bottom: 1px dotted #ccc; display: flex; justify-content: space-between; font-size: 19px; }
        .stamp { border: 5px double #f97316; color: #f97316; padding: 25px; width: 350px; margin: 40px auto; text-align: center; font-size: 26px; font-weight: 900; transform: rotate(-3deg); text-transform: uppercase; }
        .note { margin-top: 40px; font-size: 16px; border: 1px solid #000; padding: 20px; background: #fafafa; }
        .footer { margin-top: 100px; display: flex; justify-content: space-between; font-size: 16px; }
      </style></head>
      <body>
        <div class="h">Довідка про стан взаєморозрахунків</div>
        <div class="row"><span>Замовник (ПІБ):</span><b>${c?.surname} ${c?.firstName} ${c?.patronymic}</b></div>
        <div class="row"><span>Паспорт:</span><b>${c?.series}${c?.number}</b></div>
        <div class="row"><span>Об'єкт будівництва:</span><b>${obj?.address}</b></div>
        <div class="row"><span>№ Рахунку / Договору:</span><b>${p.accountNumber}</b></div>
        <div class="row"><span>Дата транзакції:</span><b>${new Date(p.paymentDate).toLocaleDateString('uk-UA')}</b></div>
        
        <div class="stamp" style="border-color: ${p.status === 'Completed' ? '#10b981' : '#f97316'}; color: ${p.status === 'Completed' ? '#10b981' : '#f97316'};">
          ${p.status === 'Completed' ? 'ПОВНІСТЮ СПЛАЧЕНО' : 'В ОЧІКУВАННІ / БОРГ'}
        </div>
        
        <div class="note"><b>Примітки менеджера:</b><br/>${p.note || 'Жодних приміток не зафіксовано.'}</div>
        
        <div class="footer">
          <div>Дата формування: ${new Date().toLocaleDateString('uk-UA')}</div>
          <div style="border-top:1px solid #000; width:250px; text-align:center;">Підпис / Менеджер</div>
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
        description: `Проєкт: ${t.name}. Кількість кімнат: ${t.rooms}. Санвузлів: ${t.bathrooms}. Тип: Одноповерховий.`
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
        <SidebarItem $active={activeTab === 'reports'} onClick={() => handleTabChange('reports')}><BarChart3 size={20}/> Звіт по етапам будівництва</SidebarItem>
        <SidebarItem onClick={() => setLogoutDialogOpen(true)} style={{marginTop:'auto', color:'#ef4444', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px'}}><LogOut size={20}/> Вийти з системи</SidebarItem>
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

        {activeTab === 'dashboard' && <div style={{textAlign:'center', marginTop:'120px'}}><Home size={100} color="#38bdf8" style={{opacity: 0.2, marginBottom: '20px'}} /><h2>BUILD CRM System</h2><p style={{color: '#94a3b8'}}>Система управління базою клієнтів та фінансами будівництва.</p></div>}

        {activeTab === 'reports' && (
          <div style={{animation: 'fadeIn 0.3s'}}>
            <SectionTitle><BarChart3 size={18}/> Звіт по етапам будівництва</SectionTitle>
            <div style={{textAlign: 'center', color: '#94a3b8', marginTop: '80px'}}>
              <Info size={50} style={{marginBottom: '15px', color: '#38bdf8'}}/><br/>
              <h3 style={{margin: '0 0 10px 0', color: 'white'}}>Розділ знаходиться в розробці</h3>
              <p style={{margin: 0}}>Тут буде відображатися детальна аналітика та звіти по етапам будівництва об'єктів.</p>
            </div>
          </div>
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
                  <IconButton onClick={()=>handlePrintCertificate(p)} style={{color:'#38bdf8'}}><Printer size={18}/></IconButton>
                  <IconButton onClick={()=>{setPayFormData({...p, clientId: p.clientId?._id || p.clientId, objectId: p.objectId?._id || p.objectId}); setEditingId(p._id); setOpenPaymentForm(true);}} style={{color:'#fbbf24'}}><Edit size={18}/></IconButton>
                  <IconButton onClick={()=>handleDeleteItem('payment', p._id)} style={{color:'#ef4444'}}><Trash2 size={18}/></IconButton>
                </td></tr>
              )})}
          </tbody></StyledTable></TableContainer>
        )}

        {activeTab === 'templates' && (
          <TableContainer><StyledTable><thead><tr><th>Назва опорного проєкту</th><th>Кімнати</th><th>СВ</th><th>Площа</th><th>Конфігурація</th></tr></thead><tbody>
            {templates.map(t => (<tr key={t._id}><td><b style={{color: '#38bdf8'}}>{t.name}</b></td><td>{t.rooms}</td><td>{t.bathrooms}</td><td>{t.estimatedArea} м²</td><td><small>{t.configuration}</small></td></tr>))}
          </tbody></StyledTable></TableContainer>
        )}
      </MainContent>

      {/* --- КЛІЄНТ ДІАЛОГ --- */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'24px'}}}>
        <DialogContent><h2 style={{color:'#38bdf8', marginBottom:'20px'}}>{editingId ? 'Редагувати клієнта' : 'Новий замовник'}</h2>
          <FormGrid onSubmit={handleSubmitClient} id="cf">
            <SectionTitle><User size={14}/> Особисті дані</SectionTitle>
            <InputGroup><label>Прізвище *</label><input required value={formData.surname} onChange={e=>setFormData({...formData, surname:e.target.value})}/></InputGroup>
            <InputGroup><label>Ім'я *</label><input required value={formData.firstName} onChange={e=>setFormData({...formData, firstName:e.target.value})}/></InputGroup>
            <InputGroup><label>По батькові</label><input value={formData.patronymic} onChange={e=>setFormData({...formData, patronymic:e.target.value})}/></InputGroup>
            <InputGroup><label>Телефон *</label><input required placeholder="+380..." value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})}/></InputGroup>
            <InputGroup $span={2}><label>Email адреса</label><input type="email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})}/></InputGroup>
            <SectionTitle><ShieldCheck size={14}/> Паспортні дані</SectionTitle>
            <InputGroup><label>Серія *</label><input required maxLength={2} value={formData.series} onChange={e=>setFormData({...formData, series:e.target.value.toUpperCase()})}/></InputGroup>
            <InputGroup><label>Номер *</label><input required value={formData.number} onChange={e=>setFormData({...formData, number:e.target.value})}/></InputGroup>
            <InputGroup><label>Дата видачі *</label><input type="date" required value={formData.issueDate} onChange={e=>setFormData({...formData, issueDate:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>Орган видачі *</label><input required value={formData.issuedBy} onChange={e=>setFormData({...formData, issuedBy:e.target.value})}/></InputGroup>
            <SectionTitle><Landmark size={14}/> Банківські реквізити</SectionTitle>
            <InputGroup $span={2}><label>IBAN рахунок *</label><input required placeholder="UA..." value={formData.iban} onChange={e=>setFormData({...formData, iban:e.target.value.toUpperCase()})}/></InputGroup>
            <InputGroup><label>Назва банку *</label><input required value={formData.bankName} onChange={e=>setFormData({...formData, bankName:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>ПІБ власника рахунку *</label><input required value={formData.accountOwner} onChange={e=>setFormData({...formData, accountOwner:e.target.value})}/></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}><Button onClick={()=>setOpenForm(false)} style={{color:'#94a3b8'}}>Скасувати</Button><Button type="submit" form="cf" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight:'bold', borderRadius: '10px'}}>Зберегти</Button></DialogActions>
      </Dialog>

      {/* --- ОБ'ЄКТ ДІАЛОГ --- */}
      <Dialog open={openObjForm} onClose={() => setOpenObjForm(false)} maxWidth="md" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'24px'}}}>
        <DialogContent><h2 style={{color:'#38bdf8', marginBottom:'20px'}}>Паспорт об'єкта</h2>
          <FormGrid onSubmit={handleSubmitObject} id="of">
            <SectionTitle><Search size={14}/> Проєкт та Параметри</SectionTitle>
            <InputGroup><label>Кімнат</label><input type="number" min="0" value={suggestParams.rooms} onChange={e=>setSuggestParams({...suggestParams, rooms:e.target.value < 0 ? 0 : e.target.value})}/></InputGroup>
            <InputGroup><label>Санвузлів</label><input type="number" min="0" value={suggestParams.bathrooms} onChange={e=>setSuggestParams({...suggestParams, bathrooms:e.target.value < 0 ? 0 : e.target.value})}/></InputGroup>
            <InputGroup><label>Варіант проєкту</label><select value={objFormData.templateId} onChange={e=>handleTemplateSelect(e.target.value)}><option value="">Оберіть проєкт...</option>
                {suggestedTemplates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select></InputGroup>
            <SectionTitle><MapPin size={14}/> Локація забудови</SectionTitle>
            <InputGroup $span={2}><label>Адреса будівництва *</label><input required value={objFormData.address} onChange={e=>setObjFormData({...objFormData, address:e.target.value})}/></InputGroup>
            <InputGroup><label>Площа (м²) *</label><input type="number" required min="1" value={objFormData.area} onChange={e=>setObjFormData({...objFormData, area:e.target.value})}/></InputGroup>
            <InputGroup $span={2}><label>Замовник *</label><select required value={objFormData.clientId} onChange={e=>setObjFormData({...objFormData, clientId:e.target.value})}><option value="">Оберіть замовника...</option>{clients.map(c=><option key={c._id} value={c._id}>{c.surname} {c.firstName}</option>)}</select></InputGroup>
            <InputGroup><label>Координати GPS</label><input placeholder="49.0275, 33.6281" value={objFormData.coordinates} onChange={e=>setObjFormData({...objFormData, coordinates:e.target.value})}/></InputGroup>
            <SectionTitle><FileText size={14}/> Технічний опис</SectionTitle>
            <InputGroup $span={3}><label>Детальний опис проєкту *</label><textarea required value={objFormData.description} onChange={e=>setObjFormData({...objFormData, description:e.target.value})}/></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}><Button onClick={()=>setOpenObjForm(false)} style={{color:'#94a3b8'}}>Скасувати</Button><Button type="submit" form="of" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight:'bold', borderRadius: '10px'}}>Зберегти</Button></DialogActions>
      </Dialog>

      {/* --- СПЛАТА ДІАЛОГ --- */}
      <Dialog open={openPaymentForm} onClose={() => setOpenPaymentForm(false)} maxWidth="sm" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'24px'}}}>
        <DialogContent><h2 style={{color:'#38bdf8', marginBottom:'20px'}}>Стан сплати</h2>
          <FormGrid onSubmit={handleSubmitPayment} id="pf">
            <InputGroup $span={3}><label>Об'єкт будівництва (за адресою) *</label>
              <select required value={payFormData.objectId} onChange={e=>{
                const obj = buildingObjects.find(x=>x._id===e.target.value);
                setPayFormData({...payFormData, objectId: e.target.value, clientId: obj?.clientId?._id || obj?.clientId});
              }}>
                <option value="">Оберіть об'єкт із реєстру...</option>
                {buildingObjects.map(o=><option key={o._id} value={o._id}>{o.address}</option>)}
              </select>
            </InputGroup>
            <InputGroup $span={3}><label>Номер договору / рахунку (цифри) *</label><input required placeholder="Введіть номер (3-25 цифр)" value={payFormData.accountNumber} onChange={e=>setPayFormData({...payFormData, accountNumber:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>Нотатки менеджера</label><textarea placeholder="Додаткова інформація..." value={payFormData.note} onChange={e=>setPayFormData({...payFormData, note:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>Поточний статус *</label><select required value={payFormData.status} onChange={e=>setPayFormData({...payFormData, status:e.target.value})}><option value="Pending">В очікуванні</option><option value="Completed">Повністю сплачено</option><option value="Failed">Відхилено / Борг</option></select></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}><Button onClick={()=>setOpenPaymentForm(false)} style={{color:'#94a3b8'}}>Скасувати</Button><Button type="submit" form="pf" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight:'bold', borderRadius: '10px'}}>Зафіксувати</Button></DialogActions>
      </Dialog>

      {/* --- ЛОГАУТ ДІАЛОГ --- */}
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