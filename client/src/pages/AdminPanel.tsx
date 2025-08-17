import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Trash2, Edit, Shield, Users, Trophy, CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: string;
}

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not admin
  if (!isAdmin) {
    setLocation('/');
    return null;
  }

  const [smtpSettings, setSmtpSettings] = useState({
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    smtp_sender: '',
  });

  const [brandingSettings, setBrandingSettings] = useState({
    website_name: '',
    website_logo: '',
    website_favicon: '',
  });

  // Fetch settings
  const { data: settings } = useQuery<Setting[]>({
    queryKey: ['/api/admin/settings'],
  });

  // Update local state when settings data changes
  React.useEffect(() => {
    if (settings) {
      const settingsMap = settings.reduce((acc: Record<string, string>, setting: Setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

      setSmtpSettings(prev => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(settingsMap).filter(([key]) => key.startsWith('smtp_'))
        ),
      }));

      setBrandingSettings(prev => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(settingsMap).filter(([key]) => key.startsWith('website_'))
        ),
      }));
    }
  }, [settings]);

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return apiRequest('POST', '/api/admin/settings', { key, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: 'Setting updated',
        description: 'Configuration has been saved successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update setting',
        variant: 'destructive',
      });
    },
  });

  const handleSmtpSave = () => {
    Object.entries(smtpSettings).forEach(([key, value]) => {
      updateSettingMutation.mutate({ key, value });
    });
  };

  const handleBrandingSave = () => {
    Object.entries(brandingSettings).forEach(([key, value]) => {
      updateSettingMutation.mutate({ key, value });
    });
  };

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
      queryClient.clear();
      setLocation('/login');
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black">
      {/* Header */}
      <div className="bg-gray-900/90 border-b border-purple-500/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400">Welcome, {user?.name}</p>
          </div>
          <Button 
            data-testid="button-logout"
            onClick={handleLogout}
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-purple-500/20">
            <TabsTrigger 
              data-testid="tab-settings"
              value="settings" 
              className="data-[state=active]:bg-purple-600"
            >
              Settings
            </TabsTrigger>
            <TabsTrigger 
              data-testid="tab-tournaments"
              value="tournaments"
              className="data-[state=active]:bg-purple-600"
            >
              Tournaments
            </TabsTrigger>
            <TabsTrigger 
              data-testid="tab-users"
              value="users"
              className="data-[state=active]:bg-purple-600"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              data-testid="tab-payments"
              value="payments"
              className="data-[state=active]:bg-purple-600"
            >
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <TournamentManagement />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SMTP Settings */}
              <Card className="bg-gray-900/90 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">SMTP Email Setup</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure email settings for tournament notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="smtp_host" className="text-gray-200">SMTP Host</Label>
                    <Input
                      id="smtp_host"
                      data-testid="input-smtp-host"
                      value={smtpSettings.smtp_host}
                      onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                      placeholder="smtp.gmail.com"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_port" className="text-gray-200">SMTP Port</Label>
                    <Input
                      id="smtp_port"
                      data-testid="input-smtp-port"
                      value={smtpSettings.smtp_port}
                      onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_port: e.target.value }))}
                      placeholder="587"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_user" className="text-gray-200">SMTP Username</Label>
                    <Input
                      id="smtp_user"
                      data-testid="input-smtp-user"
                      value={smtpSettings.smtp_user}
                      onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_user: e.target.value }))}
                      placeholder="your-email@gmail.com"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_password" className="text-gray-200">SMTP Password</Label>
                    <Input
                      id="smtp_password"
                      data-testid="input-smtp-password"
                      type="password"
                      value={smtpSettings.smtp_password}
                      onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
                      placeholder="your-app-password"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_sender" className="text-gray-200">Sender Email</Label>
                    <Input
                      id="smtp_sender"
                      data-testid="input-smtp-sender"
                      value={smtpSettings.smtp_sender}
                      onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_sender: e.target.value }))}
                      placeholder="noreply@skillsmoney.com"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <Button
                    data-testid="button-save-smtp"
                    onClick={handleSmtpSave}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={updateSettingMutation.isPending}
                  >
                    {updateSettingMutation.isPending ? 'Saving...' : 'Save SMTP Settings'}
                  </Button>
                </CardContent>
              </Card>

              {/* Website Branding */}
              <Card className="bg-gray-900/90 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Website Branding</CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize your website appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="website_name" className="text-gray-200">Website Name</Label>
                    <Input
                      id="website_name"
                      data-testid="input-website-name"
                      value={brandingSettings.website_name}
                      onChange={(e) => setBrandingSettings(prev => ({ ...prev, website_name: e.target.value }))}
                      placeholder="SkillsMoney Tournament Platform"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_logo" className="text-gray-200">Logo URL</Label>
                    <Input
                      id="website_logo"
                      data-testid="input-website-logo"
                      value={brandingSettings.website_logo}
                      onChange={(e) => setBrandingSettings(prev => ({ ...prev, website_logo: e.target.value }))}
                      placeholder="/logo.png"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_favicon" className="text-gray-200">Favicon URL</Label>
                    <Input
                      id="website_favicon"
                      data-testid="input-website-favicon"
                      value={brandingSettings.website_favicon}
                      onChange={(e) => setBrandingSettings(prev => ({ ...prev, website_favicon: e.target.value }))}
                      placeholder="/favicon.ico"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <Button
                    data-testid="button-save-branding"
                    onClick={handleBrandingSave}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={updateSettingMutation.isPending}
                  >
                    {updateSettingMutation.isPending ? 'Saving...' : 'Save Branding Settings'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tournaments">
            <Card className="bg-gray-900/90 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Tournament Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Create and manage tournaments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Tournament management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-gray-900/90 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">User management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="bg-gray-900/90 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Payment Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Review and approve payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Payment management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// User Management Component
function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return apiRequest('PATCH', `/api/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Role Updated',
        description: 'User role has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update user role',
        variant: 'destructive',
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest('DELETE', `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'User Deleted',
        description: 'User has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    },
  });

  return (
    <Card className="bg-gray-900/90 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Users className="h-5 w-5 mr-2" />
          User Management
        </CardTitle>
        <CardDescription className="text-gray-400">
          Manage user accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Users Found</h3>
            <p className="text-gray-400">No users are registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left text-gray-300 py-3">Name</th>
                  <th className="text-left text-gray-300 py-3">Email</th>
                  <th className="text-left text-gray-300 py-3">Role</th>
                  <th className="text-left text-gray-300 py-3">Age Verified</th>
                  <th className="text-left text-gray-300 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-purple-500/10">
                    <td className="py-3 text-white">{user.name}</td>
                    <td className="py-3 text-gray-300">{user.email}</td>
                    <td className="py-3">
                      <Select
                        value={user.role || 'user'}
                        onValueChange={(role) => updateRoleMutation.mutate({ userId: user.id, role })}
                      >
                        <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3">
                      <Badge className={user.isAgeVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {user.isAgeVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button
                        onClick={() => deleteUserMutation.mutate(user.id)}
                        disabled={deleteUserMutation.isPending}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Tournament Management Component
function TournamentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ['/api/admin/tournaments'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ tournamentId, status }: { tournamentId: string; status: string }) => {
      return apiRequest('PATCH', `/api/admin/tournaments/${tournamentId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tournaments'] });
      toast({
        title: 'Status Updated',
        description: 'Tournament status has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update tournament status',
        variant: 'destructive',
      });
    },
  });

  const deleteTournamentMutation = useMutation({
    mutationFn: async (tournamentId: string) => {
      return apiRequest('DELETE', `/api/admin/tournaments/${tournamentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tournaments'] });
      toast({
        title: 'Tournament Deleted',
        description: 'Tournament has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete tournament',
        variant: 'destructive',
      });
    },
  });

  return (
    <Card className="bg-gray-900/90 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Tournament Management
        </CardTitle>
        <CardDescription className="text-gray-400">
          Manage tournament status and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading tournaments...</div>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Tournaments Found</h3>
            <p className="text-gray-400">No tournaments have been created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left text-gray-300 py-3">Name</th>
                  <th className="text-left text-gray-300 py-3">Game Mode</th>
                  <th className="text-left text-gray-300 py-3">Entry Fee</th>
                  <th className="text-left text-gray-300 py-3">Status</th>
                  <th className="text-left text-gray-300 py-3">Start Time</th>
                  <th className="text-left text-gray-300 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((tournament: any) => (
                  <tr key={tournament.id} className="border-b border-purple-500/10">
                    <td className="py-3 text-white">{tournament.name}</td>
                    <td className="py-3 text-gray-300">{tournament.gameMode}</td>
                    <td className="py-3 text-gray-300">৳{tournament.entryFee}</td>
                    <td className="py-3">
                      <Select
                        value={tournament.status}
                        onValueChange={(status) => updateStatusMutation.mutate({ tournamentId: tournament.id, status })}
                      >
                        <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="finished">Finished</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 text-gray-300">
                      {new Date(tournament.startTime).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <Button
                        onClick={() => deleteTournamentMutation.mutate(tournament.id)}
                        disabled={deleteTournamentMutation.isPending}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Payment Management Component
function PaymentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['/api/admin/payments/pending'],
  });

  const approvePaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      return apiRequest('POST', `/api/admin/payments/${paymentId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments/pending'] });
      toast({
        title: 'Payment Approved',
        description: 'Payment has been approved successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Approval Failed',
        description: error.message || 'Failed to approve payment',
        variant: 'destructive',
      });
    },
  });

  const rejectPaymentMutation = useMutation({
    mutationFn: async ({ paymentId, reason }: { paymentId: string; reason: string }) => {
      return apiRequest('POST', `/api/admin/payments/${paymentId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments/pending'] });
      toast({
        title: 'Payment Rejected',
        description: 'Payment has been rejected successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Rejection Failed',
        description: error.message || 'Failed to reject payment',
        variant: 'destructive',
      });
    },
  });

  return (
    <Card className="bg-gray-900/90 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Management
        </CardTitle>
        <CardDescription className="text-gray-400">
          Approve or reject pending payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading payments...</div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Pending Payments</h3>
            <p className="text-gray-400">All payments have been processed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left text-gray-300 py-3">User</th>
                  <th className="text-left text-gray-300 py-3">Method</th>
                  <th className="text-left text-gray-300 py-3">Amount</th>
                  <th className="text-left text-gray-300 py-3">TXN ID</th>
                  <th className="text-left text-gray-300 py-3">Phone</th>
                  <th className="text-left text-gray-300 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="border-b border-purple-500/10">
                    <td className="py-3 text-white">{payment.userId}</td>
                    <td className="py-3">
                      <Badge className={payment.method === 'bkash' ? 'bg-pink-500/20 text-pink-400' : 'bg-orange-500/20 text-orange-400'}>
                        {payment.method}
                      </Badge>
                    </td>
                    <td className="py-3 text-gray-300">৳{payment.amount}</td>
                    <td className="py-3 text-gray-300">{payment.txnId}</td>
                    <td className="py-3 text-gray-300">{payment.payerNumber}</td>
                    <td className="py-3 flex gap-2">
                      <Button
                        onClick={() => approvePaymentMutation.mutate(payment.id)}
                        disabled={approvePaymentMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => rejectPaymentMutation.mutate({ paymentId: payment.id, reason: 'Invalid transaction' })}
                        disabled={rejectPaymentMutation.isPending}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}