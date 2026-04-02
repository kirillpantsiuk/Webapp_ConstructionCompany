import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  LogOut, User, Menu, X, UserPlus, 
  LayoutDashboard, Database, ShieldCheck, Landmark 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  Alert, Snackbar 
} from '@mui/material';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0; padding: 0;
    background-color: #0a0f16;
    color: white;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  * { box-sizing: border-box; }
`;

const DashboardWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  background: radial-gradient(circle at 50% 50%, #111827 0%, #0a0f16 100%);
`;

const Sidebar = styled.div`
  position: fixed;
  left: ${props => (props.$isOpen ? '0' : '-280px')};
  top: 0;
  width: 280px;
  height: 100%;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 18px;
  border-radius: 12px;
  cursor: pointer;
  color: ${props => (props.$active ? '#38bdf8' : '#94a3b8')};
  background: ${props => (props.$active ? 'rgba(56, 189, 248, 0.1)' : 'transparent')};
  margin-bottom: 8px;
  transition: 0.2s;
  &:hover { background: rgba(56, 189, 248, 0.05); color: white; }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px;
  margin-left: ${props => (props.$isMenuOpen ? '280px' : '0')};
  transition: margin 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 41, 59, 0.4);
  padding: 20px 30px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  margin-bottom: 30px;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 900px;
  background: rgba(30, 41, 59, 0.3);
  padding: 40px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #38bdf8;
  margin: 25px 0 15px 0;
  text-transform: uppercase;
  font-size: 13px;
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${props => props.$span ? `span ${props.$span}` : 'auto'};
  label { font-size: 12px; color: #94a3b8; font-weight: 600; }
  input {
    padding: 12px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    &:focus { outline: none; border-color: #38bdf8; }
  }
`;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });

  const [userInfo] = useState(() => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null;
  });

  const [formData, setFormData] = useState({
    surname: '', firstName: '', patronymic: '',
    phone: '', email: '',
    series: '', number: '', issueDate: '', issuedBy: '',
    iban: '', bankName: '', accountOwner: ''
  });

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'Manager') {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const validate = () => {
    const phoneRegex = /^\+\d{10,15}$/;
    const ibanRegex = /^UA\d{27}$/;

    if (!phoneRegex.test(formData.phone)) {
      setNotify({ open: true, message: 'Телефон має бути у форматі +380...', severity: 'error' });
      return false;
    }
    if (!ibanRegex.test(formData.iban)) {
      setNotify({ open: true, message: 'IBAN має починатися з UA та містити 27 цифр', severity: 'error' });
      return false;
    }
    if (formData.series.length !== 2) {
      setNotify({ open: true, message: 'Серія паспорта має містити 2 літери', severity: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const finalData = {
        ...formData,
        accountOwner: formData.accountOwner || `${formData.surname} ${formData.firstName} ${formData.patronymic}`
      };

      await axios.post('http://localhost:5000/api/clients', finalData, config);
      setNotify({ open: true, message: 'Клієнта успішно створено!', severity: 'success' });
      
      setFormData({
        surname: '', firstName: '', patronymic: '',
        phone: '', email: '', series: '', number: '', 
        issueDate: '', issuedBy: '', iban: '', bankName: '', accountOwner: ''
      });
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      let errorMessage = 'Помилка при збереженні';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage;
      }
      setNotify({ open: true, message: `Помилка: ${errorMessage}`, severity: 'error' });
    }
  };

  return (
    <DashboardWrapper>
      <GlobalStyle />
      
      <Sidebar $isOpen={menuOpen}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'40px'}}>
          <h2 style={{fontSize:'20px', color:'#38bdf8', margin:0}}>BUILD CRM</h2>
          <X style={{cursor:'pointer'}} onClick={() => setMenuOpen(false)} />
        </div>
        <SidebarItem $active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setMenuOpen(false);}}>
          <LayoutDashboard size={20} /> Огляд
        </SidebarItem>
        <SidebarItem $active={activeTab === 'addClient'} onClick={() => {setActiveTab('addClient'); setMenuOpen(false);}}>
          <UserPlus size={20} /> Створити карту клієнта
        </SidebarItem>
        <SidebarItem onClick={() => setOpenLogoutDialog(true)} style={{marginTop:'auto', color:'#ef4444'}}>
          <LogOut size={20} /> Вийти
        </SidebarItem>
      </Sidebar>

      <MainContent $isMenuOpen={menuOpen}>
        <HeaderSection>
          <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
            {!menuOpen && <Menu style={{cursor:'pointer', color:'#38bdf8'}} onClick={() => setMenuOpen(true)} />}
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
              <div style={{padding:'10px', background:'rgba(56,189,248,0.1)', borderRadius:'12px', color:'#38bdf8'}}><User size={20}/></div>
              <div>
                <h3 style={{margin:0}}>{userInfo?.login}</h3>
                <p style={{margin:0, fontSize:'12px', color:'#94a3b8'}}>Менеджер</p>
              </div>
            </div>
          </div>
        </HeaderSection>

        {activeTab === 'dashboard' ? (
          <div style={{textAlign:'center', marginTop:'80px', opacity:0.5}}>
            <Database size={80} strokeWidth={1} />
            <h3>Виберіть дію в меню зліва</h3>
          </div>
        ) : (
          <FormContainer>
            <h2 style={{marginBottom:'30px', fontSize: '22px'}}>Реєстрація клієнта</h2>
            <FormGrid onSubmit={handleSubmit}>
              
              <SectionTitle style={{gridColumn: '1/4'}}><User size={16}/> Основна інформація</SectionTitle>
              <InputGroup><label>Прізвище</label><input required value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} /></InputGroup>
              <InputGroup><label>Ім'я</label><input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></InputGroup>
              <InputGroup><label>По батькові</label><input required value={formData.patronymic} onChange={e => setFormData({...formData, patronymic: e.target.value})} /></InputGroup>
              
              <InputGroup $span={1}><label>Телефон</label><input required placeholder="+380..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></InputGroup>
              <InputGroup $span={2}><label>Email</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></InputGroup>

              <SectionTitle style={{gridColumn: '1/4'}}><ShieldCheck size={16}/> Паспортні дані</SectionTitle>
              <InputGroup><label>Серія (2 букви)</label><input required maxLength={2} value={formData.series} onChange={e => setFormData({...formData, series: e.target.value.toUpperCase()})} /></InputGroup>
              <InputGroup><label>Номер</label><input required value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} /></InputGroup>
              <InputGroup><label>Дата видачі</label><input type="date" required value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} /></InputGroup>
              <InputGroup $span={3}><label>Ким виданий</label><input required value={formData.issuedBy} onChange={e => setFormData({...formData, issuedBy: e.target.value})} /></InputGroup>

              <SectionTitle style={{gridColumn: '1/4'}}><Landmark size={16}/> Банківські реквізити</SectionTitle>
              <InputGroup $span={3}><label>IBAN (UA + 27 цифр)</label><input required placeholder="UA..." value={formData.iban} onChange={e => setFormData({...formData, iban: e.target.value.toUpperCase()})} /></InputGroup>
              <InputGroup $span={1}><label>Назва банку</label><input required value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} /></InputGroup>
              <InputGroup $span={2}><label>Власник рахунку (якщо інша особа)</label><input placeholder="За замовчуванням: ПІБ клієнта" value={formData.accountOwner} onChange={e => setFormData({...formData, accountOwner: e.target.value})} /></InputGroup>

              <button type="submit" style={{gridColumn:'1/4', padding:'16px', background:'#38bdf8', border:'none', borderRadius:'12px', fontWeight:'700', cursor:'pointer', marginTop:'20px', color: '#0a0f16'}}>Зберегти клієнта</button>
            </FormGrid>
          </FormContainer>
        )}
      </MainContent>

      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} PaperProps={{style:{borderRadius:'24px', backgroundColor:'#1e293b', color:'white'}}}>
        <DialogContent><Alert severity="warning" variant="filled">Вийти з системи?</Alert></DialogContent>
        <DialogActions style={{justifyContent:'center', paddingBottom:'20px'}}>
          <Button onClick={() => {localStorage.removeItem('userInfo'); navigate('/login');}} color="inherit">ВИЙТИ</Button>
          <Button onClick={() => setOpenLogoutDialog(false)} style={{color:'#94a3b8'}}>Скасувати</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notify.open} autoHideDuration={4000} onClose={() => setNotify({...notify, open: false})} anchorOrigin={{vertical:'top', horizontal:'right'}}><Alert severity={notify.severity} variant="filled">{notify.message}</Alert></Snackbar>
    </DashboardWrapper>
  );
};

export default ManagerDashboard;