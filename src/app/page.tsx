'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// Simple toast function
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`)
};

export default function HomePage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Master data states dengan kode dan deskripsi lengkap
  const [categories, setCategories] = useState([
    { id: 1, code: 'ELK', name: 'Elektronik', description: 'Perangkat elektronik dan gadget' },
    { id: 2, code: 'FUR', name: 'Furniture', description: 'Mebel dan perabotan kantor' },
    { id: 3, code: 'ATK', name: 'ATK', description: 'Alat tulis kantor dan perlengkapan administrasi' },
    { id: 4, code: 'KMP', name: 'Komputer', description: 'Perangkat komputer dan aksesoris IT' }
  ]);

  const [locations, setLocations] = useState([
    { id: 1, code: 'GDG', name: 'Gudang Utama', description: 'Gudang penyimpanan utama lantai dasar' },
    { id: 2, code: 'SVR', name: 'Ruang Server', description: 'Ruang khusus untuk perangkat IT dan server' },
    { id: 3, code: 'KT1', name: 'Kantor Lt.1', description: 'Area kantor lantai 1 untuk staff operasional' },
    { id: 4, code: 'KT2', name: 'Kantor Lt.2', description: 'Area kantor lantai 2 untuk manajemen' }
  ]);

  const [conditions, setConditions] = useState([
    { id: 1, code: 'BK', name: 'Baik', description: 'Kondisi barang masih baik dan berfungsi normal' },
    { id: 2, code: 'RR', name: 'Rusak Ringan', description: 'Kondisi barang mengalami kerusakan ringan' },
    { id: 3, code: 'RB', name: 'Rusak Berat', description: 'Kondisi barang mengalami kerusakan berat' },
    { id: 4, code: 'PR', name: 'Perlu Perbaikan', description: 'Kondisi barang memerlukan perbaikan' }
  ]);

  const [purposes, setPurposes] = useState([
    { id: 1, code: 'OPS', name: 'Operasional', description: 'Untuk kegiatan operasional sehari-hari' },
    { id: 2, code: 'CDG', name: 'Cadangan', description: 'Sebagai barang cadangan atau backup' },
    { id: 3, code: 'MNT', name: 'Maintenance', description: 'Untuk keperluan maintenance dan perbaikan' },
    { id: 4, code: 'TST', name: 'Testing', description: 'Untuk keperluan testing dan pengembangan' }
  ]);

  const [items, setItems] = useState([
    {
      id: 1, code: 'ELK001', name: 'Laptop Dell Inspiron 15', quantity: 10,
      category_id: 4, location_id: 2, condition_id: 1, purpose_id: 1, price: 8500000,
      category: { name: 'Komputer' }, location: { name: 'Ruang Server' }, condition: { name: 'Baik' }
    },
    {
      id: 2, code: 'FUR001', name: 'Meja Kantor Executive', quantity: 5,
      category_id: 2, location_id: 3, condition_id: 1, purpose_id: 1, price: 2500000,
      category: { name: 'Furniture' }, location: { name: 'Kantor Lt.1' }, condition: { name: 'Baik' }
    },
    {
      id: 3, code: 'ATK001', name: 'Kertas A4 HVS', quantity: 2,
      category_id: 3, location_id: 1, condition_id: 1, purpose_id: 1, price: 45000,
      category: { name: 'ATK' }, location: { name: 'Gudang Utama' }, condition: { name: 'Baik' }
    },
    {
      id: 4, code: 'ELK002', name: 'Monitor Samsung 24 inch', quantity: 15,
      category_id: 1, location_id: 2, condition_id: 1, purpose_id: 1, price: 1800000,
      category: { name: 'Elektronik' }, location: { name: 'Ruang Server' }, condition: { name: 'Baik' }
    }
  ]);

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMasterDialog, setShowMasterDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingMaster, setEditingMaster] = useState<any>(null);
  const [masterType, setMasterType] = useState<'categories' | 'locations' | 'conditions' | 'purposes'>('categories');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '', name: '', quantity: 0, category_id: 0, location_id: 0, condition_id: 0, purpose_id: 0, price: 0,
  });

  const [masterFormData, setMasterFormData] = useState({
    code: '', name: '', description: '',
  });

  // Items functions
  const resetItemForm = () => {
    setFormData({
      code: '', name: '', quantity: 0, category_id: 0, location_id: 0, condition_id: 0, purpose_id: 0, price: 0,
    });
    setEditingItem(null);
  };

  const openAddDialog = () => {
    resetItemForm();
    setShowAddDialog(true);
  };

  const openEditDialog = (item: any) => {
    setFormData({
      code: item.code,
      name: item.name,
      quantity: item.quantity,
      category_id: item.category_id,
      location_id: item.location_id,
      condition_id: item.condition_id,
      purpose_id: item.purpose_id,
      price: item.price,
    });
    setEditingItem(item);
    setShowAddDialog(true);
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.category_id || !formData.location_id || !formData.condition_id) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const category = categories.find(c => c.id === formData.category_id);
      const location = locations.find(l => l.id === formData.location_id);
      const condition = conditions.find(c => c.id === formData.condition_id);
      
      if (editingItem) {
        const updatedItem = {
          ...editingItem,
          ...formData,
          category: { name: category?.name || '' },
          location: { name: location?.name || '' },
          condition: { name: condition?.name || '' }
        };
        
        setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
        toast.success('Barang berhasil diupdate!');
      } else {
        const newItem = {
          id: Math.max(...items.map(i => i.id)) + 1,
          ...formData,
          category: { name: category?.name || '' },
          location: { name: location?.name || '' },
          condition: { name: condition?.name || '' }
        };
        
        setItems([...items, newItem]);
        toast.success('Barang berhasil ditambahkan!');
      }
      
      setShowAddDialog(false);
      resetItemForm();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setLoading(false);
    }
  };

  const handleItemDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      setItems(items.filter(item => item.id !== id));
      toast.success('Barang berhasil dihapus!');
    }
  };

  // Authentication functions
  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('inventoryUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setCurrentPage('dashboard');
      localStorage.removeItem('inventoryUser');
      toast.success('Logout berhasil!');
    }
  };

  // Check for existing session on component mount
  useState(() => {
    const savedUser = localStorage.getItem('inventoryUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('inventoryUser');
      }
    }
  });

  // Master data functions
  const openMasterDialog = (type: 'categories' | 'locations' | 'conditions' | 'purposes') => {
    setMasterType(type);
    setMasterFormData({ code: '', name: '', description: '' });
    setEditingMaster(null);
    setShowMasterDialog(true);
  };

  const openEditMasterDialog = (type: 'categories' | 'locations' | 'conditions' | 'purposes', item: any) => {
    setMasterType(type);
    setMasterFormData({ code: item.code || '', name: item.name || '', description: item.description || '' });
    setEditingMaster(item);
    setShowMasterDialog(true);
  };

  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterFormData.name) { toast.error('Nama wajib diisi'); return; }
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingMaster) {
        const updatedItem = { ...editingMaster, ...masterFormData };
        switch (masterType) {
          case 'categories': setCategories(categories.map(item => item.id === editingMaster.id ? updatedItem : item)); break;
          case 'locations': setLocations(locations.map(item => item.id === editingMaster.id ? updatedItem : item)); break;
          case 'conditions': setConditions(conditions.map(item => item.id === editingMaster.id ? updatedItem : item)); break;
          case 'purposes': setPurposes(purposes.map(item => item.id === editingMaster.id ? updatedItem : item)); break;
        }
        toast.success('Data berhasil diupdate!');
      } else {
        const getCurrentData = () => {
          switch (masterType) {
            case 'categories': return categories;
            case 'locations': return locations;
            case 'conditions': return conditions;
            case 'purposes': return purposes;
          }
        };
        const currentData = getCurrentData();
        const newItem = { id: Math.max(...currentData.map(i => i.id)) + 1, ...masterFormData };
        
        switch (masterType) {
          case 'categories': setCategories([...categories, newItem]); break;
          case 'locations': setLocations([...locations, newItem]); break;
          case 'conditions': setConditions([...conditions, newItem]); break;
          case 'purposes': setPurposes([...purposes, newItem]); break;
        }
        toast.success('Data berhasil ditambahkan!');
      }
      
      setShowMasterDialog(false);
      setMasterFormData({ code: '', name: '', description: '' });
      setEditingMaster(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setLoading(false);
    }
  };

  const handleMasterDelete = (type: 'categories' | 'locations' | 'conditions' | 'purposes', id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      switch (type) {
        case 'categories': setCategories(categories.filter(item => item.id !== id)); break;
        case 'locations': setLocations(locations.filter(item => item.id !== id)); break;
        case 'conditions': setConditions(conditions.filter(item => item.id !== id)); break;
        case 'purposes': setPurposes(purposes.filter(item => item.id !== id)); break;
      }
      toast.success('Data berhasil dihapus!');
    }
  };

  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockItems = items.filter(item => item.quantity <= 5);



  // Render master data table
  const renderMasterDataTable = (
    data: any[], 
    type: 'categories' | 'locations' | 'conditions' | 'purposes',
    title: string,
    icon: string,
    addButtonText: string
  ) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">Kelola data {title.toLowerCase()} untuk sistem inventaris</p>
        </div>
        <Button onClick={() => openMasterDialog(type)} className="bg-blue-600 hover:bg-blue-700">
          ➕ {addButtonText}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{icon}</span>
            Daftar {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Kode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-medium text-gray-900">
                          {item.code}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate" title={item.description}>
                          {item.description}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEditMasterDialog(type, item)}
                            className="text-xs"
                          >
                            ✏️ Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleMasterDelete(type, item.id)}
                            className="text-xs"
                          >
                            🗑️ Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Total {data.length} {title.toLowerCase()}</span>
                <span className="text-muted-foreground">Data master sistem inventaris</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch(currentPage) {
      case 'dashboard': return renderDashboard();
      case 'items': return renderItemsManagement();
      case 'categories': return renderMasterDataTable(categories, 'categories', 'Kategori', '🏷️', 'Tambah Kategori');
      case 'locations': return renderMasterDataTable(locations, 'locations', 'Lokasi', '📍', 'Tambah Lokasi');
      case 'conditions': return renderMasterDataTable(conditions, 'conditions', 'Kondisi', '🔧', 'Tambah Kondisi');
      case 'purposes': return renderMasterDataTable(purposes, 'purposes', 'Peruntukan', '🎯', 'Tambah Peruntukan');
      case 'reports': return renderPlaceholderPage('Laporan', 'Generate dan view laporan inventaris');
      case 'settings': return renderPlaceholderPage('Pengaturan', 'Pengaturan user dan sistem');
      default: return renderDashboard();
    }
  };

  const renderPlaceholderPage = (title: string, description: string) => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center justify-center h-64 border rounded-lg bg-white">
        <div className="text-center">
          <div className="text-4xl mb-4">🚧</div>
          <p className="text-muted-foreground">Halaman {title} - Coming Soon</p>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan sistem inventaris Anda</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
            <span>📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Item dalam inventaris</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
            <span>💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalValue.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Nilai inventaris</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
            <span>⚠️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Item dengan stok ≤ 5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategori</CardTitle>
            <span>🏷️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Kategori tersedia</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🕒</span>
              Barang Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.code} • {item.category.name}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.quantity <= 5 ? 'destructive' : 'secondary'}>
                      {item.quantity} unit
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⚠️</span>
              Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Semua barang memiliki stok yang cukup
                </p>
              ) : (
                lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.code} • {item.location.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={item.quantity === 0 ? "destructive" : "secondary"}>
                        {item.quantity} unit
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderItemsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Barang</h1>
          <p className="text-muted-foreground">Kelola inventaris barang dalam sistem</p>
        </div>
        <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
          ➕ Tambah Barang
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📦 Daftar Barang</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Kode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Barang</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Kategori</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Jumlah</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Lokasi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Kondisi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Harga</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-medium text-gray-900">{item.code}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="text-xs">{item.category.name}</Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <Badge variant={item.quantity <= 5 ? 'destructive' : item.quantity <= 10 ? 'secondary' : 'default'} className="text-xs">
                          {item.quantity} unit
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{item.location.name}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">{item.condition.name}</Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">Rp {item.price.toLocaleString('id-ID')}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEditDialog(item)}
                            className="text-xs"
                          >
                            ✏️ Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleItemDelete(item.id)}
                            className="text-xs"
                          >
                            🗑️ Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Menampilkan {items.length} dari {items.length} barang</span>
                <span className="text-muted-foreground">Total Nilai: Rp {totalValue.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getMasterDialogTitle = () => {
    const titles = {
      categories: editingMaster ? 'Edit Kategori' : 'Tambah Kategori Baru',
      locations: editingMaster ? 'Edit Lokasi' : 'Tambah Lokasi Baru',
      conditions: editingMaster ? 'Edit Kondisi' : 'Tambah Kondisi Baru',
      purposes: editingMaster ? 'Edit Peruntukan' : 'Tambah Peruntukan Baru'
    };
    return titles[masterType];
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'items', name: 'Kelola Barang', icon: '📦' },
    { id: 'categories', name: 'Kategori', icon: '🏷️' },
    { id: 'locations', name: 'Lokasi', icon: '📍' },
    { id: 'conditions', name: 'Kondisi', icon: '🔧' },
    { id: 'purposes', name: 'Peruntukan', icon: '🎯' },
    { id: 'reports', name: 'Laporan', icon: '📈' },
    { id: 'settings', name: 'Pengaturan', icon: '⚙️' }
  ];

  // Show auth form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">📦</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Inventaris</h1>
            <p className="text-xs text-muted-foreground">Sistem Manajemen</p>
          </div>
        </div>
        
        <nav className="mt-6">
          <div className="px-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu Utama</div>
            {menuItems.slice(0, 2).map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  currentPage === item.id ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          
          <div className="px-3 mt-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Data Master</div>
            {menuItems.slice(2, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  currentPage === item.id ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          
          <div className="px-3 mt-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Lainnya</div>
            {menuItems.slice(6).map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  currentPage === item.id ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <div className="text-center text-xs text-muted-foreground space-y-3">
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="font-medium">👤 {currentUser?.username || 'User'}</div>
              <div>{currentUser?.email || 'user@inventory.com'}</div>
              <div className="mt-1">
                <Badge variant="secondary" className="text-xs">
                  {currentUser?.role === 'admin' ? '👑 Admin' : '👤 User'}
                </Badge>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
            >
              🚪 Logout
            </Button>
            <div>© 2024 Sistem Inventaris</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">
                {menuItems.find(item => item.id === currentPage)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {renderContent()}
        </div>
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) resetItemForm();
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? '✏️ Edit Barang' : '➕ Tambah Barang Baru'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleItemSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kode Barang *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="ELK001"
                  required
                />
              </div>
              <div>
                <Label>Jumlah *</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Nama Barang *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nama lengkap barang"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kategori *</Label>
                <Select value={formData.category_id.toString()} onValueChange={(value) => setFormData({...formData, category_id: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        🏷️ {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lokasi *</Label>
                <Select value={formData.location_id.toString()} onValueChange={(value) => setFormData({...formData, location_id: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id.toString()}>
                        📍 {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kondisi *</Label>
                <Select value={formData.condition_id.toString()} onValueChange={(value) => setFormData({...formData, condition_id: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((cond) => (
                      <SelectItem key={cond.id} value={cond.id.toString()}>
                        🔧 {cond.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Peruntukan</Label>
                <Select value={formData.purpose_id.toString()} onValueChange={(value) => setFormData({...formData, purpose_id: parseInt(value) || 0})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peruntukan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">-- Tidak dipilih --</SelectItem>
                    {purposes.map((purpose) => (
                      <SelectItem key={purpose.id} value={purpose.id.toString()}>
                        🎯 {purpose.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Harga (Rp) *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? 'Menyimpan...' : (editingItem ? '✅ Update' : '➕ Tambah')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Master Data Dialog */}
      <Dialog open={showMasterDialog} onOpenChange={setShowMasterDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{getMasterDialogTitle()}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleMasterSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kode {masterType === 'categories' ? 'Kategori' : masterType === 'locations' ? 'Lokasi' : masterType === 'conditions' ? 'Kondisi' : 'Peruntukan'} *</Label>
                <Input
                  value={masterFormData.code}
                  onChange={(e) => setMasterFormData({...masterFormData, code: e.target.value})}
                  placeholder={masterType === 'categories' ? 'ELK' : masterType === 'locations' ? 'GDG' : masterType === 'conditions' ? 'BK' : 'OPS'}
                  required
                />
              </div>
              <div>
                <Label>Nama {masterType === 'categories' ? 'Kategori' : masterType === 'locations' ? 'Lokasi' : masterType === 'conditions' ? 'Kondisi' : 'Peruntukan'} *</Label>
                <Input
                  value={masterFormData.name}
                  onChange={(e) => setMasterFormData({...masterFormData, name: e.target.value})}
                  placeholder={masterType === 'categories' ? 'Elektronik' : masterType === 'locations' ? 'Gudang Utama' : masterType === 'conditions' ? 'Baik' : 'Operasional'}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Deskripsi</Label>
              <Textarea
                value={masterFormData.description}
                onChange={(e) => setMasterFormData({...masterFormData, description: e.target.value})}
                placeholder={masterType === 'categories' ? 'Deskripsi kategori barang...' : masterType === 'locations' ? 'Deskripsi lokasi penyimpanan...' : masterType === 'conditions' ? 'Deskripsi kondisi barang...' : 'Deskripsi peruntukan barang...'}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowMasterDialog(false)} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? 'Menyimpan...' : (editingMaster ? '✅ Update' : '➕ Tambah')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}