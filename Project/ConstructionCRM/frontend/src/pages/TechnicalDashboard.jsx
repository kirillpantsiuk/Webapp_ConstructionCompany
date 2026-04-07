import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  LogOut, Menu, X, LayoutDashboard, 
  Edit, Trash2, Printer, Plus, Home, MapPin, AlertTriangle, FileText, Hammer, Calendar, ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  Alert, Snackbar, IconButton 
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
  const [filterDate, setFilterDate] = useState('');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [openStageForm, setOpenStageForm] = useState(false);
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });
  const [buildingObjects, setBuildingObjects] = useState([]);

  const [userInfo] = useState(() => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null;
  });

  // --- Перевірка доступу ---
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (userInfo.role !== 'TechnicalCoordinator') {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // --- Завантаження даних (ВИПРАВЛЕНО: useCallback + безпечний виклик) ---
  const fetchObjects = useCallback(async () => {
    if (!userInfo?.token || userInfo.role !== 'TechnicalCoordinator') return;
    
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      const res = await axios.get('http://localhost:5000/api/building-objects', config);
      setBuildingObjects(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, [userInfo]);

  useEffect(() => {
    // Використовуємо setTimeout, щоб винести setState з основного циклу рендеру ефекту
    // Це усуває помилку "cascading renders"
    const timer = setTimeout(() => {
      if (userInfo && userInfo.role === 'TechnicalCoordinator') {
        fetchObjects();
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, [userInfo, fetchObjects]); 

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
    setSearchTerm('');
    setFilterDate('');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const filteredObjects = useMemo(() => {
    return buildingObjects.filter(obj => 
      obj.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDate ? obj.createdAt.startsWith(filterDate) : true)
    );
  }, [buildingObjects, searchTerm, filterDate]);

  // --- Стильні роздруківки ---
  const handlePrintTechPass = (obj) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>ТЕХ-ПАСПОРТ: ${obj.address}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
        .doc { border: 4px solid #0f172a; padding: 40px; border-radius: 15px; background: #fff; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .h { text-align: center; border-bottom: 4px solid #38bdf8; margin-bottom: 40px; padding-bottom: 20px; }
        h1 { margin: 0; color: #0f172a; text-transform: uppercase; font-size: 24px; letter-spacing: 1px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px; }
        .box { background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .box b { display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px; }
        .box span { font-size: 17px; font-weight: 700; color: #0f172a; }
        .footer { margin-top: 60px; display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; border-top: 1px solid #eee; padding-top: 20px; }
      </style></head>
      <body>
        <div class="doc">
          <div class="h"><h1>Технічний паспорт об'єкта</h1><p>Електронний реєстр BUILD CRM</p></div>
          <div class="grid">
            <div class="box"><b>Адреса об'єкта</b><span>${obj.address}</span></div>
            <div class="box"><b>Загальна площа</b><span>${obj.area} м²</span></div>
            <div class="box"><b>Координати GPS</b><span>${obj.coordinates || 'Дані відсутні'}</span></div>
            <div class="box"><b>Дата реєстрації</b><span>${new Date(obj.createdAt).toLocaleDateString('uk-UA')}</span></div>
          </div>
          <div class="box" style="margin-top:20px;">
            <b>Технічні примітки та опис проєкту</b>
            <p style="margin: 10px 0 0 0; color: #334155;">${obj.description || 'Опис не внесено'}</p>
          </div>
          <div class="footer">
            <div>Відповідальний координатор: ${userInfo?.login}</div>
            <div>Дата витягу: ${new Date().toLocaleString('uk-UA')}</div>
          </div>
        </div>
        <script>window.onload=function(){window.print();window.close();}</script>
      </body></html>
    `);
    win.document.close();
  };

  return (
    <DashboardWrapper>
      <GlobalStyle />
      
      {/* --- Sidebar --- */}
      <Sidebar $isOpen={menuOpen}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'45px'}}>
          <h2 style={{color:'#38bdf8', margin:0, fontWeight: 900}}>BUILD TECH</h2>
          <IconButton onClick={() => setMenuOpen(false)} style={{color: '#94a3b8'}}><X /></IconButton>
        </div>
        <SidebarItem $active={activeTab === 'dashboard'} onClick={() => handleTabChange('dashboard')}><LayoutDashboard size={20}/> Огляд</SidebarItem>
        <SidebarItem $active={activeTab === 'objects'} onClick={() => handleTabChange('objects')}><Home size={20}/> Мої об'єкти</SidebarItem>
        <SidebarItem $active={activeTab === 'stages'} onClick={() => handleTabChange('stages')}><Hammer size={20}/> Етапи робіт</SidebarItem>
        <SidebarItem $active={activeTab === 'templates'} onClick={() => handleTabChange('templates')}><ClipboardList size={20}/> Проєкти</SidebarItem>
        <SidebarItem onClick={() => setLogoutDialogOpen(true)} style={{marginTop:'auto', color:'#ef4444', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px'}}><LogOut size={20}/> Вийти з системи</SidebarItem>
      </Sidebar>

      <MainContent $isMenuOpen={menuOpen}>
        {/* --- Header --- */}
        <HeaderSection>
          <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
            {!menuOpen && <IconButton onClick={() => setMenuOpen(true)} style={{color: '#38bdf8'}}><Menu /></IconButton>}
            <div>
              <h3 style={{margin:0}}>{userInfo?.login || 'Завантаження...'}</h3>
              <p style={{margin:0, fontSize:'12px', color:'#38bdf8', fontWeight: 700}}>ТЕХНІЧНИЙ КООРДИНАТОР</p>
            </div>
          </div>
          {activeTab === 'stages' && (
            <ActionButton onClick={() => setOpenStageForm(true)}><Plus size={18}/> ДОДАТИ ЕТАП</ActionButton>
          )}
        </HeaderSection>

        {/* --- Filters --- */}
        {(activeTab === 'objects' || activeTab === 'stages') && (
          <FilterSection>
            <StyledInput 
              placeholder="Швидкий пошук за адресою..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
            <StyledInput 
              type="date" 
              value={filterDate} 
              onChange={e => setFilterDate(e.target.value)} 
            />
            <Button onClick={() => {setSearchTerm(''); setFilterDate('');}} style={{color:'#94a3b8', border: '1px solid #334155', borderRadius: '12px'}}>Скинути</Button>
          </FilterSection>
        )}

        {/* --- Content Area --- */}
        {activeTab === 'dashboard' && (
          <div style={{textAlign:'center', marginTop:'120px'}}>
            <Hammer size={100} color="#38bdf8" style={{opacity: 0.2, marginBottom: '20px'}} />
            <h2>TECHNICAL COORDINATOR PANEL</h2>
            <p style={{color: '#94a3b8'}}>Ексклюзивний доступ до технічної документації та графіку робіт.</p>
          </div>
        )}

        {activeTab === 'objects' && (
          <TableContainer>
            <StyledTable>
              <thead>
                <tr>
                  <th>Об'єкт будівництва</th>
                  <th>Площа (м²)</th>
                  <th>Дата реєстрації</th>
                  <th style={{textAlign:'right'}}>Тех. Паспорт</th>
                </tr>
              </thead>
              <tbody>
                {filteredObjects.length > 0 ? filteredObjects.map(obj => (
                  <tr key={obj._id}>
                    <td><b>{obj.address}</b></td>
                    <td>{obj.area}</td>
                    <td>{new Date(obj.createdAt).toLocaleDateString()}</td>
                    <td style={{textAlign:'right'}}>
                      <IconButton onClick={() => handlePrintTechPass(obj)} style={{color:'#38bdf8'}}><Printer size={18}/></IconButton>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" style={{textAlign:'center'}}>Дані відсутні</td></tr>
                )}
              </tbody>
            </StyledTable>
          </TableContainer>
        )}

        {activeTab === 'stages' && (
          <TableContainer>
            <StyledTable>
              <thead>
                <tr>
                  <th>Локація</th>
                  <th>Етап робіт</th>
                  <th>Статус</th>
                  <th style={{textAlign:'right'}}>Дії</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>вул. Миру, 14</b></td>
                  <td>Фундаментні роботи</td>
                  <td><span style={{color: '#f97316', fontWeight: 800}}>В ПРОЦЕСІ</span></td>
                  <td style={{textAlign:'right'}}>
                    <IconButton style={{color:'#fbbf24'}}><Edit size={18}/></IconButton>
                    <IconButton style={{color:'#ef4444'}}><Trash2 size={18}/></IconButton>
                  </td>
                </tr>
              </tbody>
            </StyledTable>
          </TableContainer>
        )}
      </MainContent>

      {/* --- Logout Dialog --- */}
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
            <ConfirmButton onClick={handleLogout}>Так, Вийти</ConfirmButton>
          </OrangeAlertBar>
          <CancelLink onClick={() => setLogoutDialogOpen(false)}>СКАСУВАТИ</CancelLink>
        </DialogContent>
      </Dialog>

      {/* --- Form Stage --- */}
      <Dialog open={openStageForm} onClose={() => setOpenStageForm(false)} maxWidth="md" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'24px'}}}>
        <DialogContent>
          <h2 style={{color:'#38bdf8', marginBottom:'20px'}}>Додати етап робіт</h2>
          <FormGrid>
            <SectionTitle><MapPin size={14}/> Дані об'єкта</SectionTitle>
            <InputGroup $span={3}><label>Адреса</label><select><option>Оберіть об'єкт...</option></select></InputGroup>
            <SectionTitle><Calendar size={14}/> Терміни</SectionTitle>
            <InputGroup><label>Назва</label><input type="text" /></InputGroup>
            <InputGroup><label>Початок</label><input type="date" /></InputGroup>
            <InputGroup><label>Кінець</label><input type="date" /></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding:'20px'}}>
          <Button onClick={()=>setOpenStageForm(false)} style={{color:'#94a3b8'}}>Скасувати</Button>
          <ActionButton onClick={()=>setOpenStageForm(false)}>ЗБЕРЕГТИ</ActionButton>
        </DialogActions>
      </Dialog>

      <Snackbar open={notify.open} autoHideDuration={3000} onClose={()=>setNotify({...notify, open:false})} anchorOrigin={{vertical:'top',horizontal:'right'}}>
        <Alert severity={notify.severity} variant="filled" style={{borderRadius: '15px'}}>{notify.message}</Alert>
      </Snackbar>
    </DashboardWrapper>
  );
};

export default TechnicalDashboard;