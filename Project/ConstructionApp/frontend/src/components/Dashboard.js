import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    _id: null,
    email: '',
    login: '',
    password: '',
    role: 'Worker',
    status: 'Active'
  });

  // Отримати користувачів з бекенду
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = Array.isArray(users)
    ? users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.login?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Збереження (Create / Update)
  const handleSaveUser = async () => {
    try {
      if (newUser._id) {
        const response = await fetch(`http://localhost:5000/api/users/${newUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newUser),
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(users.map(u => u._id === newUser._id ? data.user : u));
          alert('✅ User updated successfully');
        } else {
          alert(data.message);
        }
      } else {
        const response = await fetch('http://localhost:5000/api/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newUser),
        });
        const data = await response.json();
        if (response.ok) {
          setUsers([...users, data.user]);
          alert('✅ User created successfully');
        } else {
          alert(data.message);
        }
      }
      setShowForm(false);
      setNewUser({ _id: null, email: '', login: '', password: '', role: 'Worker', status: 'Active' });
    } catch (error) {
      console.error('Error saving user:', error);
      alert('❌ Server error');
    }
  };

  // Видалення
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.filter(u => u._id !== id));
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Редагування
  const handleEdit = (user) => {
    setNewUser(user);
    setShowForm(true);
  };

  return (
    <div className="dashboard-container">
      <h2>Super Admin Dashboard</h2>
      <p>Manage system users with full CRUD permissions</p>

      <div className="dashboard-actions">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="add-button" onClick={() => setShowForm(true)}>
          <AddIcon style={{ marginRight: '6px' }} /> Add User
        </button>
      </div>

      {showForm && (
        <div className="user-form">
          <h3>{newUser._id ? 'Edit User' : 'Create New User'}</h3>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Login"
            value={newUser.login}
            onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="Manager">Manager</option>
            <option value="TechnicalCoordinator">Technical Coordinator</option>
            <option value="Worker">Worker</option>
            <option value="Admin">Admin</option>
          </select>
          <select
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
          <button className="save-btn" onClick={handleSaveUser}>Save</button>
          <button className="cancel-btn" onClick={() => {
            setShowForm(false);
            setNewUser({ _id: null, email: '', login: '', password: '', role: 'Worker', status: 'Active' });
          }}>Cancel</button>
        </div>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Login</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.login}</td>
              <td>{user.role}</td>
              <td className={
                user.status === 'Active' ? 'status-active' :
                user.status === 'Inactive' ? 'status-inactive' :
                'status-pending'
              }>
                {user.status}
              </td>
              <td>
                <button className="icon-btn" onClick={() => handleEdit(user)}>
                  <EditIcon />
                </button>
                <button className="icon-btn" onClick={() => handleDelete(user._id)}>
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
