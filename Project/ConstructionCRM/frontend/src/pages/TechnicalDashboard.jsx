import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  LogOut, Menu, X, LayoutDashboard, Edit, Trash2, Printer, Plus, Home, MapPin, 
  AlertTriangle, Eye, Zap, Truck, Construction, Droplets, Flame, ShieldAlert, 
  CheckCircle2, XCircle, FileText, Loader2, Maximize2, Search, FolderOpen, Info,
  Map as MapIcon, ChevronRight, ChevronLeft, Check, ClipboardCheck, ShoppingCart,
  Home as HouseIcon, Wrench, Hammer, PackagePlus, ListChecks, ListFilter,
  Calendar, Users, CalendarDays, List, BarChart3
} from 'lucide-react';

import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  Alert, Snackbar, IconButton, Switch, FormControlLabel, Tooltip,
  Stepper, Step, StepLabel, StepConnector, stepConnectorClasses,
  Checkbox, Table, TableBody, TableCell, TableHead, TableRow
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

  /* --- ІДЕАЛЬНА ТЕМНА ТЕМА ДЛЯ ДІАГРАМИ ГАНТА --- */
  .gantt-container { font-family: 'Inter', sans-serif !important; }
  
  /* Фон сітки (зебра) */
  .gantt-container .gridRow { fill: #0a0f16 !important; }
  .gantt-container .gridRow:nth-of-type(even) { fill: #0f172a !important; }
  
  /* Запасний варіант, якщо бібліотека рендерить rect без класів */
  .gantt-container svg > g > rect[fill="#fff"], 
  .gantt-container svg > g > rect[fill="#ffffff"],
  .gantt-container svg > g > rect[fill="#f5f5f5"] { fill: transparent !important; }
  
  /* Лінії сітки */
  .gantt-container .gridRowLine, 
  .gantt-container .gridTick { stroke: #334155 !important; }
  
  /* Хедер календаря (дати) */
  .gantt-container .calendarHeader { fill: #1e293b !important; stroke: #334155 !important; }
  .gantt-container .calendarTopText { fill: #94a3b8 !important; font-weight: 700 !important; font-size: 12px !important; }
  .gantt-container .calendarBottomText { fill: #f8fafc !important; font-weight: 700 !important; font-size: 11px !important; }
  .gantt-container .calendarTopTick, 
  .gantt-container .calendarBottomTick { stroke: #334155 !important; }
  
  /* Текст назви завдання біля смужки (тепер ідеально читається) */
  .gantt-container .barLabel { fill: #ffffff !important; font-weight: 700 !important; font-size: 12px !important; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
`;

// --- Кастомні компоненти для лівої частини Ганта ---
const CustomTaskListHeader = ({ headerHeight, fontFamily }) => (
  <div style={{ height: headerHeight, fontFamily, background: '#1e293b', color: '#38bdf8', display: 'flex', borderBottom: '1px solid #334155', borderRight: '1px solid #334155', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase' }}>
    <div style={{ minWidth: '250px', width: '250px', padding: '0 15px', display: 'flex', alignItems: 'center', borderRight: '1px solid #334155' }}>Етап / Завдання</div>
    <div style={{ minWidth: '100px', width: '100px', padding: '0 15px', display: 'flex', alignItems: 'center', borderRight: '1px solid #334155' }}>Початок</div>
    <div style={{ minWidth: '100px', width: '100px', padding: '0 15px', display: 'flex', alignItems: 'center' }}>Закінчення</div>
  </div>
);

const CustomTaskListTable = ({ rowHeight, tasks, fontFamily }) => (
  <div style={{ fontFamily, background: '#0a0f16', color: '#e2e8f0', borderRight: '1px solid #334155' }}>
    {tasks.map((t, i) => (
      <div key={t.id} style={{ height: rowHeight, display: 'flex', borderBottom: '1px solid #334155', background: i % 2 === 0 ? '#0f172a' : '#0a0f16' }}>
        <div style={{ minWidth: '250px', width: '250px', padding: '0 15px', display: 'flex', alignItems: 'center', borderRight: '1px solid #334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.name}>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>{t.name}</span>
        </div>
        <div style={{ minWidth: '100px', width: '100px', padding: '0 15px', display: 'flex', alignItems: 'center', borderRight: '1px solid #334155', color: '#94a3b8', fontSize: '11px' }}>
          {t.start.toLocaleDateString()}
        </div>
        <div style={{ minWidth: '100px', width: '100px', padding: '0 15px', display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '11px' }}>
          {t.end.toLocaleDateString()}
        </div>
      </div>
    ))}
  </div>
);

const CustomTooltip = ({ task, fontFamily }) => (
  <div style={{ background: '#1e293b', color: '#fff', padding: '12px 15px', borderRadius: '10px', border: '1px solid #38bdf8', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontFamily, fontSize: '12px' }}>
    <b style={{ color: '#38bdf8', display: 'block', marginBottom: '8px', fontSize: '13px' }}>{task.name}</b>
    <span style={{ color: '#94a3b8' }}>Початок:</span> {task.start.toLocaleDateString()}<br/>
    <span style={{ color: '#94a3b8' }}>Кінець:</span> {task.end.toLocaleDateString()}
  </div>
);

// --- Стилізовані компоненти (Layout) ---
const DashboardWrapper = styled.div` min-height: 100vh; display: flex; background: radial-gradient(circle at 50% 50%, #111827 0%, #0a0f16 100%); `;
const Sidebar = styled.div` position: fixed; left: ${props => (props.$isOpen ? '0' : '-280px')}; top: 0; width: 280px; height: 100%; background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(25px); border-right: 1px solid rgba(255, 255, 255, 0.1); transition: 0.4s; z-index: 1000; padding: 30px 20px; display: flex; flex-direction: column; `;
const LogoContainer = styled.div` display: flex; align-items: center; justify-content: space-between; margin-bottom: 45px; h2 { color: #38bdf8; margin: 0; font-weight: 900; letter-spacing: -0.02em; font-size: 24px; } `;
const SidebarItem = styled.div` display: flex; align-items: center; gap: 15px; padding: 14px 18px; border-radius: 12px; cursor: pointer; color: ${props => (props.$active ? '#38bdf8' : '#94a3b8')}; background: ${props => (props.$active ? 'rgba(56, 189, 248, 0.1)' : 'transparent')}; margin-bottom: 8px; transition: 0.2s; &:hover { background: rgba(56, 189, 248, 0.05); color: white; transform: translateX(5px); } `;
const MainContent = styled.div` flex: 1; padding: 40px; margin-left: ${props => (props.$isMenuOpen ? '280px' : '0')}; transition: margin 0.3s ease; `;
const HeaderSection = styled.div` width: 100%; display: flex; justify-content: space-between; align-items: center; background: rgba(30, 41, 59, 0.4); padding: 15px 30px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); margin-bottom: 30px; `;
const UserInfoContainer = styled.div` display: flex; flex-direction: column; .login { font-size: 16px; font-weight: 700; color: white; line-height: 1.2; } .role { font-size: 11px; font-weight: 600; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; } `;
const StyledInput = styled.input` padding: 12px 18px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: white; font-size: 14px; width: 100%; &:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2); } `;

// --- Таблиці та Статуси ---
const TableContainer = styled.div` background: rgba(30, 41, 59, 0.3); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; margin-bottom: 30px; `;
const StyledTable = styled.table` width: 100%; border-collapse: collapse; color: #e2e8f0; th { background: rgba(15, 23, 42, 0.5); padding: 18px; text-align: left; color: #38bdf8; font-size: 13px; text-transform: uppercase; } td { padding: 18px; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 14px; } tr:hover { background: rgba(56, 189, 248, 0.02); } `;
const StatusBadge = styled.div` display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; background: ${props => props.$active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${props => props.$active ? '#4ade80' : '#f87171'}; border: 1px solid ${props => props.$active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; `;

// --- Форми та Планування ---
const ActionButton = styled.button` background: #38bdf8; color: #0a0f16; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.2s; &:hover { background: #7dd3fc; transform: translateY(-1px); } &:disabled { background: #1e293b; color: #475569; cursor: not-allowed; } `;
const SectionTitle = styled.h4` display: flex; align-items: center; gap: 10px; color: #38bdf8; margin: 20px 0 15px 0; text-transform: uppercase; font-size: 12px; font-weight: 800; grid-column: 1 / 4; border-bottom: 1px solid rgba(56, 189, 248, 0.2); padding-bottom: 8px; `;
const FormGrid = styled.form` display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; padding: 25px; `;
const InputGroup = styled.div` display: flex; flex-direction: column; gap: 6px; grid-column: ${props => props.$span ? `span ${props.$span}` : 'auto'}; label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; } input, select, textarea { padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; color: white; font-family: inherit; font-size: 14px; } textarea { resize: vertical; min-height: 80px; } input:focus, select:focus { border-color: #38bdf8; outline: none; } `;

// --- Креслення та Техплани ---
const BlueprintsGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding: 10px; `;
const BlueprintCard = styled.div` background: rgba(30, 41, 59, 0.5); border-radius: 24px; border: 2px solid ${props => (props.$selected ? '#38bdf8' : 'rgba(56, 189, 248, 0.2)')}; padding: 20px; display: flex; flex-direction: column; gap: 10px; transition: 0.3s; cursor: pointer; box-shadow: ${props => (props.$selected ? '0 0 30px rgba(56, 189, 248, 0.15)' : '0 10px 30px rgba(0,0,0,0.3)')}; &:hover { border-color: #38bdf8; transform: translateY(-5px); } `;
const BlueprintTitleBox = styled.div` display: flex; align-items: center; justify-content: space-between; span { font-size: 14px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; } `;
const DrawingWrapper = styled.div` width: 100%; height: 250px; background: #0f172a; border-radius: 15px; overflow: hidden; border: 1px solid rgba(56, 189, 248, 0.3); display: flex; align-items: center; justify-content: center; img { width: 100%; height: 100%; object-fit: contain; } `;
const PlanFormContainer = styled.div` background: rgba(30, 41, 59, 0.4); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; margin-top: 20px; min-height: 600px; display: flex; flex-direction: column; gap: 25px; `;

// --- Степер та Вихід ---
const ColorlibConnector = styled(StepConnector)(() => ({ [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 }, [`&.${stepConnectorClasses.active}`]: { [`& .${stepConnectorClasses.line}`]: { backgroundColor: '#38bdf8' } }, [`&.${stepConnectorClasses.completed}`]: { [`& .${stepConnectorClasses.line}`]: { backgroundColor: '#38bdf8' } }, [`& .${stepConnectorClasses.line}`]: { height: 3, border: 0, backgroundColor: '#334155', borderRadius: 1 } }));
const StepIconRoot = styled.div` background-color: ${props => props.$active || props.$completed ? '#38bdf8' : '#1e293b'}; z-index: 1; color: ${props => props.$active || props.$completed ? '#0a0f16' : '#94a3b8'}; width: 48px; height: 48px; display: flex; border-radius: 50%; justify-content: center; align-items: center; box-shadow: ${props => props.$active ? '0 0 15px rgba(56, 189, 248, 0.4)' : 'none'}; transition: 0.3s; `;

const ColorlibStepIcon = (props) => {
  const { active, completed, icon } = props;
  const icons = { 1: <FileText size={20}/>, 2: <MapPin size={20}/>, 3: <Edit size={20}/>, 4: <Construction size={20}/>, 5: <Zap size={20}/>, 6: <HouseIcon size={20}/>, 7: <Droplets size={20}/>, 8: <CheckCircle2 size={20}/> };
  return <StepIconRoot $active={active} $completed={completed}>{completed ? <Check size={24} strokeWidth={3}/> : icons[String(icon)]}</StepIconRoot>;
};

const OrangeAlertBar = styled.div` background: #f97316; border-radius: 35px; padding: 20px 30px; display: flex; align-items: center; justify-content: space-between; gap: 15px; width: 100%; box-shadow: 0 15px 30px rgba(249, 115, 22, 0.3); `;
const AlertText = styled.div` display: flex; align-items: center; gap: 12px; color: white; font-size: 18px; font-weight: 800; line-height: 1.2; text-transform: uppercase; `;
const ConfirmLogoutButton = styled.button` background: rgba(255, 255, 255, 0.2); border: 2px solid white; color: white; padding: 8px 18px; border-radius: 25px; font-size: 14px; font-weight: 900; cursor: pointer; transition: 0.2s; &:hover { background: white; color: #f97316; } `;
const CancelLogoutLink = styled.div` color: #94a3b8; font-size: 14px; margin-top: 20px; cursor: pointer; text-decoration: underline; text-align: center; font-weight: 600; &:hover { color: white; } `;

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
  
  // Базові стани
  const [buildingObjects, setBuildingObjects] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [blueprintsList, setBlueprintsList] = useState([]);
  const [materials, setMaterials] = useState([]); 
  const [techPlansList, setTechPlansList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDrawings, setLoadingDrawings] = useState(false);

  const [addMaterialsList, setAddMaterialsList] = useState([]);
  const [toolsList, setToolsList] = useState([]);
  const [confirmedSupplies, setConfirmedSupplies] = useState([]);
  const [selectedSupplyObject, setSelectedSupplyObject] = useState('');
  const [extraItemsSelection, setExtraItemsSelection] = useState([]);

  // Стани для Календарного планування та Робітників
  const [workers, setWorkers] = useState([]); 
  const [calendarPlans, setCalendarPlans] = useState([]);
  const [selectedCalendarObject, setSelectedCalendarObject] = useState('');
  const [currentCalendarPlan, setCurrentCalendarPlan] = useState(null);
  const [calendarViewMode, setCalendarViewMode] = useState('form'); 

  const userInfo = useMemo(() => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null;
  }, []);

  const initialInspectionState = useMemo(() => ({
    objectId: '', soilType: 'Чорнозем', groundwaterLevel: 'Низький (>3м)', relief: '', 
    electricity: { status: 'Відсутнє', distance: 0, phases: 'Невідомо' },
    water: { status: 'Відсутнє', depthExpected: 0 }, gas: { status: 'Відсутнє' },
    accessRoads: 'Грунтові дороги', truckAccess: true, storageArea: 'Достатньо місця',
    existingStructures: '', neighborConstraints: '', powerLines: false, recommendations: ''
  }), []);
  const [inspectionData, setInspectionData] = useState(initialInspectionState);

  const [activeStep, setActiveStep] = useState(0);
  const [planData, setPlanData] = useState({
    objectId: '', blueprintId: '',
    steps: {
      s1: { active: true, desc: 'КРОК 01. ПІДГОТОВКА: Визначити межі ділянки, підготувати місце під фундамент та септик.' },
      s2: { active: true, desc: 'КРОК 02. РОЗМІТКА: Встановити ося будинку на місцевості.' },
      s3: { active: true, desc: 'КРОК 03. ЗЕМЛЯНІ РОБОТИ: Риття траншей та котловану.' },
      s4: { active: true, desc: 'КРОК 04. ФУНДАМЕНТ: Заливка бетону, армування.', materials: [] },
      s5: { active: true, desc: 'КРОК 05. МОНТАЖ: Стіни, дах, перекриття.', materials: [] },
      s6: { active: true, desc: 'КРОК 06. ОЗДОБЛЕННЯ: Внутрішні та зовнішні роботи.', materials: [] },
      s7: { active: true, desc: 'Завершення будівництва та здача об’єкта.' }
    }
  });

  const stepsLabels = ['Креслення', 'Підготовка', 'Розмітка', 'Земляні', 'Фундамент', 'Монтаж', 'Оздоблення', 'Фінал'];

  const fetchData = useCallback(async () => {
    if (!userInfo?.token || userInfo.role !== 'TechnicalCoordinator') return;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      setLoading(true);
      setLoadingDrawings(true);
      const [resObjs, resInsp, resBlue, resMats, resProjects, resAddMats, resTools, resSupplies, resWorkers, resCalPlans] = await Promise.all([
        axios.get('http://localhost:5000/api/building-objects', config),
        axios.get('http://localhost:5000/api/site-inspections', config),
        axios.get('http://localhost:5000/api/blueprints', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/materials', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/technical-projects', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/additional-materials', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/tools', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/project-supplies', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/workers', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/calendar-plans', config).catch(() => ({ data: [] }))
      ]);
      setBuildingObjects(Array.isArray(resObjs.data) ? resObjs.data : []);
      setInspections(Array.isArray(resInsp.data) ? resInsp.data : []);
      setBlueprintsList(Array.isArray(resBlue.data) ? resBlue.data : []);
      setMaterials(Array.isArray(resMats.data) ? resMats.data : []);
      setTechPlansList(Array.isArray(resProjects.data) ? resProjects.data : []);
      setAddMaterialsList(Array.isArray(resAddMats.data) ? resAddMats.data : []);
      setToolsList(Array.isArray(resTools.data) ? resTools.data : []);
      setConfirmedSupplies(Array.isArray(resSupplies.data) ? resSupplies.data : []);
      setWorkers(Array.isArray(resWorkers.data) ? resWorkers.data : []);
      setCalendarPlans(Array.isArray(resCalPlans.data) ? resCalPlans.data : []);
    } catch (err) { 
      console.error(err);
      setNotify({ open: true, message: 'Помилка мережі: Бекенд недоступний', severity: 'error' });
    } finally { setLoading(false); setLoadingDrawings(false); }
  }, [userInfo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = () => { 
    localStorage.removeItem('userInfo'); 
    navigate('/login'); 
  };

  // --- ФУНКЦІЯ ГЕНЕРАЦІЇ HTML ГАНТА (ДЛЯ ДРУКУ) ---
  const generateGanttHtmlString = (plan) => {
    let minDate = new Date(8640000000000000);
    let maxDate = new Date(-8640000000000000);
    let hasTasks = false;

    plan.stages.forEach(s => s.tasks.forEach(t => {
      if(t.startDate && t.endDate) {
        hasTasks = true;
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        if(start < minDate) minDate = start;
        if(end > maxDate) maxDate = end;
      }
    }));

    let ganttHtml = '';
    if (hasTasks) {
      const totalDuration = maxDate.getTime() - minDate.getTime() || 1;
      ganttHtml += `<div style="position:relative; width:100%; border-left:1px solid #cbd5e1; border-bottom:1px solid #cbd5e1; margin-top:20px; padding-bottom: 20px;">`;
      
      plan.stages.forEach((stage) => {
        ganttHtml += `<div style="margin-top:15px; font-weight:800; font-size: 13px; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 3px;">${stage.name}</div>`;
        stage.tasks.forEach(task => {
          if(task.startDate && task.endDate) {
            const tStart = new Date(task.startDate).getTime();
            const tEnd = new Date(task.endDate).getTime();
            const leftPct = ((tStart - minDate.getTime()) / totalDuration) * 100;
            const widthPct = ((tEnd - tStart) / totalDuration) * 100;
            
            ganttHtml += `<div style="margin-top:8px; height:24px; position:relative; width:100%; background:#f8fafc; border-radius: 4px;">
              <div style="position:absolute; left:${leftPct}%; width:${Math.max(widthPct, 2)}%; height:100%; background:#38bdf8; border-radius:4px; display:flex; align-items:center; padding:0 8px; font-size:10px; font-weight:700; color:#000000; overflow:hidden; white-space:nowrap; border:1px solid #0ea5e9;">${task.title}</div>
            </div>`;
          }
        });
      });
      ganttHtml += `</div>`;
    }
    return ganttHtml;
  };

  // --- ОБРОБНИКИ ДРУКУ ---
  const handlePrintInspection = useCallback((ins) => {
    const obj = buildingObjects.find(o => o._id === (ins.objectId?._id || ins.objectId));
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>АКТ_ОГЛЯДУ</title><style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; padding: 30px; color: #000; line-height: 1.4; font-size: 13px; }
        h1 { text-align: center; text-transform: uppercase; border-bottom: 3px solid #38bdf8; padding-bottom: 10px; margin-bottom: 20px; font-size: 20px; }
        .section { margin-top: 15px; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
        .section-header { background: #f1f5f9; padding: 6px 12px; font-weight: 900; text-transform: uppercase; border-bottom: 1px solid #ddd; font-size: 11px; color: #1e293b; }
        .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding: 10px; }
        .label { font-weight: 700; color: #64748b; text-transform: uppercase; font-size: 9px; display: block; }
        .val { font-size: 13px; font-weight: 600; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; }
        .sign { border-top: 1px solid #000; width: 220px; text-align: center; padding-top: 5px; font-weight: 700; }
        @page { size: A4; margin: 10mm; }
      </style></head><body>
        <h1>Технічний акт огляду ділянки</h1>
        <p>Об'єкт: <b>${obj?.address || '—'}</b> | Дата: ${new Date(ins.createdAt).toLocaleDateString()}</p>
        <div class="section"><div class="section-header">1. Геологія та рельєф</div><div class="grid"><div><span class="label">Тип ґрунту</span><span class="val">${ins.soilType}</span></div><div><span class="label">Рівень вод</span><span class="val">${ins.groundwaterLevel}</span></div><div style="grid-column: span 1;"><span class="label">Рельєф</span><span class="val">${ins.relief}</span></div></div></div>
        <div class="section"><div class="section-header">2. Інженерні комунікації</div><div class="grid"><div><span class="label">Електрика</span><span class="val">${ins.electricity?.status} (${ins.electricity?.distance}м, ${ins.electricity?.phases})</span></div><div><span class="label">Вода</span><span class="val">${ins.water?.status} (Глибина: ${ins.water?.depthExpected}м)</span></div><div><span class="label">Газ</span><span class="val">${ins.gas?.status}</span></div></div></div>
        <div class="section"><div class="section-header">3. Логістика та Обмеження</div><div class="grid"><div><span class="label">Дороги</span><span class="val">${ins.accessRoads}</span></div><div><span class="label">Фура / Складування</span><span class="val">${ins.truckAccess ? 'Так' : 'Ні'} / ${ins.storageArea}</span></div><div><span class="label">ЛЕП / Споруди</span><span class="val">${ins.powerLines ? 'Є' : 'Ні'} / ${ins.existingStructures || 'Немає'}</span></div><div style="grid-column: span 3;"><span class="label">Обмеження від сусідів</span><span class="val">${ins.neighborConstraints || 'Без зауважень'}</span></div></div></div>
        <div class="section" style="border-left: 4px solid #38bdf8;"><div class="section-header">4. Висновок координатора</div><div style="padding: 10px;">${ins.recommendations}</div></div>
        <div class="footer"><div class="sign">Координатор: ${userInfo?.login}</div><div class="sign">Замовник</div></div>
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
  }, [buildingObjects, userInfo]);

  const handlePrintSupply = (supply) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>ВІДОМІСТЬ_ОБ’ЄКТА</title><style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; font-size: 12px; }
        h1 { border-bottom: 4px solid #38bdf8; padding-bottom: 10px; text-transform: uppercase; font-size: 22px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
        th { background: #f8fafc; text-transform: uppercase; font-size: 11px; }
        .tag { font-size: 10px; font-weight: 800; padding: 3px 6px; border-radius: 4px; background: #f1f5f9; color: #475569; }
      </style></head><body>
        <h1>Відомість матеріалів та інструментів</h1>
        <p>Об'єкт: <b>${supply.objectId?.address || '—'}</b> | Дата: ${new Date(supply.createdAt).toLocaleDateString()}</p>
        <table>
          <thead><tr><th>Категорія</th><th>Назва позиції</th><th>Кількість</th><th>Одиниці</th></tr></thead>
          <tbody>
            ${supply.items.map(i => `
              <tr>
                <td><span class="tag">${i.type === 'Інструмент' ? 'ІНСТРУМЕНТ' : i.type === 'Додатковий' ? 'ВИТРАТНИЙ' : 'ОСНОВНИЙ'}</span></td>
                <td>${i.name}</td>
                <td>${i.quantity || 1}</td>
                <td>${i.unit || 'шт'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
          <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">Координатор</div>
          <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">Отримав (Виконроб)</div>
        </div>
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  const handlePrintPlan = (plan) => {
    const blueprint = blueprintsList.find(b => b._id === (plan.taskId?._id || plan.taskId));
    const obj = buildingObjects.find(o => o._id === (plan.objectId?._id || plan.objectId));
    const insp = inspections.find(i => (i.objectId?._id || i.objectId) === obj?._id);
    const steps = plan.fullPlanData?.steps || planData.steps;

    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>ПЛАН_${plan._id}</title><style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; font-size: 12px; }
        .header { border-bottom: 4px solid #38bdf8; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
        .blueprint-box { text-align: center; margin-bottom: 40px; border: 1px dashed #cbd5e1; padding: 20px; border-radius: 15px; }
        .blueprint-box img { max-width: 100%; max-height: 400px; border-radius: 5px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .step-card { margin-bottom: 25px; padding: 20px; border-left: 6px solid #38bdf8; background: #fafafa; }
        .mat-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        .mat-table th { text-align: left; background: #e2e8f0; padding: 8px; font-size: 10px; text-transform: uppercase; }
        .mat-table td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
        @page { size: A4; margin: 15mm; }
      </style></head><body>
        <div class="header"><div><h1>Технічний план будівництва</h1><p style="margin:0; font-weight:700; color:#64748b;">BUILD CRM SYSTEM</p></div><div>№ ${plan._id.toUpperCase().slice(-8)}</div></div>
        <div style="margin-bottom:30px;"><b>Об'єкт:</b> ${obj?.address || plan.name} | <b>Грунт (Акт):</b> ${insp?.soilType || '—'} | <b>Вода (Акт):</b> ${insp?.water?.status || '—'}</div>
        <div class="blueprint-box"><img src="http://localhost:5000${blueprint?.imageUrl}" alt="blueprint"/></div>
        <h2 style="text-transform:uppercase; font-size:16px; border-bottom: 2px solid #0f172a; padding-bottom: 5px;">Покроковий графік та ресурси</h2>
        ${Object.values(steps).map((val, index) => val.active ? `
          <div class="step-card">
            <b>Етап 0${index + 1}: ${stepsLabels[index + 1]}</b>
            <p>${val.desc}</p>
            ${val.materials?.length ? `
              <table class="mat-table">
                <thead><tr><th>Матеріал</th><th>Кількість</th><th>Од.вим</th></tr></thead>
                <tbody>${val.materials.map(m => `<tr><td>${m.name}</td><td>${m.quantity}</td><td>${m.unit || 'од'}</td></tr>`).join('')}</tbody>
              </table>` : ''}
          </div>` : '').join('')}
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  const handlePrintCalendarPlan = (plan) => {
    const obj = buildingObjects.find(o => o._id === (plan.objectId?._id || plan.objectId));
    const ganttHtml = generateGanttHtmlString(plan);

    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>ГРАФІК_${plan._id}</title><style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; font-size: 12px; }
        h1 { border-bottom: 4px solid #38bdf8; padding-bottom: 10px; text-transform: uppercase; font-size: 22px; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
        th { background: #f8fafc; text-transform: uppercase; font-size: 11px; color: #64748b; }
        .stage-title { margin-top: 30px; font-size: 16px; color: #0f172a; text-transform: uppercase; background: #e0f2fe; padding: 8px; border-left: 4px solid #38bdf8; }
        @media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
        @page { size: A4 landscape; margin: 15mm; }
      </style></head><body>
        <h1>Календарний графік виконання робіт</h1>
        <p style="font-size:14px;">Об'єкт: <b>${obj?.address || '—'}</b> | Створено: ${new Date(plan.createdAt).toLocaleDateString()}</p>
        
        <h2 style="text-transform:uppercase; font-size:14px; margin-top: 30px;">Візуальний графік (Гант)</h2>
        ${ganttHtml}

        <h2 style="text-transform:uppercase; font-size:14px; margin-top: 40px;">Детальний розклад та відповідальні</h2>
        ${plan.stages.map(stage => `
          <div class="stage-title">${stage.name}</div>
          ${stage.tasks.length > 0 ? `
            <table>
              <thead><tr><th width="35%">Завдання</th><th width="15%">Початок</th><th width="15%">Закінчення</th><th width="35%">Відповідальні / Робітники</th></tr></thead>
              <tbody>
                ${stage.tasks.map(task => {
                  const workersList = task.assignedWorkers.map(wItem => {
                    const id = typeof wItem === 'object' ? wItem._id : wItem;
                    const w = workers.find(x => x._id === id);
                    return w ? `${w.lastName} ${w.firstName[0]}.` : '';
                  }).filter(Boolean).join(', ');
                  return `
                    <tr>
                      <td><b>${task.title}</b></td>
                      <td>${task.startDate ? new Date(task.startDate).toLocaleDateString() : '—'}</td>
                      <td>${task.endDate ? new Date(task.endDate).toLocaleDateString() : '—'}</td>
                      <td>${workersList || '<i>Не призначено</i>'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : '<p style="color: #94a3b8; font-style: italic;">Завдання ще не сформовані</p>'}
        `).join('')}
        <div style="margin-top: 60px; display: flex; justify-content: space-between;">
          <div style="border-top: 1px solid #000; width: 250px; text-align: center; padding-top: 5px;">Технічний координатор</div>
          <div style="border-top: 1px solid #000; width: 250px; text-align: center; padding-top: 5px;">Виконроб об'єкта</div>
        </div>
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  const handlePrintOnlyGantt = (planId) => {
    const plan = calendarPlans.find(p => p._id === planId);
    if (!plan) return;
    const obj = buildingObjects.find(o => o._id === (plan.objectId?._id || plan.objectId));
    const ganttHtml = generateGanttHtmlString(plan);

    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>ГАНТ_${plan._id}</title><style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; font-size: 12px; }
        h1 { border-bottom: 4px solid #38bdf8; padding-bottom: 10px; text-transform: uppercase; font-size: 22px; margin-bottom: 5px; }
        @media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
        @page { size: A4 landscape; margin: 15mm; }
      </style></head><body>
        <h1>Діаграма Ганта: ${obj?.address || '—'}</h1>
        ${ganttHtml}
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  // --- ОБРОБНИКИ ВИДАЛЕННЯ ---
  const handleDeleteInspection = async (id) => {
    if(!window.confirm('Видалити цей запис огляду?')) return;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try { 
      await axios.delete(`http://localhost:5000/api/site-inspections/${id}`, config); 
      fetchData(); 
      setNotify({ open: true, message: 'Запис огляду видалено успішно!', severity: 'info' });
    } catch (err) { console.error(err); setNotify({ open: true, message: 'Помилка видалення', severity: 'error' }); }
  };

  const handleDeleteTechPlan = async (id) => {
    if(!window.confirm('Видалити цей техплан?')) return;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try { 
      await axios.delete(`http://localhost:5000/api/technical-projects/${id}`, config); 
      setTechPlansList(techPlansList.filter(p => p._id !== id));
      setNotify({ open: true, message: 'Техплан видалено!', severity: 'info' });
    } catch (err) { console.error(err); setNotify({ open: true, message: 'Помилка видалення', severity: 'error' }); }
  };

  const handleDeleteSupply = async (id) => {
    if (!window.confirm('Вилучити відомість комплектації?')) return;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      await axios.delete(`http://localhost:5000/api/project-supplies/${id}`, config);
      fetchData();
      setNotify({ open: true, message: 'Відомість комплектації успішно видалена!', severity: 'info' });
    } catch (err) { console.error(err); setNotify({ open: true, message: 'Помилка при видаленні відомості', severity: 'error' }); }
  };

  const handleDeleteCalendarPlan = async (id) => {
  if (!window.confirm('Видалити план-графік? Робітників буде переведено у статус Вільний.')) return;
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  
  try {
    // 1. Знаходимо план, який збираємось видалити, у локальному стейті
    const planToDelete = calendarPlans.find(p => p._id === id);
    
    if (planToDelete) {
      const workersToFree = new Set(); // Використовуємо Set, щоб уникнути дублікатів
      
      // 2. Проходимося по всіх етапах та завданнях, збираючи ID робітників
      planToDelete.stages.forEach(stage => {
        stage.tasks.forEach(task => {
          if (task.assignedWorkers) {
            task.assignedWorkers.forEach(w => {
              const workerId = typeof w === 'object' ? w._id : w;
              workersToFree.add(workerId);
            });
          }
        });
      });
      
      // 3. Відправляємо запити на бекенд для звільнення кожного робітника
      for (let wId of workersToFree) {
        await axios.patch(`http://localhost:5000/api/workers/${wId}/status`, { isAvailable: true }, config)
          .catch(e => console.error('Помилка оновлення статусу робітника:', e));
      }
    }

    // 4. Тільки після звільнення людей видаляємо сам графік
    await axios.delete(`http://localhost:5000/api/calendar-plans/${id}`, config);
    
    // 5. Оновлюємо таблиці
    fetchData();
    setNotify({ open: true, message: 'План видалено, робітників звільнено!', severity: 'info' });
  } catch (err) { 
    console.error(err); 
    setNotify({ open: true, message: 'Помилка видалення', severity: 'error' }); 
  }
};

  // --- ФІЛЬТРИ ТА МЕМО З ПОШУКОМ ---
  const filteredBlueprints = useMemo(() => blueprintsList.filter(bp => bp.name.toLowerCase().includes(searchTerm.toLowerCase())), [blueprintsList, searchTerm]);
  const filteredInspections = useMemo(() => inspections.filter(ins => { const obj = buildingObjects.find(o => o._id === (ins.objectId?._id || ins.objectId)); return (obj?.address || '').toLowerCase().includes(searchTerm.toLowerCase()); }), [inspections, buildingObjects, searchTerm]);
  const filteredTechPlans = useMemo(() => techPlansList.filter(p => (p.objectId?.address || p.name || '').toLowerCase().includes(searchTerm.toLowerCase())), [techPlansList, searchTerm]);
  const filteredCalendarPlans = useMemo(() => calendarPlans.filter(p => (p.objectId?.address || '').toLowerCase().includes(searchTerm.toLowerCase())), [calendarPlans, searchTerm]);
  const filteredSupplies = useMemo(() => confirmedSupplies.filter(s => (s.objectId?.address || '').toLowerCase().includes(searchTerm.toLowerCase())), [confirmedSupplies, searchTerm]);
  const filteredWorkers = useMemo(() => workers.filter(w => { const fullSearch = `${w.lastName} ${w.firstName} ${w.specialization}`.toLowerCase(); return fullSearch.includes(searchTerm.toLowerCase()); }), [workers, searchTerm]);
  const filteredObjects = useMemo(() => buildingObjects.filter(obj => obj.address.toLowerCase().includes(searchTerm.toLowerCase())), [buildingObjects, searchTerm]);
  const objectsWithInspection = useMemo(() => buildingObjects.filter(obj => inspections.some(ins => (ins.objectId?._id || ins.objectId) === obj._id)), [buildingObjects, inspections]);
  const materialsByStage = useMemo(() => (activeStep >= 4 && activeStep <= 6) ? materials.filter(m => m.stage === activeStep) : [], [materials, activeStep]);

  // --- ЛОГІКА КАЛЕНДАРНОГО ПЛАНУВАННЯ ---
  const handleSelectObjectForCalendar = (id) => {
    setSelectedCalendarObject(id);
    if (!id) {
      setCurrentCalendarPlan(null);
      return;
    }
    const existing = calendarPlans.find(p => (p.objectId?._id || p.objectId) === id);
    if (existing) {
      setCurrentCalendarPlan(JSON.parse(JSON.stringify(existing)));
    } else {
      const techPlan = techPlansList.find(p => (p.objectId?._id || p.objectId) === id);
      if (techPlan && techPlan.fullPlanData) {
        const newStages = Object.values(techPlan.fullPlanData.steps)
          .filter(s => s.active)
          .map(s => ({ name: s.desc.split(':')[0], tasks: [] }));
        setCurrentCalendarPlan({ objectId: id, stages: newStages });
      } else {
        setCurrentCalendarPlan(null);
        setNotify({ open: true, message: 'Спершу сформуйте Техплан!', severity: 'warning' });
      }
    }
  };

  const handleAddTaskToStage = (stageIdx) => {
    const updated = { ...currentCalendarPlan };
    updated.stages[stageIdx].tasks.push({ title: '', startDate: '', endDate: '', assignedWorkers: [] });
    setCurrentCalendarPlan(updated);
  };

  const handleTaskChange = (stageIdx, taskIdx, field, value) => {
    const updated = { ...currentCalendarPlan };
    updated.stages[stageIdx].tasks[taskIdx][field] = value;
    setCurrentCalendarPlan(updated);
  };

  const handleAddWorkerToTask = (sIdx, tIdx, workerId) => {
    if (!workerId) return;
    const updated = { ...currentCalendarPlan };
    const task = updated.stages[sIdx].tasks[tIdx];
    
    if (!task.assignedWorkers) task.assignedWorkers = [];
    const alreadyAssigned = task.assignedWorkers.some(w => (typeof w === 'object' ? w._id : w) === workerId);
    
    if (!alreadyAssigned) {
      task.assignedWorkers.push(workerId);
      setCurrentCalendarPlan(updated);
    }
  };

  const handleRemoveWorkerFromTask = (sIdx, tIdx, workerId) => {
    const updated = { ...currentCalendarPlan };
    const task = updated.stages[sIdx].tasks[tIdx];
    task.assignedWorkers = task.assignedWorkers.filter(w => (typeof w === 'object' ? w._id : w) !== workerId);
    setCurrentCalendarPlan(updated);
  };

  const handleSaveCalendarPlan = async () => {
    if (!currentCalendarPlan || !currentCalendarPlan.objectId) {
      return setNotify({ open: true, message: 'Помилка: не обрано об\'єкт', severity: 'error' });
    }

    let isValid = true;
    let errorMessage = '';
    const assignedWorkerIds = new Set();
    let totalTasks = 0;

    for (const stage of currentCalendarPlan.stages) {
      for (const task of stage.tasks) {
        totalTasks++;
        if (!task.title || !task.title.trim()) { isValid = false; errorMessage = `Заповніть назву завдання у етапі: "${stage.name}"`; break; }
        if (!task.startDate || !task.endDate) { isValid = false; errorMessage = `Вкажіть дати для завдання: "${task.title}"`; break; }
        const start = new Date(task.startDate);
        const end = new Date(task.endDate);
        if (start > end) { isValid = false; errorMessage = `Дата закінчення раніше за початок: "${task.title}"`; break; }
        if (!task.assignedWorkers || task.assignedWorkers.length === 0) { isValid = false; errorMessage = `Призначте робітника для: "${task.title}"`; break; }

        task.assignedWorkers.forEach(w => {
          const wId = typeof w === 'object' ? w._id : w;
          assignedWorkerIds.add(wId);
        });
      }
      if (!isValid) break;
    }

    if (isValid && totalTasks === 0) { isValid = false; errorMessage = 'План-графік порожній!'; }

    if (!isValid) return setNotify({ open: true, message: errorMessage, severity: 'error' });

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      await axios.post('http://localhost:5000/api/calendar-plans', currentCalendarPlan, config);
      for (let workerId of assignedWorkerIds) {
        await axios.patch(`http://localhost:5000/api/workers/${workerId}/status`, { isAvailable: false }, config).catch(e => console.error(e));
      }
      setNotify({ open: true, message: 'План-графік збережено!', severity: 'success' });
      fetchData();
      setCalendarViewMode('list');
      setSelectedCalendarObject('');
      setCurrentCalendarPlan(null);
    } catch (err) { console.error(err); setNotify({ open: true, message: 'Помилка збереження', severity: 'error' }); }
  };

  // ФУНКЦІЯ ТРАНСФОРМАЦІЇ ДЛЯ ГАНТА
  const ganttTasks = useMemo(() => {
    let sourcePlan = currentCalendarPlan;
    if (calendarViewMode === 'gantt' && selectedCalendarObject) {
      sourcePlan = calendarPlans.find(p => (p.objectId?._id || p.objectId) === selectedCalendarObject);
    }
    if (!sourcePlan || !sourcePlan.stages) return [];
    const tasks = [];
    sourcePlan.stages.forEach((stage, sIdx) => {
      stage.tasks.forEach((task, tIdx) => {
        if (task.startDate && task.endDate && task.title) {
          tasks.push({
            start: new Date(task.startDate),
            end: new Date(task.endDate),
            name: `${task.title}`,
            id: `task-${sIdx}-${tIdx}`,
            type: 'task',
            progress: 100, 
            isDisabled: true, 
            styles: { progressColor: '#38bdf8', progressSelectedColor: '#7dd3fc', backgroundColor: 'rgba(56, 189, 248, 0.2)' }
          });
        }
      });
    });
    return tasks;
  }, [currentCalendarPlan, calendarViewMode, selectedCalendarObject, calendarPlans]);

  // --- ЛОГІКА МАЙСТРА ПЛАНІВ ---
  const handleObjectSelect = (id) => {
    const inspection = inspections.find(ins => (ins.objectId?._id || ins.objectId) === id);
    if (inspection) {
      const updatedSteps = { ...planData.steps };
      updatedSteps.s1.desc = `ПІДГОТОВКА: Грунт - ${inspection.soilType}. Рельєф: ${inspection.relief}. Складування: ${inspection.storageArea}.`;
      updatedSteps.s4.desc = `ФУНДАМЕНТ: Залити бетон. Грунт: ${inspection.soilType}. Вода: ${inspection.water?.status}. Мережі: Електрика (${inspection.electricity?.status}).`;
      updatedSteps.s7.desc = `ЗДАЧА: Перевірити системи. Виконати рекомендації координатора: ${inspection.recommendations || 'згідно норм ДБН'}.`;
      setPlanData({ ...planData, objectId: id, steps: updatedSteps });
      setNotify({ open: true, message: 'Дані огляду автоматично імпортовано!', severity: 'info' });
    } else {
      setPlanData({ ...planData, objectId: id });
    }
  };

  const handleToggleMaterial = (stepKey, mat) => {
    const currentSteps = { ...planData.steps };
    const currentMats = currentSteps[stepKey].materials || [];
    const exists = currentMats.find(m => m._id === mat._id);
    if (exists) { currentSteps[stepKey].materials = currentMats.filter(m => m._id !== mat._id); }
    else { currentSteps[stepKey].materials = [...currentMats, { ...mat, quantity: 1 }]; }
    setPlanData({ ...planData, steps: currentSteps });
  };

  const handleQtyChange = (stepKey, matId, qty) => {
    const currentSteps = { ...planData.steps };
    currentSteps[stepKey].materials = currentSteps[stepKey].materials.map(m => m._id === matId ? { ...m, quantity: Math.max(1, Number(qty)) } : m);
    setPlanData({ ...planData, steps: currentSteps });
  };

  const finalizePlan = async () => {
    if (!planData.objectId || !planData.blueprintId) return setNotify({ open: true, message: 'Оберіть об’єкт та креслення!', severity: 'error' });
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      const { data } = await axios.post('http://localhost:5000/api/technical-projects', {
        name: `Проєкт: ${buildingObjects.find(o => o._id === planData.objectId)?.address}`,
        description: planData.steps.s1.desc,
        objectId: planData.objectId,
        taskId: planData.blueprintId,
        status: 'Active',
        fullPlanData: planData 
      }, config);
      setTechPlansList([data, ...techPlansList]);
      setNotify({ open: true, message: 'Технічний план сформовано!', severity: 'success' });
      setActiveTab('tech_plans_table');
      setActiveStep(0);
    } catch (err) { console.error(err); setNotify({ open: true, message: 'Помилка збереження', severity: 'error' }); }
  };

  // --- ЛОГІКА КОМПЛЕКТАЦІЇ ---
  const materialsFromCurrentPlan = useMemo(() => {
    if (!selectedSupplyObject) return [];
    const plan = techPlansList.find(p => (p.objectId?._id || p.objectId) === selectedSupplyObject);
    if (!plan || !plan.fullPlanData) return [];
    let items = [];
    Object.values(plan.fullPlanData.steps).forEach(step => {
      if (step.materials) step.materials.forEach(m => items.push({ ...m, type: 'Основний' }));
    });
    return items;
  }, [selectedSupplyObject, techPlansList]);

  const handleToggleExtraItem = (item, type) => {
    const exists = extraItemsSelection.find(i => i._id === item._id);
    if (exists) setExtraItemsSelection(extraItemsSelection.filter(i => i._id !== item._id));
    else setExtraItemsSelection([...extraItemsSelection, { ...item, type, quantity: 1 }]);
  };

  const handleExtraItemQtyChange = (id, qty) => {
    setExtraItemsSelection(extraItemsSelection.map(i => i._id === id ? { ...i, quantity: Math.max(1, Number(qty)) } : i));
  };

  const handleSaveSupplyStatement = async () => {
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      await axios.post('http://localhost:5000/api/project-supplies', {
        objectId: selectedSupplyObject,
        items: [...materialsFromCurrentPlan, ...extraItemsSelection]
      }, config);
      setNotify({ open: true, message: 'Відомість затверджена!', severity: 'success' });
      setSelectedSupplyObject(''); setExtraItemsSelection([]); fetchData();
    } catch (err) { console.error(err); setNotify({ open: true, message: 'Помилка при збереженні відомості', severity: 'error' }); }
  };

  const handleSubmitInspection = async (e) => {
    e.preventDefault();
    if (inspectionData.electricity.distance < 0 || inspectionData.water.depthExpected < 0) {
      return setNotify({ open: true, message: 'Числа мають бути позитивними', severity: 'error' });
    }
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      const payload = { ...inspectionData, objectId: inspectionData.objectId?._id || inspectionData.objectId };
      if (editingId) await axios.put(`http://localhost:5000/api/site-inspections/${editingId}`, payload, config);
      else await axios.post('http://localhost:5000/api/site-inspections', payload, config);
      setOpenInspectionForm(false); setEditingId(null); fetchData(); setNotify({ open: true, message: 'Акт збережено!', severity: 'success' });
    } catch (err) { console.error(err); setNotify({ open: true, message: 'Помилка валідації', severity: 'error' }); }
  };

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <Sidebar $isOpen={menuOpen}>
        <LogoContainer><h2>BUILD CRM</h2><IconButton onClick={() => setMenuOpen(false)} style={{color: '#94a3b8'}}><X /></IconButton></LogoContainer>
        <SidebarItem $active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setMenuOpen(false); }}><LayoutDashboard size={20}/> Огляд</SidebarItem>
        <SidebarItem $active={activeTab === 'inspections'} onClick={() => { setActiveTab('inspections'); setMenuOpen(false); }}><Eye size={20}/> Огляд ділянок</SidebarItem>
        <SidebarItem $active={activeTab === 'blueprints'} onClick={() => { setActiveTab('blueprints'); setMenuOpen(false); }}><FileText size={20}/> Креслення</SidebarItem>
        <SidebarItem $active={activeTab === 'tech_plans'} onClick={() => { setActiveTab('tech_plans'); setMenuOpen(false); }}><MapIcon size={20}/> Тех плани</SidebarItem>
        
        <SidebarItem $active={activeTab === 'calendar'} onClick={() => { setActiveTab('calendar'); setMenuOpen(false); }}><Calendar size={20}/> Календарне планування</SidebarItem>
        <SidebarItem $active={activeTab === 'workers'} onClick={() => { setActiveTab('workers'); setMenuOpen(false); }}><Users size={20}/> Робітники</SidebarItem>

        <SidebarItem $active={activeTab === 'supplies'} onClick={() => { setActiveTab('supplies'); setMenuOpen(false); }}><Wrench size={20}/> Матеріали та Інструменти</SidebarItem>
        <SidebarItem $active={activeTab === 'tech_plans_table'} onClick={() => { setActiveTab('tech_plans_table'); setMenuOpen(false); }}><ClipboardCheck size={20}/> Список планів</SidebarItem>
        <SidebarItem $active={activeTab === 'objects'} onClick={() => { setActiveTab('objects'); setMenuOpen(false); }}><Home size={20}/> Об'єкти</SidebarItem>
        <SidebarItem onClick={() => setLogoutDialogOpen(true)} style={{marginTop:'auto', color:'#ef4444'}}>
          <LogOut size={20} color="#ef4444"/> Вийти з системи
        </SidebarItem>
      </Sidebar>

      <MainContent $isMenuOpen={menuOpen}>
        <HeaderSection>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>{!menuOpen && <IconButton onClick={() => setMenuOpen(true)} style={{color: '#38bdf8'}}><Menu /></IconButton>}<UserInfoContainer><span className="login">{userInfo?.login}</span><span className="role">Технічний координатор</span></UserInfoContainer></div>
          <div style={{position:'relative', width: '350px'}}><Search size={18} style={{position: 'absolute', left: '15px', top: '13px', color: '#38bdf8'}} /><StyledInput placeholder="Швидкий пошук..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{paddingLeft: '45px'}} /></div>
          {activeTab === 'inspections' && <ActionButton onClick={() => { setInspectionData(initialInspectionState); setEditingId(null); setOpenInspectionForm(true); }}><Plus size={18}/> НОВИЙ ОГЛЯД</ActionButton>}
        </HeaderSection>

        {(loading || (activeTab === 'blueprints' && loadingDrawings)) ? (
           <div style={{textAlign: 'center', marginTop: '100px'}}><Loader2 size={50} className="animate-spin" color="#38bdf8" /></div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div style={{textAlign:'center', marginTop:'120px'}}><HouseIcon size={100} color="#1e293b" style={{marginBottom: '20px'}} /><h2>BUILD CRM System</h2><p style={{color:'#94a3b8'}}>Система управління технічним наглядом.</p></div>
            )}

            {activeTab === 'workers' && (
              <div style={{animation: 'fadeIn 0.3s'}}>
                <SectionTitle><Users size={18}/> Реєстр робітників та спецтехніки</SectionTitle>
                <TableContainer>
                  <StyledTable>
                    <thead><tr><th>ПІБ Робітника</th><th>Спеціалізація</th><th>Контакти</th><th>Статус</th></tr></thead>
                    <tbody>{filteredWorkers.map(w => (<tr key={w._id}><td><b>{w.lastName} {w.firstName}</b></td><td>{w.specialization}</td><td>{w.contacts}</td><td><StatusBadge $active={w.isAvailable}>{w.isAvailable ? 'Вільний' : 'Зайнятий'}</StatusBadge></td></tr>))}</tbody>
                  </StyledTable>
                </TableContainer>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div style={{animation: 'fadeIn 0.3s'}}>
                <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
                  <Button variant={calendarViewMode === 'form' ? "contained" : "outlined"} style={{background: calendarViewMode === 'form' ? '#38bdf8' : 'transparent', color: calendarViewMode === 'form' ? '#0a0f16' : '#38bdf8', fontWeight: 700}} onClick={() => { setCalendarViewMode('form'); setSelectedCalendarObject(''); setCurrentCalendarPlan(null); }}><CalendarDays size={16} style={{marginRight: '8px'}}/> Формування</Button>
                  <Button variant={calendarViewMode === 'list' ? "contained" : "outlined"} style={{background: calendarViewMode === 'list' ? '#38bdf8' : 'transparent', color: calendarViewMode === 'list' ? '#0a0f16' : '#38bdf8', fontWeight: 700}} onClick={() => { setCalendarViewMode('list'); setSelectedCalendarObject(''); setCurrentCalendarPlan(null); }}><List size={16} style={{marginRight: '8px'}}/> Список графіків</Button>
                  <Button variant={calendarViewMode === 'gantt' ? "contained" : "outlined"} style={{background: calendarViewMode === 'gantt' ? '#38bdf8' : 'transparent', color: calendarViewMode === 'gantt' ? '#0a0f16' : '#38bdf8', fontWeight: 700}} onClick={() => { setCalendarViewMode('gantt'); setSelectedCalendarObject(''); setCurrentCalendarPlan(null); }}><BarChart3 size={16} style={{marginRight: '8px'}}/> Діаграма Ганта</Button>
                </div>

                {calendarViewMode === 'form' && (
                  <>
                    <SectionTitle><Calendar size={18}/> Графік виконання робіт</SectionTitle>
                    <div style={{background: 'rgba(30, 41, 59, 0.4)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px'}}>
                       <label style={{fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: 700}}>ОБЕРІТЬ ОБ'ЄКТ ДЛЯ ПЛАНУВАННЯ</label>
                       <select style={{width: '100%', padding: '15px', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '12px'}} value={selectedCalendarObject} onChange={(e) => handleSelectObjectForCalendar(e.target.value)}>
                          <option value="">Виберіть будівництво з техпланом...</option>
                          {buildingObjects.filter(o => techPlansList.some(p => (p.objectId?._id || p.objectId) === o._id)).map(obj => (<option key={obj._id} value={obj._id}>{obj.address}</option>))}
                       </select>
                    </div>

                    {currentCalendarPlan && (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        {currentCalendarPlan.stages.map((stage, sIdx) => (
                          <div key={sIdx} style={{background: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(56, 189, 248, 0.2)'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                               <h3 style={{margin: 0, color: '#38bdf8', fontSize: '16px', textTransform: 'uppercase'}}>{stage.name}</h3>
                               <Button size="small" variant="outlined" onClick={() => handleAddTaskToStage(sIdx)}><Plus size={14}/> Додати завдання</Button>
                            </div>
                            {stage.tasks.length > 0 && (
                              <TableContainer style={{marginBottom: 0, overflow: 'visible'}}>
                                <StyledTable>
                                  <thead><tr><th width="35%">Завдання</th><th width="15%">Початок</th><th width="15%">Кінець</th><th width="30%">Призначити робітників</th><th style={{textAlign:'right'}}>Дія</th></tr></thead>
                                  <tbody>
                                    {stage.tasks.map((task, tIdx) => (
                                      <tr key={tIdx}>
                                        <td style={{verticalAlign: 'top'}}><input style={{background: '#0a0f16', color: 'white', border: '1px solid #334155', padding: '10px', borderRadius: '8px', width: '100%'}} value={task.title} onChange={(e) => handleTaskChange(sIdx, tIdx, 'title', e.target.value)} placeholder="Назва робіт..."/></td>
                                        <td style={{verticalAlign: 'top'}}><input type="date" style={{background: '#0a0f16', color: 'white', border: '1px solid #334155', padding: '10px', borderRadius: '8px'}} value={task.startDate ? task.startDate.split('T')[0] : ''} onChange={(e) => handleTaskChange(sIdx, tIdx, 'startDate', e.target.value)}/></td>
                                        <td style={{verticalAlign: 'top'}}><input type="date" style={{background: '#0a0f16', color: 'white', border: '1px solid #334155', padding: '10px', borderRadius: '8px'}} value={task.endDate ? task.endDate.split('T')[0] : ''} onChange={(e) => handleTaskChange(sIdx, tIdx, 'endDate', e.target.value)}/></td>
                                        <td style={{verticalAlign: 'top'}}>
                                          <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px'}}>
                                            {task.assignedWorkers?.map(wId => {
                                              const actualId = typeof wId === 'object' ? wId._id : wId;
                                              const w = workers.find(wo => wo._id === actualId);
                                              return w ? (
                                                <span key={actualId} style={{background:'#38bdf8', color:'#0a0f16', padding:'4px 8px', borderRadius:'6px', fontSize:'11px', display:'flex', alignItems:'center', gap:'6px', fontWeight: '700'}}>
                                                  {w.lastName} {w.firstName[0]}. <X size={12} style={{cursor:'pointer'}} onClick={() => handleRemoveWorkerFromTask(sIdx, tIdx, actualId)} />
                                                </span>
                                              ) : null;
                                            })}
                                          </div>
                                          <select style={{background: '#0a0f16', color: 'white', border: '1px solid #334155', borderRadius: '8px', padding: '10px', width: '100%', fontSize: '13px'}} value="" onChange={(e) => handleAddWorkerToTask(sIdx, tIdx, e.target.value)}>
                                            <option value="" disabled>+ Обрати вільного робітника...</option>
                                            {workers.filter(w => w.isAvailable && (!task.assignedWorkers || !task.assignedWorkers.some(aw => (typeof aw === 'object' ? aw._id : aw) === w._id))).map(w => (
                                              <option key={w._id} value={w._id}>{w.lastName} {w.firstName} ({w.specialization})</option>
                                            ))}
                                          </select>
                                        </td>
                                        <td style={{textAlign:'right', verticalAlign: 'top'}}><IconButton style={{color:'#ef4444'}} onClick={() => { const upd = {...currentCalendarPlan}; upd.stages[sIdx].tasks.splice(tIdx, 1); setCurrentCalendarPlan(upd); }}><Trash2 size={16}/></IconButton></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </StyledTable>
                              </TableContainer>
                            )}
                          </div>
                        ))}
                        <ActionButton onClick={handleSaveCalendarPlan} style={{width: '100%', height: '60px', justifyContent: 'center', marginTop: '10px'}}><ClipboardCheck size={20}/> ЗАТВЕРДИТИ ГРАФІК ТА ПРИЗНАЧИТИ РОБІТНИКІВ</ActionButton>
                      </div>
                    )}
                  </>
                )}

                {calendarViewMode === 'list' && (
                  <>
                    <SectionTitle><ListFilter size={18}/> Затверджені графіки об'єктів</SectionTitle>
                    <TableContainer><StyledTable>
                      <thead><tr><th>Об'єкт</th><th>Дата створення</th><th style={{textAlign: 'right'}}>Дії</th></tr></thead>
                      <tbody>{filteredCalendarPlans.map(plan => (<tr key={plan._id}><td><b>{plan.objectId?.address}</b></td><td>{new Date(plan.createdAt).toLocaleDateString()}</td><td style={{textAlign: 'right'}}><IconButton onClick={() => handlePrintCalendarPlan(plan)} style={{color: '#38bdf8'}} title="Друк графіка"><Printer size={18}/></IconButton><IconButton onClick={() => handleDeleteCalendarPlan(plan._id)} style={{color: '#ef4444'}} title="Видалити"><Trash2 size={18}/></IconButton></td></tr>))}</tbody>
                    </StyledTable></TableContainer>
                  </>
                )}

                {/* Вкладка Ганта */}
                {calendarViewMode === 'gantt' && (
                  <>
                    <SectionTitle><BarChart3 size={18}/> Інтерактивна діаграма Ганта</SectionTitle>
                    <div style={{background: 'rgba(30, 41, 59, 0.4)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px'}}>
                       <label style={{fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: 700}}>ОБЕРІТЬ ОБ'ЄКТ ДЛЯ ПЕРЕГЛЯДУ</label>
                       <select style={{width: '100%', padding: '15px', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '12px'}} value={selectedCalendarObject} onChange={(e) => handleSelectObjectForCalendar(e.target.value)}>
                          <option value="">Виберіть будівництво із затвердженим планом...</option>
                          {calendarPlans.map(p => (<option key={p._id} value={p.objectId?._id || p.objectId}>{p.objectId?.address || 'Невідомий об\'єкт'}</option>))}
                       </select>
                    </div>

                    {selectedCalendarObject ? (
                      ganttTasks.length > 0 ? (
                        <div className="gantt-container" style={{background: '#0f172a', borderRadius: '20px', overflowX: 'auto', border: '2px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>
                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding: '20px 20px 0 20px'}}>
                            <span style={{color: '#38bdf8', fontWeight: 800, fontSize: '14px', textTransform: 'uppercase'}}>Візуалізація термінів</span>
                            <Button variant="outlined" onClick={() => handlePrintOnlyGantt(currentCalendarPlan?._id)} style={{color:'#38bdf8', borderColor:'#38bdf8'}}><Printer size={16} style={{marginRight:'8px'}}/> Друк діаграми</Button>
                          </div>
                          <Gantt 
                            tasks={ganttTasks} 
                            viewMode={ViewMode.Day} 
                            locale="ukr" 
                            listCellWidth="450px" 
                            columnWidth={60} 
                            TaskListHeader={CustomTaskListHeader}
                            TaskListTable={CustomTaskListTable}
                            TooltipContent={CustomTooltip}
                          />
                        </div>
                      ) : (
                        <div style={{textAlign: 'center', color: '#94a3b8', marginTop: '40px'}}><Info size={40} style={{marginBottom: '10px'}}/><br/>У цього об'єкта ще немає сформованих завдань із датами.</div>
                      )
                    ) : null}
                  </>
                )}
              </div>
            )}

            {/* ВКЛАДКА: МАТЕРІАЛИ ТА ІНСТРУМЕНТИ */}
            {activeTab === 'supplies' && (
              <div style={{animation: 'fadeIn 0.3s'}}>
                <div style={{display: 'flex', gap: '25px'}}>
                  <div style={{flex: 1, background: 'rgba(30, 41, 59, 0.4)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)'}}>
                    <SectionTitle><PackagePlus size={18}/> Формування комплектації</SectionTitle>
                    <select style={{width: '100%', padding: '15px', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '12px', marginBottom: '20px'}} value={selectedSupplyObject} onChange={(e) => {setSelectedSupplyObject(e.target.value); setExtraItemsSelection([]);}}>
                      <option value="">Оберіть будівництво з техпланом...</option>
                      {buildingObjects.filter(o => techPlansList.some(p => (p.objectId?._id || p.objectId) === o._id)).map(obj => (<option key={obj._id} value={obj._id}>{obj.address}</option>))}
                    </select>

                    {selectedSupplyObject && (
                      <>
                        <div style={{marginBottom: '20px', padding: '15px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '12px'}}>
                          <p style={{color: '#38bdf8', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', marginBottom: '10px'}}>Основні матеріали з техплану:</p>
                          {materialsFromCurrentPlan.length > 0 ? materialsFromCurrentPlan.map((m, idx) => (
                            <div key={idx} style={{fontSize: '13px', display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                              <span>• {m.name}</span><b>{m.quantity} {m.unit}</b>
                            </div>
                          )) : <p style={{fontSize: '12px', color: '#94a3b8'}}>У техплані не вказано матеріалів</p>}
                        </div>

                        <p style={{color: '#fbbf24', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', marginBottom: '10px'}}>Додаткові витратні матеріали:</p>
                        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px'}}>{addMaterialsList.map(m => (<Button key={m._id} size="small" variant={extraItemsSelection.some(i => i._id === m._id) ? "contained" : "outlined"} onClick={() => handleToggleExtraItem(m, 'Додатковий')}>{m.name}</Button>))}</div>
                        <p style={{color: '#4ade80', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', marginBottom: '10px'}}>Інструменти та обладнання:</p>
                        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '30px'}}>{toolsList.map(t => (<Button key={t._id} color="success" size="small" variant={extraItemsSelection.some(i => i._id === t._id) ? "contained" : "outlined"} onClick={() => handleToggleExtraItem(t, 'Інструмент')}>{t.name}</Button>))}</div>

                        {extraItemsSelection.length > 0 && (
                          <div style={{marginTop: '20px', background: 'rgba(15, 23, 42, 0.4)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(56, 189, 248, 0.2)'}}>
                            <p style={{color: '#38bdf8', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', marginBottom: '10px'}}><ListFilter size={14}/> Редагування кількості:</p>
                            <Table size="small">
                              <TableBody>
                                {extraItemsSelection.map(item => (
                                  <TableRow key={item._id}>
                                    <TableCell style={{color: 'white', padding: '5px'}}>{item.name}</TableCell>
                                    <TableCell style={{padding: '5px'}}><input type="number" min="1" value={item.quantity} onChange={(e) => handleExtraItemQtyChange(item._id, e.target.value)} style={{width: '60px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px', textAlign: 'center'}} /></TableCell>
                                    <TableCell style={{color: '#94a3b8', padding: '5px', fontSize: '12px'}}>{item.unit || 'шт'}</TableCell>
                                    <TableCell style={{padding: '5px', textAlign: 'right'}}><IconButton size="small" onClick={() => handleToggleExtraItem(item)} style={{color: '#ef4444'}}><XCircle size={14}/></IconButton></TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                        <ActionButton style={{width: '100%', height: '55px', marginTop: '20px'}} onClick={handleSaveSupplyStatement}><ListChecks size={20}/> ЗАТВЕРДИТИ ВІДОМІСТЬ</ActionButton>
                      </>
                    )}
                  </div>
                  <div style={{flex: 1.3}}>
                    <SectionTitle><FolderOpen size={18}/> Затверджені відомості комплектації</SectionTitle>
                    <TableContainer><StyledTable>
                      <thead><tr><th>Об'єкт</th><th>Дата</th><th style={{textAlign: 'right'}}>Дії</th></tr></thead>
                      <tbody>{filteredSupplies.map(s => (<tr key={s._id}><td><b>{s.objectId?.address}</b></td><td>{new Date(s.createdAt).toLocaleDateString()}</td><td style={{textAlign: 'right'}}><IconButton onClick={() => handlePrintSupply(s)} style={{color: '#38bdf8'}} title="Друк"><Printer size={18}/></IconButton><IconButton onClick={() => handleDeleteSupply(s._id)} style={{color: '#ef4444'}} title="Видалити"><Trash2 size={18}/></IconButton></td></tr>))}</tbody>
                    </StyledTable></TableContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'blueprints' && (
              <div style={{animation: 'fadeIn 0.3s'}}>
                <SectionTitle><FileText size={18}/> Архітектурні креслення</SectionTitle>
                {loadingDrawings ? <div style={{textAlign:'center'}}><Loader2 className="animate-spin" color="#38bdf8" /></div> : (
                  <BlueprintsGrid>{filteredBlueprints.map(doc => (<BlueprintCard key={doc._id}><BlueprintTitleBox><span>{doc.name}</span><IconButton onClick={() => window.open(`http://localhost:5000${doc.imageUrl}`, '_blank')}><Maximize2 size={16} color="#38bdf8"/></IconButton></BlueprintTitleBox><DrawingWrapper><img src={`http://localhost:5000${doc.imageUrl}`} alt={doc.name} /></DrawingWrapper></BlueprintCard>))}</BlueprintsGrid>
                )}
              </div>
            )}

            {activeTab === 'inspections' && (
              <TableContainer><StyledTable>
                  <thead><tr><th>Адреса</th><th>Грунт</th><th>Електрика</th><th>Транспорт</th><th style={{textAlign:'right'}}>Дії</th></tr></thead>
                  <tbody>{filteredInspections.map(ins => { const obj = buildingObjects.find(o => o._id === (ins.objectId?._id || ins.objectId)); return (
                    <tr key={ins._id}><td><b>{obj?.address || '—'}</b></td><td>{ins.soilType}</td><td>{ins.electricity?.status}</td><td><StatusBadge $active={ins.truckAccess}>{ins.truckAccess ? 'ТАК' : 'НІ'}</StatusBadge></td><td style={{textAlign:'right'}}><IconButton onClick={() => handlePrintInspection(ins)} style={{color:'#38bdf8'}} title="Друк акту"><Printer size={18}/></IconButton><IconButton style={{color:'#fbbf24'}} onClick={() => {setInspectionData(ins); setEditingId(ins._id); setOpenInspectionForm(true);}}><Edit size={18}/></IconButton><IconButton onClick={() => handleDeleteInspection(ins._id)} style={{color:'#ef4444'}}><Trash2 size={18}/></IconButton></td></tr>
                  )})}</tbody>
              </StyledTable></TableContainer>
            )}

            {activeTab === 'tech_plans' && (
              <div style={{maxWidth: '1100px', margin: '0 auto'}}>
                <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                  {stepsLabels.map(label => <Step key={label}><StepLabel StepIconComponent={ColorlibStepIcon}><span style={{fontSize:'10px', color: '#94a3b8', textTransform: 'uppercase'}}>{label}</span></StepLabel></Step>)}
                </Stepper>
                <PlanFormContainer>
                  {activeStep === 0 && (
                    <div style={{animation: 'fadeIn 0.3s'}}>
                      <SectionTitle>КРОК 00. ОБ'ЄКТ ТА КРЕСЛЕННЯ</SectionTitle>
                      <select style={{width:'100%', padding:'15px', background:'#0f172a', color:'white', borderRadius:'10px', border:'1px solid #334155', marginBottom:'25px'}} value={planData.objectId} onChange={e => handleObjectSelect(e.target.value)}>
                        <option value="">Виберіть ділянку...</option>
                        {objectsWithInspection.map(obj => <option key={obj._id} value={obj._id}>{obj.address}</option>)}
                      </select>
                      <BlueprintsGrid>{filteredBlueprints.map(bp => (<BlueprintCard key={bp._id} $selected={planData.blueprintId === bp._id} onClick={() => setPlanData({...planData, blueprintId: bp._id})}><DrawingWrapper><img src={`http://localhost:5000${bp.imageUrl}`} alt="bp"/></DrawingWrapper><BlueprintTitleBox><span>{bp.name}</span></BlueprintTitleBox></BlueprintCard>))}</BlueprintsGrid>
                    </div>
                  )}
                  {activeStep > 0 && activeStep < 8 && (
                    <div style={{animation:'fadeIn 0.3s'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><SectionTitle>{`0${activeStep}. ${stepsLabels[activeStep]}`}</SectionTitle><FormControlLabel control={<Checkbox checked={planData.steps[`s${activeStep}`].active} onChange={e => setPlanData({...planData, steps: {...planData.steps, [`s${activeStep}`]: {...planData.steps[`s${activeStep}`], active: e.target.checked}}})} color="primary" />} label="Включити етап" /></div>
                      <textarea style={{width:'100%', padding:'15px', background:'#0f172a', color:'white', borderRadius:'15px', border:'1px solid #334155', height:'120px', marginTop:'10px'}} value={planData.steps[`s${activeStep}`].desc} onChange={e => setPlanData({...planData, steps: {...planData.steps, [`s${activeStep}`]: {...planData.steps[`s${activeStep}`], desc: e.target.value}}})} />
                      {(activeStep >= 4 && activeStep <= 6) && (
                        <div style={{marginTop:'20px'}}>
                          <p style={{color:'#38bdf8', fontWeight:800}}>СПЕЦИФІКАЦІЯ МАТЕРІАЛІВ:</p>
                          <Table size="small"><TableBody>{materialsByStage.map(m => { const sel = planData.steps[`s${activeStep}`].materials?.find(sm => sm._id === m._id); return (<TableRow key={m._id}><TableCell style={{color:'white'}}>{m.name}</TableCell><TableCell>{sel && <input type="number" value={sel.quantity} onChange={e => handleQtyChange(`s${activeStep}`, m._id, e.target.value)} style={{width:'60px', background:'#1e293b', color:'white', border:'1px solid #334155'}}/>}</TableCell><TableCell><Button size="small" onClick={() => handleToggleMaterial(`s${activeStep}`, m)} variant={sel ? "contained" : "outlined"}>{sel ? "OK" : "+"}</Button></TableCell></TableRow>) })}</TableBody></Table>
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{marginTop:'auto', display:'flex', justifyContent:'space-between', borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'20px'}}>
                    <Button onClick={() => setActiveStep(s => s - 1)} disabled={activeStep === 0} style={{color:'#94a3b8'}}><ChevronLeft/> Назад</Button>
                    {activeStep === 7 ? <ActionButton onClick={finalizePlan}><ClipboardCheck/> ЗБЕРЕГТИ ПЛАН</ActionButton> : <ActionButton onClick={() => setActiveStep(s => s + 1)}>Далі <ChevronRight/></ActionButton>}
                  </div>
                </PlanFormContainer>
              </div>
            )}

            {activeTab === 'tech_plans_table' && (
              <TableContainer><StyledTable>
                  <thead><tr><th>Об'єкт будівництва</th><th>Дата створення</th><th style={{textAlign: 'right'}}>Дії</th></tr></thead>
                  <tbody>{filteredTechPlans.map(plan => (<tr key={plan._id}><td><b>{plan.objectId?.address || plan.name}</b></td><td>{new Date(plan.createdAt).toLocaleDateString()}</td><td style={{textAlign:'right'}}><IconButton onClick={() => handlePrintPlan(plan)} style={{color:'#38bdf8'}} title="Друк"><Printer size={20}/></IconButton><IconButton onClick={() => handleDeleteTechPlan(plan._id)} style={{color:'#ef4444'}} title="Видалити"><Trash2 size={20}/></IconButton></td></tr>))}</tbody>
              </StyledTable></TableContainer>
            )}

            {activeTab === 'objects' && (
              <TableContainer><StyledTable>
                <thead><tr><th>Адреса</th><th>Площа</th><th>GPS Координати</th></tr></thead>
                <tbody>{filteredObjects.map(obj => (<tr key={obj._id}><td><b>{obj.address}</b></td><td>{obj.area} м²</td><td><code>{obj.coordinates || '—'}</code></td></tr>))}</tbody>
              </StyledTable></TableContainer>
            )}
          </>
        )}
      </MainContent>

      <Dialog open={openInspectionForm} onClose={() => setOpenInspectionForm(false)} maxWidth="lg" fullWidth PaperProps={{style:{backgroundColor:'#1e293b', color:'white', borderRadius:'24px'}}}>
        <DialogContent>
          <FormGrid onSubmit={handleSubmitInspection} id="insp-form">
            <SectionTitle><MapPin size={14}/> 1. Геологія та рельєф</SectionTitle>
            <InputGroup><label>Об'єкт *</label><select style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} required value={inspectionData.objectId?._id || inspectionData.objectId} onChange={e => setInspectionData({...inspectionData, objectId: e.target.value})}><option value="">Оберіть...</option>{buildingObjects.map(o => <option key={o._id} value={o._id}>{o.address}</option>)}</select></InputGroup>
            <InputGroup><label>Грунт *</label><select style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} required value={inspectionData.soilType} onChange={e => setInspectionData({...inspectionData, soilType: e.target.value})}>{['Піщаний', 'Глинистий', 'Чорнозем', 'Кам’янистий'].map(s => <option key={s} value={s}>{s}</option>)}</select></InputGroup>
            <InputGroup><label>Рівень вод *</label><select style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} required value={inspectionData.groundwaterLevel} onChange={e => setInspectionData({...inspectionData, groundwaterLevel: e.target.value})}>{['Низький (>3м)', 'Середній (1.5-3м)', 'Високий'].map(l => <option key={l} value={l}>{l}</option>)}</select></InputGroup>
            <InputGroup $span={3}><label>Опис рельєфу *</label><input style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} required value={inspectionData.relief} onChange={e => setInspectionData({...inspectionData, relief: e.target.value})} /></InputGroup>

            <SectionTitle><Zap size={14}/> 2. Електрика</SectionTitle>
            <InputGroup><label>Статус *</label><select style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} required value={inspectionData.electricity.status} onChange={e => setInspectionData({...inspectionData, electricity: {...inspectionData.electricity, status: e.target.value}})}><option value="Підключено">Підключено</option><option value="Поруч (стовп)">Поруч (стовп)</option><option value="Відсутнє">Відсутнє</option></select></InputGroup>
            <InputGroup><label>Відстань (м)</label><input style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} type="number" min="0" value={inspectionData.electricity.distance} onChange={e => setInspectionData({...inspectionData, electricity: {...inspectionData.electricity, distance: e.target.value}})}/></InputGroup>
            <InputGroup><label>Фази</label><select style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} value={inspectionData.electricity.phases} onChange={e => setInspectionData({...inspectionData, electricity: {...inspectionData.electricity, phases: e.target.value}})}><option value="1-фаза">1-фаза</option><option value="3-фази">3-фази</option><option value="Невідомо">Невідомо</option></select></InputGroup>

            <SectionTitle><Droplets size={14}/> 3. Вода та Газ</SectionTitle>
            <InputGroup><label>Вода *</label><select style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} required value={inspectionData.water.status} onChange={e => setInspectionData({...inspectionData, water: {...inspectionData.water, status: e.target.value}})}><option value="Централізоване">Централізоване</option><option value="Свердловина">Свердловина</option><option value="Відсутнє">Відсутнє</option></select></InputGroup>
            <InputGroup><label>Глибина (м)</label><input style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} type="number" min="0" value={inspectionData.water.depthExpected} onChange={e => setInspectionData({...inspectionData, water: {...inspectionData.water, depthExpected: e.target.value}})}/></InputGroup>
            <InputGroup><label>Газ</label><select style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} value={inspectionData.gas.status} onChange={e => setInspectionData({...inspectionData, gas: {status: e.target.value}})}><option value="Відсутнє">Відсутнє</option><option value="Є по вулиці">Є по вулиці</option></select></InputGroup>

            <SectionTitle><Truck size={14}/> 4. Логістика будівництва</SectionTitle>
            <InputGroup><label>Дорожнє покриття *</label><select style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} required value={inspectionData.accessRoads} onChange={e => setInspectionData({...inspectionData, accessRoads: e.target.value})}>{['Асфальтоване', 'Бетонні плити', 'Грунтові дороги'].map(r => <option key={r} value={r}>{r}</option>)}</select></InputGroup>
            <InputGroup><label>Складування *</label><select style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} required value={inspectionData.storageArea} onChange={e => setInspectionData({...inspectionData, storageArea: e.target.value})}><option value="Достатньо місця">Достатньо місця</option><option value="Обмежений простір">Обмежений простір</option><option value="Місце відсутнє">Місце відсутнє</option></select></InputGroup>
            <div style={{display:'flex', gap:'20px', alignItems:'center', paddingLeft:'10px'}}><FormControlLabel control={<Switch checked={inspectionData.truckAccess} onChange={e => setInspectionData({...inspectionData, truckAccess: e.target.checked})} color="primary" />} label="Доступ фури" /><FormControlLabel control={<Switch checked={inspectionData.powerLines} onChange={e => setInspectionData({...inspectionData, powerLines: e.target.checked})} color="warning" />} label="ЛЕП" /></div>

            <SectionTitle><ShieldAlert size={14}/> 5. Обмеження</SectionTitle>
            <InputGroup $span={1.5}><label>Споруди на ділянці</label><textarea style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} value={inspectionData.existingStructures} onChange={e => setInspectionData({...inspectionData, existingStructures: e.target.value})} /></InputGroup>
            <InputGroup $span={1.5}><label>Сусіди</label><textarea style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} value={inspectionData.neighborConstraints} onChange={e => setInspectionData({...inspectionData, neighborConstraints: e.target.value})} /></InputGroup>

            <SectionTitle><Construction size={14}/> 6. Висновок</SectionTitle>
            <InputGroup $span={3}><label>Рекомендації координатора *</label><textarea style={{padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white'}} required value={inspectionData.recommendations} onChange={e => setInspectionData({...inspectionData, recommendations: e.target.value})} /></InputGroup>
          </FormGrid>
        </DialogContent>
        <DialogActions style={{padding: 20}}>
          <Button onClick={()=>setOpenInspectionForm(false)} style={{color:'#94a3b8'}}>СКАСУВАТИ</Button>
          <Button type="submit" form="insp-form" variant="contained" style={{background:'#38bdf8', color:'#0a0f16', fontWeight: 'bold'}}>ЗБЕРЕГТИ АКТ</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ style: { backgroundColor: '#1e293b', borderRadius: '40px', padding: '15px' } }}>
        <DialogContent style={{textAlign:'center'}}>
          <OrangeAlertBar><AlertText><AlertTriangle size={24} color="white"/> Вийти з системи?</AlertText><ConfirmLogoutButton onClick={handleLogout}>ТАК ВИЙТИ</ConfirmLogoutButton></OrangeAlertBar>
          <div style={{marginTop: '15px'}}><CancelLogoutLink onClick={() => setLogoutDialogOpen(false)}>СКАСУВАТИ</CancelLogoutLink></div>
        </DialogContent>
      </Dialog>

      <Snackbar open={notify.open} autoHideDuration={3000} onClose={()=>setNotify({...notify, open:false})} anchorOrigin={{vertical:'top',horizontal:'right'}}><Alert severity={notify.severity} variant="filled" style={{ borderRadius: '12px', fontWeight: 600 }}>{notify.message}</Alert></Snackbar>
    </DashboardWrapper>
  );
};

export default TechnicalDashboard;