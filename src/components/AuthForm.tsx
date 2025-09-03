'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`)
};

interface AuthFormProps {
  onLogin: (user: any) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  // Mock users database
  const mockUsers = [
    { id: 1, email: 'admin@inventory.com', password: 'admin123', username: 'admin', role: 'admin' },
    { id: 2, email: 'user@inventory.com', password: 'user123', username: 'user', role: 'user' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Email dan password wajib diisi');
      return;
    }

    if (!isLogin) {
      if (!formData.username) {
        toast.error('Username wajib diisi untuk registrasi');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Konfirmasi password tidak cocok');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password minimal 6 karakter');
        return;
      }
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        // Login logic
        const user = mockUsers.find(u => 
          u.email === formData.email && u.password === formData.password
        );
        
        if (user) {
          toast.success(`Selamat datang, ${user.username}!`);
          onLogin(user);
        } else {
          toast.error('Email atau password salah');
        }
      } else {
        // Register logic
        const existingUser = mockUsers.find(u => u.email === formData.email);
        if (existingUser) {
          toast.error('Email sudah terdaftar');
          return;
        }
        
        const newUser = {
          id: mockUsers.length + 1,
          email: formData.email,
          password: formData.password,
          username: formData.username,
          role: 'user'
        };
        
        mockUsers.push(newUser);
        toast.success('Registrasi berhasil! Silakan login.');
        setIsLogin(true);
        setFormData({ email: '', password: '', confirmPassword: '', username: '' });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (userType: 'admin' | 'user') => {
    const demoUser = userType === 'admin' 
      ? mockUsers.find(u => u.role === 'admin')
      : mockUsers.find(u => u.role === 'user');
    
    if (demoUser) {
      toast.success(`Demo login sebagai ${userType}`);
      onLogin(demoUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">📦</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sistem Inventaris</h1>
          <p className="text-gray-600">Aplikasi Manajemen Inventaris Barang</p>
        </div>

        {/* Auth Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl">
              {isLogin ? '🔐 Login ke Sistem' : '📝 Daftar Akun Baru'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isLogin 
                ? 'Masukkan kredensial untuk mengakses dashboard' 
                : 'Buat akun baru untuk menggunakan sistem'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Masukkan username"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="nama@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Masukkan password"
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Ulangi password"
                    required={!isLogin}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-11" 
                disabled={loading}
              >
                {loading 
                  ? (isLogin ? 'Memproses Login...' : 'Memproses Registrasi...') 
                  : (isLogin ? '🔓 Login' : '📝 Daftar')
                }
              </Button>
            </form>

            {/* Demo Login Buttons */}
            {isLogin && (
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Demo Login</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDemoLogin('admin')}
                    className="text-xs"
                    disabled={loading}
                  >
                    👑 Demo Admin
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDemoLogin('user')}
                    className="text-xs"
                    disabled={loading}
                  >
                    👤 Demo User
                  </Button>
                </div>
              </div>
            )}

            {/* Toggle Login/Register */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ email: '', password: '', confirmPassword: '', username: '' });
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin 
                  ? '📝 Belum punya akun? Daftar di sini' 
                  : '🔐 Sudah punya akun? Login di sini'
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        {isLogin && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-blue-900 mb-3">🔑 Demo Credentials:</h3>
              <div className="space-y-2 text-xs text-blue-800">
                <div className="bg-white/50 p-2 rounded border">
                  <strong>Admin:</strong><br />
                  Email: admin@inventory.com<br />
                  Password: admin123
                </div>
                <div className="bg-white/50 p-2 rounded border">
                  <strong>User:</strong><br />
                  Email: user@inventory.com<br />
                  Password: user123
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 Sistem Inventaris. Aplikasi manajemen inventaris modern.
          </p>
        </div>
      </div>
    </div>
  );
}