import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  LogOut, User, Menu, X, LayoutDashboard, Database, 
  Edit, Trash2, Printer, Plus, ShieldCheck, Landmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  Alert, Snackbar, IconButton, Tooltip
} from '@mui/material';

const GlobalStyle = createGlobalStyle`
  body, html { margin: 0; padding: 0; background-color: #0a0f16; color: white; font-family: 'Inter', sans-serif; }
  * { box-sizing: border-box; }
`;

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
  input { padding: 10px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: white; }
`;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });

  const [userInfo] = useState(() => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null;
  });

  const [formData, setFormData] = useState({
    surname: '', firstName: '', patronymic: '', phone: '', email: '',
    series: '', number: '', issueDate: '', issuedBy: '',
    iban: '', bankName: '', accountOwner: ''
  });

  const fetchClients = useCallback(async () => {
    if (!userInfo?.token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/clients', config);
      
      // КРИТИЧНО: "Вирівнюємо" дані, бо вони приходять вкладеними
      const processedData = data.map(c => ({
        ...c,
        series: c.passport?.series || '',
        number: c.passport?.number || '',
        issueDate: c.passport?.issueDate ? c.passport.issueDate.split('T')[0] : '',
        issuedBy: c.passport?.issuedBy || '',
        iban: c.bank?.iban || '',
        bankName: c.bank?.bankName || '',
        accountOwner: c.bank?.accountOwner || ''
      }));

      console.log("Отримано клієнтів:", processedData);
      setClients(processedData);
    } catch (err) { 
      console.error("Fetch error:", err); 
    }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'Manager') navigate('/login');
  }, [userInfo, navigate]);

  // Важливо: викликаємо завантаження при зміні вкладки
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
    if (tab === 'clients') fetchClients();
  };

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const searchStr = `${c.surname} ${c.firstName} ${c.phone} ${c.iban} ${c.email}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      const matchesDate = filterDate ? c.createdAt.startsWith(filterDate) : true;
      return matchesSearch && matchesDate;
    });
  }, [clients, searchTerm, filterDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/clients/${editingId}`, formData, config);
        setNotify({ open: true, message: 'Дані оновлено!', severity: 'success' });
      } else {
        await axios.post('http://localhost:5000/api/clients', formData, config);
        setNotify({ open: true, message: 'Клієнта створено успішно!', severity: 'success' });
      }
      setOpenForm(false);
      setEditingId(null);
      fetchClients();
    } catch (err) { 
      console.error("Submit error:", err);
      setNotify({ open: true, message: 'Помилка при збереженні', severity: 'error' }); 
    }
  };

  const deleteClient = async (id) => {
    if (window.confirm('Видалити клієнта та всі пов’язані дані?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/clients/${id}`, config);
        fetchClients();
        setNotify({ open: true, message: 'Видалено', severity: 'info' });
      } catch (err) { console.error(err); }
    }
  };

  const handlePrint = (client) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Картка ${client.surname}</title>
      <style>
        body{font-family:sans-serif;padding:40px;color:#1e293b;} 
        .header{text-align:center;border-bottom:2px solid #38bdf8;margin-bottom:20px;} 
        .section{margin-top:20px;padding:15px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;} 
        h3{color:#38bdf8;margin-top:0;} b{color:#0f172a;}
      </style></head>
      <body>
        <div class="header"><h1>АНКЕТА КЛІЄНТА №${client._id.slice(-6).toUpperCase()}</h1></div>
        <div class="section">
          <h3>ОСОБИСТІ ДАНІ</h3>
          <p>ПІБ: <b>${client.surname} ${client.firstName} ${client.patronymic}</b></p>
          <p>Телефон: <b>${client.phone}</b> | Email: <b>${client.email}</b></p>
        </div>
        <div class="section">
          <h3>ПАСПОРТНІ ДАНІ</h3>
          <p>Серія/Номер: <b>${client.series} ${client.number}</b></p>
          <p>Виданий: <b>${client.issuedBy}</b> від <b>${new Date(client.issueDate).toLocaleDateString()}</b></p>
        </div>
        <div class="section">
          <h3>БАНКІВСЬКІ РЕКВІЗИТИ</h3>
          <p>IBAN: <b>${client.iban}</b></p>
          <p>Банк: <b>${client.bankName}</b> | Власник: <b>${client.accountOwner}</b></p>
        </div>
        <script>window.onload = function(){ window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
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
        <SidebarItem onClick={() => setLogoutDialogOpen(true)} style={{marginTop:'auto', color:'#ef4444'}}><LogOut size={20}/> Вийти</SidebarItem>
      </Sidebar>

      <MainContent $isMenuOpen={menuOpen}>
        <HeaderSection>
          <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
            {!menuOpen && <Menu style={{cursor:'pointer', color:'#38bdf8'}} onClick={() => setMenuOpen(true)} />}
            <div><h3 style={{margin:0}}>{userInfo?.login}</h3><p style={{margin:0, fontSize:'12px', color:'#94a3b8'}}>Менеджер системи</p></div>
          </div>
          <ActionButton onClick={() => { setFormData({surname:'',firstName:'',patronymic:'',phone:'',email:'',series:'',number:'',issueDate:'',issuedBy:'',iban:'',bankName:'',accountOwner:''}); setEditingId(null); setOpenForm(true); }}>
            <Plus size={18}/> Додати клієнта
          </ActionButton>
        </HeaderSection>

        {activeTab === 'clients' && (
          <>
            <FilterSection>
              <StyledInput placeholder="Пошук за ПІБ, телефоном..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <StyledInput type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              <Button variant="outlined" style={{color:'#94a3b8', borderColor:'#334155'}} onClick={() => {setSearchTerm(''); setFilterDate('');}}>Скинути</Button>
            </FilterSection>

            <TableContainer>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Клієнт (ПІБ)</th>
                    <th>Контакти</th>
                    <th>IBAN / Банк</th>
                    <th style={{textAlign:'right'}}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(c => (
                    <tr key={c._id}>
                      <td><b>{c.surname} {c.firstName} {c.patronymic[0]}.</b></td>
                      <td><div style={{fontSize:'12px'}}>{c.phone}</div><div style={{fontSize:'11px', color:'#94a3b8'}}>{c.email}</div></td>
                      <td><div style={{fontSize:'12px', color:'#38bdf8'}}>{c.iban}</div><div style={{fontSize:'11px'}}>{c.bankName}</div></td>
                      <td style={{textAlign:'right'}}>
                        <Tooltip title="Друк"><IconButton onClick={() => handlePrint(c)} style={{color:'#38bdf8'}}><Printer size={18}/></IconButton></Tooltip>
                        <Tooltip title="Редагувати"><IconButton onClick={() => {setFormData(c); setEditingId(c._id); setOpenForm(true);}} style={{color:'#fbbf24'}}><Edit size={18}/></IconButton></Tooltip>
                        <Tooltip title="Видалити"><IconButton onClick={() => deleteClient(c._id)} style={{color:'#ef4444'}}><Trash2 size={18}/></IconButton></Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
              {filteredClients.length === 0 && <div style={{padding:'40px', textAlign:'center', color:'#94a3b8'}}>Клієнтів не знайдено</div>}
            </TableContainer>
          </>
        )}

        {activeTab === 'dashboard' && (
          <div style={{textAlign:'center', marginTop:'100px'}}>
             <Database size={80} color="#38bdf8" style={{opacity: 0.2, marginBottom: '20px'}} />
             <h2 style={{color: '#94a3b8'}}>Система готова до роботи.</h2>
             <p style={{color: '#64748b'}}>Відкрийте вкладку "База клієнтів", щоб побачити наявні записи.</p>
          </div>
        )}
      </MainContent>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'20px'}}}>
        <DialogContent>
          <h2 style={{color:'#38bdf8', marginBottom:'20px'}}>{editingId ? 'Редагування' : 'Новий клієнт'}</h2>
          <FormGrid onSubmit={handleSubmit} id="clientForm">
            <SectionTitle><User size={14}/> Особиста інформація</SectionTitle>
            <InputGroup><label>Прізвище</label><input required value={formData.surname} onChange={e=>setFormData({...formData, surname:e.target.value})}/></InputGroup>
            <InputGroup><label>Ім'я</label><input required value={formData.firstName} onChange={e=>setFormData({...formData, firstName:e.target.value})}/></InputGroup>
            <InputGroup><label>По батькові</label><input required value={formData.patronymic} onChange={e=>setFormData({...formData, patronymic:e.target.value})}/></InputGroup>
            <InputGroup><label>Телефон</label><input required value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})}/></InputGroup>
            <InputGroup $span={2}><label>Email</label><input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})}/></InputGroup>
            <SectionTitle><ShieldCheck size={14}/> Паспортні дані</SectionTitle>
            <InputGroup><label>Серія</label><input required maxLength={2} value={formData.series} onChange={e=>setFormData({...formData, series:e.target.value.toUpperCase()})}/></InputGroup>
            <InputGroup><label>Номер</label><input required value={formData.number} onChange={e=>setFormData({...formData, number:e.target.value})}/></InputGroup>
            <InputGroup><label>Дата видачі</label><input type="date" required value={formData.issueDate} onChange={e=>setFormData({...formData, issueDate:e.target.value})}/></InputGroup>
            <InputGroup $span={3}><label>Ким виданий</label><input required value={formData.issuedBy} onChange={e=>setFormData({...formData, issuedBy:e.target.value})}/></InputGroup>
            <SectionTitle><Landmark size={14}/> Банк</SectionTitle>
            <InputGroup $span={2}><label>IBAN</label><input required value={formData.iban} onChange={e=>setFormData({...formData, iban:e.target.value.toUpperCase()})}/></InputGroup>
            <InputGroup><label>Назва банку</label><input required value={formData.bankName} onChange={e=>setFormData({...formData, bankName:e.target.value})}/></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}>
          <Button onClick={()=>setOpenForm(false)} style={{color:'#94a3b8'}}>Скасувати</Button>
          <Button type="submit" form="clientForm" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight:'bold'}}>Зберегти</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutDialogOpen} onClose={()=>setLogoutDialogOpen(false)} PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'15px'}}}>
        <DialogContent>Вийти з системи?</DialogContent>
        <DialogActions>
          <Button onClick={()=>setLogoutDialogOpen(false)} style={{color:'#94a3b8'}}>Ні</Button>
          <Button onClick={()=>{localStorage.removeItem('userInfo'); navigate('/login');}} color="error" variant="contained">Так</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={notify.open} autoHideDuration={3000} onClose={()=>setNotify({...notify, open:false})} anchorOrigin={{vertical:'top',horizontal:'right'}}><Alert severity={notify.severity} variant="filled">{notify.message}</Alert></Snackbar>
    </DashboardWrapper>
  );
};

export default ManagerDashboard;