import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Payment, WebsiteOrder, Tournament } from "@shared/schema";
import { 
  Shield, 
  Trophy, 
  Users, 
  Clock, 
  DollarSign, 
  Check, 
  X, 
  RefreshCw,
  CreditCard,
  ShoppingCart,
  BarChart3,
  Bell,
  Mail,
  Activity,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  AlertCircle,
  Target,
  Package2
} from "lucide-react";
import { AdminStatsCard } from "@/components/ui/admin-stats-card";
import { AdminNotificationPanel } from "@/components/ui/admin-notification-panel";
import { AdminAnalyticsChart } from "@/components/ui/admin-analytics-chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Admin() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedAnalyticsPeriod, setSelectedAnalyticsPeriod] = useState("daily");
  const [smtpTestEmail, setSmtpTestEmail] = useState("");

  // Redirect to home if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'admin' && user.role !== 'super_admin'))) {
      toast({
        title: "Unauthorized",
        description: "Admin access required. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: pendingPayments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments/pending"],
    retry: false,
  });

  const { data: websiteOrders = [], isLoading: ordersLoading } = useQuery<WebsiteOrder[]>({
    queryKey: ["/api/website-orders/pending"],
    retry: false,
  });

  const { data: tournaments = [], isLoading: tournamentsLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
    retry: false,
  });

  // New queries for enhanced admin features
  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    retry: false,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: analyticsData = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics", selectedAnalyticsPeriod],
    retry: false,
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: emailLogs = [], isLoading: emailLogsLoading } = useQuery({
    queryKey: ["/api/admin/email-logs"],
    retry: false,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: activeUsers = 0, isLoading: activeUsersLoading } = useQuery({
    queryKey: ["/api/admin/active-users"],
    retry: false,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const approvePaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      await apiRequest("PATCH", `/api/payments/${paymentId}/approve`);
    },
    onSuccess: () => {
      toast({
        title: "Payment Approved",
        description: "Payment has been successfully approved",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/payments/pending"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to approve payment",
        variant: "destructive",
      });
    },
  });

  const rejectPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      await apiRequest("PATCH", `/api/payments/${paymentId}/reject`);
    },
    onSuccess: () => {
      toast({
        title: "Payment Rejected",
        description: "Payment has been rejected",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/payments/pending"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to reject payment",
        variant: "destructive",
      });
    },
  });

  // SMTP Test Mutation
  const smtpTestMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/admin/test-smtp`, "POST", { testEmail: smtpTestEmail });
    },
    onSuccess: (data: any) => {
      toast({
        title: data.success ? "SMTP Test Successful" : "SMTP Test Failed",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-logs"] });
    },
    onError: (error) => {
      toast({
        title: "SMTP Test Error",
        description: "Failed to test SMTP configuration",
        variant: "destructive",
      });
    },
  });

  const approveWebsiteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await apiRequest("PATCH", `/api/website-orders/${orderId}/approve`);
    },
    onSuccess: () => {
      toast({
        title: "Website Order Approved",
        description: "Download link has been generated and sent to user",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/website-orders/pending"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to approve website order",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return <div className="min-h-screen bg-game-dark flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const activeTournaments = tournaments.filter((t: any) => t.status === 'published' || t.status === 'live');
  const totalRevenue = pendingPayments.reduce((sum: number, p: any) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navigation />
      
      <section className="py-8 px-4 bg-game-darker">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Shield className="mr-3 h-10 w-10 text-red-500" />
              Admin Dashboard
            </h1>
            <p className="text-gray-300 text-lg">Tournament management and payment verification</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Admin Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-game-blue border-game-purple/20">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Shield className="text-white text-xl h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Admin Panel</h3>
                    <p className="text-gray-300 text-sm capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                  
                  <nav className="space-y-2">
                    <Button className="w-full justify-start bg-gradient-to-r from-game-purple to-game-purple-light text-white">
                      <Shield className="mr-3 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-game-purple hover:text-white">
                      <Trophy className="mr-3 h-4 w-4" />
                      Tournaments
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-game-purple hover:text-white">
                      <CreditCard className="mr-3 h-4 w-4" />
                      Payments
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-game-purple hover:text-white">
                      <Users className="mr-3 h-4 w-4" />
                      Users
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-game-purple hover:text-white">
                      <ShoppingCart className="mr-3 h-4 w-4" />
                      Website Sales
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Admin Content */}
            <div className="lg:col-span-3">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-none">
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-8 w-8 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white" data-testid="text-active-tournaments">{activeTournaments.length}</div>
                    <div className="text-blue-200 text-sm">Active Tournaments</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-600 to-green-700 border-none">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white" data-testid="text-total-users">1,247</div>
                    <div className="text-green-200 text-sm">Registered Users</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-yellow-600 to-yellow-700 border-none">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white" data-testid="text-pending-payments">{pendingPayments.length}</div>
                    <div className="text-yellow-200 text-sm">Pending Payments</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-none">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white" data-testid="text-revenue">৳ {totalRevenue.toLocaleString()}</div>
                    <div className="text-purple-200 text-sm">Pending Revenue</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Enhanced Admin Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-game-darker">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-game-purple data-[state=active]:text-white">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-game-purple data-[state=active]:text-white">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-game-purple data-[state=active]:text-white">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="data-[state=active]:bg-game-purple data-[state=active]:text-white">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payments ({pendingPayments.length})
                  </TabsTrigger>
                  <TabsTrigger value="website-orders" className="data-[state=active]:bg-game-purple data-[state=active]:text-white">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Orders ({websiteOrders.length})
                  </TabsTrigger>
                  <TabsTrigger value="email" className="data-[state=active]:bg-game-purple data-[state=active]:text-white">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Enhanced Stats Cards */}
                    <div className="space-y-4">
                      <AdminStatsCard
                        title="Platform Statistics"
                        stats={adminStats || {
                          totalUsers: 0,
                          totalTournaments: 0,
                          totalPayments: 0,
                          totalRevenue: 0,
                          activeUsers: 0
                        }}
                        isLoading={statsLoading}
                      />
                      
                      <Card className="bg-game-blue border-game-purple/20 glow-effect">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <Activity className="h-5 w-5 mr-2" />
                            Real-time Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Active Users Online</span>
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                                <span className="text-white font-bold">{activeUsers}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Pending Actions</span>
                              <span className="text-yellow-400 font-bold">{pendingPayments.length + websiteOrders.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Live Tournaments</span>
                              <span className="text-green-400 font-bold">{activeTournaments.length}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Admin Notifications Panel */}
                    <AdminNotificationPanel />
                  </div>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>
                      <Select value={selectedAnalyticsPeriod} onValueChange={setSelectedAnalyticsPeriod}>
                        <SelectTrigger className="w-40 bg-game-darker border-game-purple/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-game-darker border-game-purple/20">
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <AdminAnalyticsChart 
                      data={analyticsData} 
                      period={selectedAnalyticsPeriod}
                      className="mb-6"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-game-blue border-game-purple/20">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Conversion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-green-400">12.5%</div>
                          <p className="text-gray-400 text-sm">Visitors to participants</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-game-blue border-game-purple/20">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Average Session</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-blue-400">8.2 min</div>
                          <p className="text-gray-400 text-sm">Time on platform</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-game-blue border-game-purple/20">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Payment Success</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-yellow-400">94.7%</div>
                          <p className="text-gray-400 text-sm">Successful transactions</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="mt-6">
                  <AdminNotificationPanel showDetailed={true} />
                </TabsContent>
                
                <TabsContent value="payments" className="mt-6">
                  <Card className="bg-game-blue border-game-purple/20">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-white">Pending Payment Verifications</CardTitle>
                        <Button 
                          onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/payments/pending"] })}
                          variant="outline"
                          size="sm"
                          className="border-game-purple text-game-purple hover:bg-game-purple hover:text-white"
                          data-testid="button-refresh-payments"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {paymentsLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-16 bg-game-darker rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : pendingPayments.length === 0 ? (
                        <div className="text-center py-8">
                          <CreditCard className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-white mb-2">No Pending Payments</h3>
                          <p className="text-gray-400">All payments have been processed</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-game-purple/20">
                                <th className="text-left text-gray-300 py-3">User</th>
                                <th className="text-left text-gray-300 py-3">Tournament</th>
                                <th className="text-left text-gray-300 py-3">Method</th>
                                <th className="text-left text-gray-300 py-3">Amount</th>
                                <th className="text-left text-gray-300 py-3">TXN ID</th>
                                <th className="text-left text-gray-300 py-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pendingPayments.map((payment: any) => (
                                <tr key={payment.id} className="border-b border-game-purple/10">
                                  <td className="py-3 text-white" data-testid={`text-user-${payment.id}`}>
                                    {payment.userId}
                                  </td>
                                  <td className="py-3 text-gray-300" data-testid={`text-tournament-${payment.id}`}>
                                    {payment.tournamentId || 'Website Purchase'}
                                  </td>
                                  <td className="py-3">
                                    <Badge className={`${
                                      payment.method === 'bkash' 
                                        ? 'bg-pink-600/20 text-pink-400 border-pink-600/30' 
                                        : 'bg-orange-600/20 text-orange-400 border-orange-600/30'
                                    }`}>
                                      {payment.method}
                                    </Badge>
                                  </td>
                                  <td className="py-3 text-green-400 font-medium" data-testid={`text-amount-${payment.id}`}>
                                    ৳ {parseFloat(payment.amount).toLocaleString()}
                                  </td>
                                  <td className="py-3 font-mono text-sm text-white" data-testid={`text-txn-${payment.id}`}>
                                    {payment.txnId}
                                  </td>
                                  <td className="py-3">
                                    <div className="flex space-x-2">
                                      <Button
                                        onClick={() => approvePaymentMutation.mutate(payment.id)}
                                        disabled={approvePaymentMutation.isPending}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        data-testid={`button-approve-${payment.id}`}
                                      >
                                        <Check className="mr-1 h-3 w-3" />
                                        Approve
                                      </Button>
                                      <Button
                                        onClick={() => rejectPaymentMutation.mutate(payment.id)}
                                        disabled={rejectPaymentMutation.isPending}
                                        size="sm"
                                        variant="destructive"
                                        data-testid={`button-reject-${payment.id}`}
                                      >
                                        <X className="mr-1 h-3 w-3" />
                                        Reject
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="website-orders" className="mt-6">
                  <Card className="bg-game-blue border-game-purple/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-white">Website Source Code Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {ordersLoading ? (
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-16 bg-game-darker rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : websiteOrders.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-white mb-2">No Pending Website Orders</h3>
                          <p className="text-gray-400">All website orders have been processed</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {websiteOrders.map((order: any) => (
                            <Card key={order.id} className="bg-game-darker border-game-purple/20">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-lg font-bold text-white" data-testid={`text-order-user-${order.id}`}>
                                      User: {order.userId}
                                    </h3>
                                    <p className="text-gray-300">Website Source Code Purchase</p>
                                    <p className="text-green-400 font-bold text-xl">৳ {parseFloat(order.amount).toLocaleString()}</p>
                                  </div>
                                  <div className="flex flex-col space-y-2">
                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                      Pending Approval
                                    </Badge>
                                    <Button
                                      onClick={() => approveWebsiteOrderMutation.mutate(order.id)}
                                      disabled={approveWebsiteOrderMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                      data-testid={`button-approve-order-${order.id}`}
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      Approve & Generate Download Link
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Email Management Tab */}
                <TabsContent value="email" className="mt-6">
                  <div className="space-y-6">
                    {/* SMTP Testing Section */}
                    <Card className="bg-game-blue border-game-purple/20 glow-effect">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Settings className="h-5 w-5 mr-2" />
                          SMTP Configuration Test
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="smtp-test-email" className="text-gray-300">Test Email Address</Label>
                            <Input
                              id="smtp-test-email"
                              type="email"
                              placeholder="Enter email to test SMTP..."
                              value={smtpTestEmail}
                              onChange={(e) => setSmtpTestEmail(e.target.value)}
                              className="bg-game-darker border-game-purple/20 text-white mt-2"
                            />
                          </div>
                          <Button
                            onClick={() => smtpTestMutation.mutate()}
                            disabled={smtpTestMutation.isPending || !smtpTestEmail}
                            className="bg-gradient-to-r from-game-purple to-game-purple-light hover:from-game-purple-light hover:to-game-purple text-white"
                          >
                            {smtpTestMutation.isPending ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Testing SMTP...
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Test Email
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Email Logs Section */}
                    <Card className="bg-game-blue border-game-purple/20">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-white flex items-center">
                            <Mail className="h-5 w-5 mr-2" />
                            Email Logs & Status
                          </CardTitle>
                          <Button 
                            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/email-logs"] })}
                            variant="outline"
                            size="sm"
                            className="border-game-purple text-game-purple hover:bg-game-purple hover:text-white"
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {emailLogsLoading ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="animate-pulse">
                                <div className="h-16 bg-game-darker rounded"></div>
                              </div>
                            ))}
                          </div>
                        ) : emailLogs.length === 0 ? (
                          <div className="text-center py-8">
                            <Mail className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">No Email Logs</h3>
                            <p className="text-gray-400">Email activity will appear here</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-b border-game-purple/20">
                                  <TableHead className="text-gray-300">Recipient</TableHead>
                                  <TableHead className="text-gray-300">Subject</TableHead>
                                  <TableHead className="text-gray-300">Template</TableHead>
                                  <TableHead className="text-gray-300">Status</TableHead>
                                  <TableHead className="text-gray-300">Sent At</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {emailLogs.slice(0, 20).map((log: any) => (
                                  <TableRow key={log.id} className="border-b border-game-purple/10">
                                    <TableCell className="text-white font-mono text-sm">
                                      {log.recipientEmail}
                                    </TableCell>
                                    <TableCell className="text-gray-300 max-w-64 truncate">
                                      {log.subject}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                      <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                                        {log.template}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge className={`${
                                        log.status === 'sent' 
                                          ? 'bg-green-600/20 text-green-400 border-green-600/30' 
                                          : 'bg-red-600/20 text-red-400 border-red-600/30'
                                      }`}>
                                        {log.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-sm">
                                      {log.sentAt ? new Date(log.sentAt).toLocaleDateString() : 'Failed'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
