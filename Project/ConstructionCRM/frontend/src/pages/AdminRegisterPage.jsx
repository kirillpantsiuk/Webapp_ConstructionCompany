import React, { useState, useEffect, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserPlus, X } from 'lucide-react';
import { Snackbar, Alert, Button, Dialog, DialogActions, DialogContent } from '@mui/material';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    background-color: #0a0f16;
    color: white;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  * {
    box-sizing: border-box;
  }
`;

const AdminWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: radial-gradient(circle at 50% 50%, #111827 0%, #0a0f16 100%);
`;

const HeaderSection = styled.div`
  width: 100%;
  max-width: 1150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AddUserBtn = styled.button`
  background: #38bdf8;
  color: #0f172a;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  &:hover { background: #7dd3fc; transform: translateY(-2px); }
`;

const LogoutIconBtn = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover { background: #ef4444; color: white; }
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 1150px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  & th { background: rgba(15, 23, 42, 0.6); color: #38bdf8; padding: 18px; text-align: left; font-size: 12px; text-transform: uppercase; }
  & td { padding: 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 14px; color: #cbd5e1; }
  & tr:hover { background: rgba(255, 255, 255, 0.02); }
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  background: ${props => props.$role === 'Manager' ? '#065f46' : props.$role === 'SuperAdmin' ? '#991b1b' : '#1e40af'};
  color: white;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormCard = styled.div`
  background: #1e293b;
  padding: 35px;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const Input = styled.input`
  padding: 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  color: white;
  width: 100%;
  margin-top: 12px;
  font-size: 14px;
  &:focus { outline: none; border-color: #38bdf8; }
`;

const ActionLink = styled.span`
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  margin-right: 15px;
  color: ${props => props.$type === 'delete' ? '#ef4444' : '#38bdf8'};
  &:hover { text-decoration: underline; }
`;

const AdminRegisterPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ 
    login: '', password: '', email: '', role: 'Manager', 
    department: '', phone: '', specialization: '', experience: '' 
  });
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async (isMounted) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) return;
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const res = await axios.get('http://localhost:5000/api/users', config);
      if (isMounted) setUsers(res.data);
    } catch (err) { 
      console.error("Помилка завантаження:", err); 
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      await fetchUsers(isMounted);
    };
    loadData();
    return () => { isMounted = false; };
  }, [fetchUsers]);

  const confirmLogout = () => { 
    localStorage.removeItem('userInfo'); 
    navigate('/login'); 
  };

  const resetForm = () => { 
    setFormData({ 
      login: '', password: '', email: '', role: 'Manager', 
      department: '', phone: '', specialization: '', experience: '' 
    }); 
    setIsEdit(false); 
    setEditId(null);
    setShowModal(false); 
  };

  const validateData = () => {
    // Регулярний вираз для телефону: обов'язковий +, код країни та цифри (10-15 симв)
    const phoneRegex = /^\+\d{10,15}$/;
    // Складний пароль: мін 8 симв, 1 велика, 1 цифра, 1 спецсимвол
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (formData.role === 'Manager' && formData.phone && !phoneRegex.test(formData.phone)) {
      setNotify({ open: true, message: 'Невірний формат телефону! Обов’язково + та код країни (напр. +380...)', severity: 'error' });
      return false;
    }

    if (formData.role === 'TechnicalCoordinator' && Number(formData.experience) < 0) {
      setNotify({ open: true, message: 'Досвід роботи не може бути від’ємним!', severity: 'error' });
      return false;
    }

    if (!isEdit && !passwordRegex.test(formData.password)) {
      setNotify({ open: true, message: 'Пароль занадто слабкий! Мін. 8 симв., велика літера, цифра та спецсимвол (@$!%*?&)', severity: 'error' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/users/${editId}`, formData, config);
        setNotify({ open: true, message: 'Дані успішно оновлено!', severity: 'success' });
      } else {
        await axios.post('http://localhost:5000/api/users/register', formData, config);
        setNotify({ open: true, message: 'Користувача успішно зареєстровано!', severity: 'success' });
      }
      await fetchUsers(true);
      resetForm();
    } catch (err) { 
      console.error("Помилка відправки:", err);
      setNotify({ open: true, message: err.response?.data?.message || 'Помилка запиту!', severity: 'error' }); 
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Видалити цього користувача назавжди?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/users/${id}`, config);
        setNotify({ open: true, message: 'Користувача видалено!', severity: 'warning' });
        await fetchUsers(true);
      } catch (err) {
        console.error("Помилка видалення:", err);
        setNotify({ open: true, message: 'Помилка при видаленні!', severity: 'error' });
      }
    }
  };

  return (
    <AdminWrapper>
      <GlobalStyle />
      <HeaderSection>
        <div>
          <h2 style={{ margin: 0 }}>Керування персоналом</h2>
          <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Панель адміністратора ConstructionCRM</p>
        </div>
        <Controls>
          <AddUserBtn onClick={() => setShowModal(true)}><UserPlus size={18} /> Додати користувача</AddUserBtn>
          <LogoutIconBtn onClick={() => setOpenLogoutDialog(true)} title="Вийти"><LogOut size={20} /></LogoutIconBtn>
        </Controls>
      </HeaderSection>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>Логін</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Контакт / Спец.</th>
              <th>Дані профілю</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight: 'bold', color: '#f8fafc' }}>{u.login}</td>
                <td>{u.email}</td>
                <td><Badge $role={u.role}>{u.role}</Badge></td>
                <td>{u.role === 'Manager' ? (u.phone || '—') : (u.specialization || '—')}</td>
                <td>{u.role === 'Manager' ? `Відділ: ${u.department || '—'}` : `Досвід: ${u.experience || 0} р.`}</td>
                <td>
                  {u.role !== 'SuperAdmin' && (
                    <>
                      <ActionLink onClick={() => { setFormData({...u, password: ''}); setEditId(u._id); setIsEdit(true); setShowModal(true); }}>Ред.</ActionLink>
                      <ActionLink $type="delete" onClick={() => deleteUser(u._id)}>Вид.</ActionLink>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      {showModal && (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <FormCard>
            <button onClick={resetForm} style={{ position: 'absolute', right: 20, top: 20, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X /></button>
            <h3 style={{ marginTop: 0, color: '#38bdf8' }}>{isEdit ? 'Оновлення профілю' : 'Новий користувач'}</h3>
            <form onSubmit={handleSubmit}>
              <Input placeholder="Логін" value={formData.login} onChange={e => setFormData({...formData, login: e.target.value})} required />
              <Input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <Input 
                placeholder={isEdit ? "Новий пароль (залиште порожнім)" : "Пароль (мін. 8 симв., цифра, спецсимвол)"} 
                type="password" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required={!isEdit} 
              />
              
              <select style={{ width: '100%', padding: '12px', marginTop: '12px', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '10px' }} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="Manager">Менеджер</option>
                <option value="TechnicalCoordinator">Технічний Координатор</option>
              </select>

              {formData.role === 'Manager' ? (
                <>
                  <Input placeholder="Відділ" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                  <Input placeholder="Телефон (напр. +380...)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </>
              ) : (
                <>
                  <Input placeholder="Спеціалізація" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
                  <Input placeholder="Досвід (роки)" type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                </>
              )}

              <button type="submit" style={{ width: '100%', padding: '14px', marginTop: '25px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                {isEdit ? 'Зберегти зміни' : 'Зареєструвати'}
              </button>
            </form>
          </FormCard>
        </ModalOverlay>
      )}

      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} PaperProps={{ style: { borderRadius: '24px', backgroundColor: '#1e293b', color: 'white', padding: '20px', minWidth: '380px', border: '1px solid rgba(255, 255, 255, 0.1)' } }}>
        <DialogContent style={{ padding: '0' }}>
          <Alert severity="warning" variant="filled" style={{ borderRadius: '16px', fontWeight: '600', display: 'flex', alignItems: 'center' }} action={<Button color="inherit" size="small" onClick={confirmLogout} style={{ fontWeight: '800' }}>ТАК, ВИЙТИ</Button>}>
            Ви впевнені, що хочете вийти?
          </Alert>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', marginTop: '15px', padding: '0' }}>
          <Button onClick={() => setOpenLogoutDialog(false)} style={{ color: '#94a3b8', textTransform: 'none', fontSize: '14px', textDecoration: 'underline' }}>Скасувати</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={notify.open} autoHideDuration={4000} onClose={() => setNotify({...notify, open: false})} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={notify.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px' }}>{notify.message}</Alert>
      </Snackbar>
    </AdminWrapper>
  );
};

export default AdminRegisterPage;