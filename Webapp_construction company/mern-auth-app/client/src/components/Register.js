import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import Alert from './Alert';
import '../styles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  const [alert, setAlert] = useState(null);

  const { username, password, role, email, address } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.register(formData);
      setAlert({ type: 'success', message: 'Registration successful!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response.data.msg });
    }
  };

  return (
    <div>
      <div className="header">Welcome to the Construction Company App</div>
      {alert && <Alert type={alert.type} message={alert.message} />}
      <form onSubmit={onSubmit}>
        <h2>Register</h2>
        <div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <select
            name="role"
            value={role}
            onChange={onChange}
            required
          >
            <option value="">Select Role</option>
            <option value="builder">Builder</option>
            <option value="foreman">Foreman</option>
            <option value="project_manager">Project Manager</option>
            <option value="client">Client</option>
            <option value="director">Director</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Street"
            name="street"
            value={address.street}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...address, street: e.target.value },
              })
            }
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="City"
            name="city"
            value={address.city}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...address, city: e.target.value },
              })
            }
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="State"
            name="state"
            value={address.state}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...address, state: e.target.value },
              })
            }
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Postal Code"
            name="postalCode"
            value={address.postalCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...address, postalCode: e.target.value },
              })
            }
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={address.country}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...address, country: e.target.value },
              })
            }
            required
          />
        </div>
        <button type="submit">Register</button>
        <Link to="/login" className="nav-link">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
};

export default Register;
