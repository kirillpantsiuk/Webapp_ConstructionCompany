import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Link, 
    Paper,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface FormData {
  username: string;
  password: string;
  email: string;
  role: string;
  address: Address;
}

const AuthForm: React.FC<{ type: 'login' | 'register' }> = ({ type }) => {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    email: '',
    role: 'client',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1] as keyof Address;
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'login') {
      await login(formData.username, formData.password);
    } else {
      await register(formData);
    }
  };

  return (
    <Paper elevation={3} sx={{ 
      padding: 4, 
      maxWidth: 500, 
      margin: 'auto', 
      mt: 8,
      background: 'linear-gradient(145deg, #e6f7ff, #ffffff)',
      borderRadius: 3,
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h4" align="center" mb={4} sx={{ 
        fontWeight: 700, 
        background: '-webkit-linear-gradient(45deg, #1976d2, #2196f3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {type === 'login' ? 'Construction App Login' : 'Create Account'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />
        
        {type === 'register' && (
          <>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            
            <Select
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleSelectChange}
              sx={{ mb: 2 }}
            >
              {['client', 'builder', 'foreman', 'project_manager', 'director', 'accountant'].map(role => (
                <MenuItem key={role} value={role}>
                  {role.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
            
            <Typography variant="h6" mt={2} mb={2} sx={{ fontWeight: 600, color: '#1976d2' }}>
              Address Information
            </Typography>
            
            <TextField
              fullWidth
              label="Street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              margin="normal"
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="State"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Postal Code"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
          </>
        )}
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ 
            mt: 3, 
            mb: 2,
            height: 50,
            fontSize: '1.1rem',
            background: 'linear-gradient(45deg, #1976d2, #2196f3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1e88e5)'
            }
          }}
        >
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
        
        <Box textAlign="center" mt={2}>
          {type === 'login' ? (
            <Link href="/register" variant="body2" sx={{ fontWeight: 500 }}>
              Don't have an account? Register now
            </Link>
          ) : (
            <Link href="/login" variant="body2" sx={{ fontWeight: 500 }}>
              Already have an account? Sign in
            </Link>
          )}
        </Box>
      </form>
    </Paper>
  );
};

export default AuthForm;