import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { LogOut, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, Alert } from '@mui/material';

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

const DashboardWrapper = styled.div`
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
  background: rgba(30, 41, 59, 0.4);
  padding: 20px 30px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const UserProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  .text {
    display: flex;
    flex-direction: column;
  }

  h2 { margin: 0; font-size: 22px; color: #f8fafc; }
  p { color: #38bdf8; font-weight: 600; margin: 2px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
`;

const IconCircle = styled.div`
  width: 45px;
  height: 45px;
  background: rgba(56, 189, 248, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38bdf8;
`;

const LogoutIconBtn = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 12px;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: white;
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
    transform: translateY(-2px);
  }
`;

const ContentPlaceholder = styled.div`
  width: 100%;
  max-width: 1150px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  color: #475569;
  
  h3 { color: #94a3b8; margin-bottom: 8px; }
  p { font-size: 14px; }
`;

const TechnicalDashboard = () => {
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  
  const [userInfo] = useState(() => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null;
  });

  useEffect(() => {
    // Перевірка, чи це дійсно технічний координатор
    if (!userInfo || userInfo.role !== 'TechnicalCoordinator') {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const confirmLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <DashboardWrapper>
      <GlobalStyle />
      
      <HeaderSection>
        <UserProfileInfo>
          <IconCircle>
            <Wrench size={24} />
          </IconCircle>
          <div className="text">
            <h2>Технічна Панель</h2>
            <p>{userInfo ? userInfo.login : 'Авторизація...'}</p>
          </div>
        </UserProfileInfo>

        <LogoutIconBtn onClick={() => setOpenLogoutDialog(true)} title="Вийти з системи">
          <LogOut size={22} />
        </LogoutIconBtn>
      </HeaderSection>

      <ContentPlaceholder>
        <h3>Вітаємо, тех-координаторе! 🛠️</h3>
        <p>Тут згодом з'явиться функціонал для планування етапів та моніторингу ресурсів.</p>
      </ContentPlaceholder>

      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        PaperProps={{
          style: { 
            borderRadius: '24px', 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '20px',
            minWidth: '380px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <DialogContent style={{ padding: '0' }}>
          <Alert 
            severity="warning" 
            variant="filled"
            style={{ 
              borderRadius: '16px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center'
            }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={confirmLogout}
                style={{ fontWeight: '800', letterSpacing: '0.5px' }}
              >
                ТАК, ВИЙТИ
              </Button>
            }
          >
            Ви впевнені, що хочете вийти?
          </Alert>
        </DialogContent>
        
        <DialogActions style={{ justifyContent: 'center', marginTop: '15px', padding: '0' }}>
          <Button 
            onClick={() => setOpenLogoutDialog(false)} 
            style={{ 
              color: '#94a3b8', 
              textTransform: 'none', 
              fontSize: '14px',
              textDecoration: 'underline' 
            }}
          >
            Ні, залишитися в системі (Скасувати)
          </Button>
        </DialogActions>
      </Dialog>

    </DashboardWrapper>
  );
};

export default TechnicalDashboard;