import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

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
    onSuccess: (data) => {
      const settingsMap = data.reduce((acc, setting) => {
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
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return apiRequest('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify({ key, value }),
      });
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
      await apiRequest('/api/auth/logout', { method: 'POST' });
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