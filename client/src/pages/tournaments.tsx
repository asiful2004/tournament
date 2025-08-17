import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import TournamentCard from "@/components/ui/tournament-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Filter } from "lucide-react";
import type { Tournament } from "@shared/schema";

export default function Tournaments() {
  const [filter, setFilter] = useState<string>("all");
  
  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const filteredTournaments = tournaments.filter((tournament) => {
    if (filter === "all") return true;
    if (filter === "solo") return tournament.gameMode === "solo";
    if (filter === "squad") return tournament.gameMode === "squad";
    if (filter === "starting-soon") {
      const startTime = new Date(tournament.startTime);
      const now = new Date();
      const hoursDiff = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 0 && hoursDiff <= 24;
    }
    return true;
  });

  const filters = [
    { key: "all", label: "All" },
    { key: "solo", label: "Solo" },
    { key: "squad", label: "Squad" },
    { key: "starting-soon", label: "Starting Soon" },
  ];

  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              <Trophy className="inline mr-3 h-10 w-10 text-game-purple" />
              Live Tournaments
            </h1>
            <p className="text-gray-300 text-lg">Join ongoing tournaments or register for upcoming battles</p>
          </div>
          
          {/* Tournament Filters */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {filters.map((filterOption) => (
              <Button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                variant={filter === filterOption.key ? "default" : "outline"}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  filter === filterOption.key
                    ? "bg-gradient-to-r from-game-purple to-game-purple-light text-white"
                    : "bg-game-blue hover:bg-game-purple border-game-purple text-game-purple hover:text-white"
                }`}
                data-testid={`button-filter-${filterOption.key}`}
              >
                {filterOption.label}
              </Button>
            ))}
          </div>
          
          {/* Tournament Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="tournament-card animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-48 bg-game-blue rounded-lg mb-4"></div>
                    <div className="h-4 bg-game-blue rounded mb-2"></div>
                    <div className="h-3 bg-game-blue rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-game-blue rounded"></div>
                      <div className="h-3 bg-game-blue rounded"></div>
                      <div className="h-3 bg-game-blue rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTournaments.length === 0 ? (
            <Card className="tournament-card">
              <CardContent className="p-12 text-center">
                <Filter className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Tournaments Found</h3>
                <p className="text-gray-400">
                  {filter === "all" 
                    ? "No tournaments available at the moment. Check back soon!"
                    : `No tournaments found for the "${filters.find(f => f.key === filter)?.label}" filter.`
                  }
                </p>
                {filter !== "all" && (
                  <Button 
                    onClick={() => setFilter("all")}
                    className="mt-4 bg-game-purple hover:bg-game-purple-light"
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament: any) => (
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
