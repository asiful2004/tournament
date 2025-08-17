import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import TournamentCard from "@/components/ui/tournament-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Clock, DollarSign } from "lucide-react";
import type { Tournament, Participant } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  
  const { data: tournaments = [], isLoading: tournamentsLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: userTournaments = [], isLoading: userTournamentsLoading } = useQuery<Participant[]>({
    queryKey: ["/api/user/tournaments"],
  });

  const activeTournaments = tournaments.filter(t => t.status === 'published' || t.status === 'live');
  const liveCount = tournaments.filter(t => t.status === 'live').length;

  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome back, <span className="text-game-purple">{user?.firstName || 'Gamer'}</span>!
            </h1>
            <p className="text-xl text-gray-300">Ready for your next epic battle?</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
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
                <div className="text-2xl font-bold text-white" data-testid="text-live-tournaments">{liveCount}</div>
                <div className="text-green-200 text-sm">Live Now</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-none">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white" data-testid="text-user-tournaments">{userTournaments.length}</div>
                <div className="text-purple-200 text-sm">Your Tournaments</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-600 to-yellow-700 border-none">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white" data-testid="text-total-prizes">৳ {tournaments.reduce((sum: number, t) => sum + parseFloat(String(t.prize1) || '0'), 0).toLocaleString()}</div>
                <div className="text-yellow-200 text-sm">Total Prizes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Tournaments */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Live Tournaments</h2>
            <a href="/tournaments" className="text-game-purple hover:text-game-purple-light font-medium" data-testid="link-view-all">
              View All →
            </a>
          </div>
          
          {tournamentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="tournament-card animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-48 bg-game-blue rounded-lg mb-4"></div>
                    <div className="h-4 bg-game-blue rounded mb-2"></div>
                    <div className="h-3 bg-game-blue rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-game-blue rounded"></div>
                      <div className="h-3 bg-game-blue rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : activeTournaments.length === 0 ? (
            <Card className="tournament-card">
              <CardContent className="p-12 text-center">
                <Trophy className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Active Tournaments</h3>
                <p className="text-gray-400">Check back soon for new tournaments!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTournaments.slice(0, 6).map((tournament: any) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
