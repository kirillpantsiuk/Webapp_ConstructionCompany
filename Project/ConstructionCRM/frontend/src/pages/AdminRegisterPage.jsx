import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const AdminWrapper = styled.div`
  min-height: 100vh;
  background-color: #0a0f16;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const FormCard = styled.div`
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
`;

const Select = styled.select`
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  background: #1e293b;
  color: white;
  border: 1px solid #334155;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #0f172a;
  color: white;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: #38bdf8;
  color: #0f172a;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover { background: #7dd3fc; }
`;

const AdminRegisterPage = () => {
  const [formData, setFormData] = useState({
    login: '', password: '', email: '', role: 'Manager',
    department: '', phone: '', specialization: '', experience: ''
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Помилка');
    }
  };

  return (
    <AdminWrapper>
      <FormCard>
        <h2>Реєстрація нового співробітника 🏗️</h2>
        <form onSubmit={handleRegister}>
          <Input name="login" placeholder="Логін" onChange={handleChange} required />
          <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <Input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
          
          <label>Оберіть роль:</label>
          <Select name="role" onChange={handleChange}>
            <option value="Manager">Менеджер</option>
            <option value="TechnicalCoordinator">Технічний Координатор</option>
          </Select>

          {formData.role === 'Manager' ? (
            <>
              <Input name="department" placeholder="Відділ" onChange={handleChange} />
              <Input name="phone" placeholder="Телефон" onChange={handleChange} />
            </>
          ) : (
            <>
              <Input name="specialization" placeholder="Спеціалізація" onChange={handleChange} />
              <Input name="experience" type="number" placeholder="Досвід (років)" onChange={handleChange} />
            </>
          )}

          <SubmitBtn type="submit">Зареєструвати користувача</SubmitBtn>
        </form>
      </FormCard>
    </AdminWrapper>
  );
};

export default AdminRegisterPage;