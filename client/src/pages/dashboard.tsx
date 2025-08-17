import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/ui/navigation";

import CountdownTimer from "@/components/ui/countdown-timer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Participant, Payment } from "@shared/schema";
import { 
  User, 
  Trophy, 
  Clock, 
  CreditCard, 
  Plus, 
  Check, 
  Unlock, 
  ExternalLink,
  Key
} from "lucide-react";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: userTournaments = [], isLoading: tournamentsLoading } = useQuery<Participant[]>({
    queryKey: ["/api/user/tournaments"],
    retry: false,
  });

  const { data: userPayments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-game-dark flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const activeTournaments = userTournaments.filter((t: any) => 
    t.status === 'approved' || t.status === 'pending_verify'
  );
  
  const completedTournaments = userTournaments.filter((t: any) => 
    t.status === 'completed' || t.status === 'rejected'
  );

  const pendingPayments = userTournaments.filter((t: any) => 
    t.status === 'pending_payment'
  );

  // Check if secret info should be revealed (5 minutes before start)
  const shouldRevealSecrets = (tournament: any) => {
    const startTime = new Date(tournament.startTime);
    const now = new Date();
    const minutesUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60);
    return minutesUntilStart <= 5 && minutesUntilStart > 0;
  };

  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navigation />
      
      <section className="py-8 px-4 bg-game-darker/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dashboard Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-game-blue border-game-purple/20 glow-effect">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-game-purple to-game-purple-light text-white text-2xl">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-white" data-testid="text-username">
                      {user?.name || user?.email?.split('@')[0] || 'Player'}
                    </h3>
                    <p className="text-gray-300" data-testid="text-email">{user?.email}</p>
                    <div className="mt-2">
                      {user?.isAgeVerified ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Check className="mr-1 h-3 w-3" />
                          Age Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          <Clock className="mr-1 h-3 w-3" />
                          Verification Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Tournaments:</span>
                      <span className="text-white font-bold" data-testid="text-total-tournaments">{userTournaments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Active:</span>
                      <span className="text-green-400 font-bold" data-testid="text-active-tournaments">{activeTournaments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Completed:</span>
                      <span className="text-blue-400 font-bold" data-testid="text-completed-tournaments">{completedTournaments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Pending Payment:</span>
                      <span className="text-yellow-400 font-bold" data-testid="text-pending-payments">{pendingPayments.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <Button 
                  onClick={() => window.location.href = '/tournaments'}
                  className="w-full bg-gradient-to-r from-game-purple to-game-purple-light py-3 rounded-lg font-semibold glow-effect"
                  data-testid="button-join-tournament"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Join New Tournament
                </Button>
                <Button 
                  variant="outline"
                  className="w-full bg-game-blue border border-game-purple py-3 rounded-lg font-semibold hover:bg-game-purple transition-colors"
                  data-testid="button-payment-history"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment History
                </Button>
              </div>
            </div>
            
            {/* Main Dashboard Content */}
            <div className="lg:col-span-2">
              <Card className="bg-game-blue border-game-purple/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">My Tournaments</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-game-darker">
                      <TabsTrigger value="active" className="data-[state=active]:bg-game-purple data-[state=active]:text-white">
                        Active ({activeTournaments.length})
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="data-[state=active]:bg-game-purple data-[state=active]:text-white">
                        Completed ({completedTournaments.length})
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="data-[state=active]:bg-game-purple data-[state=active]:text-white">
                        Pending Payment ({pendingPayments.length})
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="active" className="mt-6">
                      <div className="space-y-4">
                        {tournamentsLoading ? (
                          <div className="space-y-4">
                            {[1, 2].map((i) => (
                              <Card key={i} className="bg-game-darker border-game-purple/20 animate-pulse">
                                <CardContent className="p-6">
                                  <div className="h-4 bg-game-blue rounded mb-2"></div>
                                  <div className="h-3 bg-game-blue rounded mb-4"></div>
                                  <div className="h-16 bg-game-blue rounded"></div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : activeTournaments.length === 0 ? (
                          <Card className="bg-game-darker border-game-purple/20">
                            <CardContent className="p-8 text-center">
                              <Trophy className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                              <h3 className="text-lg font-bold text-white mb-2">No Active Tournaments</h3>
                              <p className="text-gray-400 mb-4">Join a tournament to see it here!</p>
                              <Button 
                                onClick={() => window.location.href = '/tournaments'}
                                className="bg-game-purple hover:bg-game-purple-light"
                                data-testid="button-browse-tournaments"
                              >
                                Browse Tournaments
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          activeTournaments.map((tournament: any) => (
                            <Card key={tournament.id} className={`border ${
                              shouldRevealSecrets(tournament) 
                                ? 'bg-gradient-to-r from-green-900/20 to-game-blue border-green-500/30' 
                                : 'bg-game-darker border-game-purple/20'
                            }`}>
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-xl font-bold text-white" data-testid={`text-tournament-name-${tournament.id}`}>
                                      {tournament.name || 'Tournament'}
                                    </h3>
                                    <p className="text-gray-300">
                                      {tournament.gameMode} Tournament • Starting soon
                                    </p>
                                  </div>
                                  <Badge className={`${
                                    shouldRevealSecrets(tournament)
                                      ? 'bg-green-500 text-white live-indicator'
                                      : tournament.status === 'approved'
                                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                  }`}>
                                    {shouldRevealSecrets(tournament) ? (
                                      <>
                                        <Unlock className="mr-1 h-3 w-3" />
                                        INFO UNLOCKED
                                      </>
                                    ) : tournament.status === 'approved' ? (
                                      <>
                                        <Check className="mr-1 h-3 w-3" />
                                        APPROVED
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="mr-1 h-3 w-3" />
                                        PENDING
                                      </>
                                    )}
                                  </Badge>
                                </div>
                                
                                {/* Countdown Timer */}
                                <div className="mb-4">
                                  <CountdownTimer 
                                    targetDate={tournament.startTime} 
                                    onComplete={() => {
                                      toast({
                                        title: "Tournament Started!",
                                        description: `${tournament.name} has begun. Join now!`,
                                      });
                                    }}
                                  />
                                </div>
                                
                                {/* Secret Match Info (Revealed at T-5 minutes) */}
                                {shouldRevealSecrets(tournament) && tournament.roomId && (
                                  <Card className="bg-green-900/30 border border-green-500/50 mb-4">
                                    <CardContent className="p-4">
                                      <h4 className="text-green-400 font-bold mb-2 flex items-center">
                                        <Key className="mr-2 h-4 w-4" />
                                        Secret Match Information
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        {tournament.roomId && (
                                          <div>
                                            <span className="text-gray-400">Room ID:</span>
                                            <div className="font-mono text-white bg-black/30 px-2 py-1 rounded mt-1" data-testid={`text-room-id-${tournament.id}`}>
                                              {tournament.roomId}
                                            </div>
                                          </div>
                                        )}
                                        {tournament.roomPassword && (
                                          <div>
                                            <span className="text-gray-400">Password:</span>
                                            <div className="font-mono text-white bg-black/30 px-2 py-1 rounded mt-1" data-testid={`text-room-password-${tournament.id}`}>
                                              {tournament.roomPassword}
                                            </div>
                                          </div>
                                        )}
                                        {tournament.partyCode && (
                                          <div>
                                            <span className="text-gray-400">Party Code:</span>
                                            <div className="font-mono text-white bg-black/30 px-2 py-1 rounded mt-1" data-testid={`text-party-code-${tournament.id}`}>
                                              {tournament.partyCode}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                                
                                {!shouldRevealSecrets(tournament) && (
                                  <Card className="bg-game-blue/50 mb-4">
                                    <CardContent className="p-3 text-center">
                                      <div className="text-sm text-gray-400 mb-2">
                                        Match info will be revealed 5 minutes before start
                                      </div>
                                      <div className="bg-game-blue/50 rounded-lg p-3">
                                        <Key className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                                        <div className="text-gray-500">Secret information locked</div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                                
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">
                                    <span className="text-gray-400">Status:</span>
                                    <span className={`font-medium ml-1 ${
                                      tournament.status === 'approved' ? 'text-green-400' :
                                      tournament.status === 'pending_verify' ? 'text-yellow-400' :
                                      'text-red-400'
                                    }`} data-testid={`text-status-${tournament.id}`}>
                                      {tournament.status === 'approved' ? 'Payment Approved' :
                                       tournament.status === 'pending_verify' ? 'Payment Pending Verification' :
                                       'Payment Rejected'}
                                    </span>
                                  </div>
                                  {tournament.status === 'approved' && shouldRevealSecrets(tournament) && (
                                    <Button 
                                      className="bg-green-600 hover:bg-green-700 transition-colors"
                                      data-testid={`button-join-game-${tournament.id}`}
                                    >
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      Join Game
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="completed" className="mt-6">
                      <div className="space-y-4">
                        {completedTournaments.length === 0 ? (
                          <Card className="bg-game-darker border-game-purple/20">
                            <CardContent className="p-8 text-center">
                              <Trophy className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                              <h3 className="text-lg font-bold text-white mb-2">No Completed Tournaments</h3>
                              <p className="text-gray-400">Your tournament history will appear here</p>
                            </CardContent>
                          </Card>
                        ) : (
                          completedTournaments.map((tournament: any) => (
                            <Card key={tournament.id} className="bg-game-darker border-game-purple/20">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="text-lg font-bold text-white">{tournament.name}</h3>
                                    <p className="text-gray-400">{tournament.gameMode} Tournament</p>
                                  </div>
                                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                    Completed
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="pending" className="mt-6">
                      <div className="space-y-4">
                        {pendingPayments.length === 0 ? (
                          <Card className="bg-game-darker border-game-purple/20">
                            <CardContent className="p-8 text-center">
                              <CreditCard className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                              <h3 className="text-lg font-bold text-white mb-2">No Pending Payments</h3>
                              <p className="text-gray-400">All your payments are up to date</p>
                            </CardContent>
                          </Card>
                        ) : (
                          pendingPayments.map((tournament: any) => (
                            <Card key={tournament.id} className="bg-game-darker border-game-purple/20">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-lg font-bold text-white">{tournament.name}</h3>
                                    <p className="text-gray-400">{tournament.gameMode} Tournament</p>
                                  </div>
                                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                    Payment Required
                                  </Badge>
                                </div>
                                <Button 
                                  className="bg-yellow-600 hover:bg-yellow-700 transition-colors"
                                  data-testid={`button-complete-payment-${tournament.id}`}
                                >
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Complete Payment
                                </Button>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
