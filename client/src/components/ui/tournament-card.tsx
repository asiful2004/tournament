import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import CountdownTimer from "./countdown-timer";
import PaymentModal from "./payment-modal";
import AgeVerificationModal from "./age-verification-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Gamepad2, 
  Crown, 
  Clock, 
  Target,
  Flame,
  Zap
} from "lucide-react";

interface Tournament {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  game: string;
  gameMode: 'solo' | 'squad';
  startTime: string;
  entryFee: string;
  prize1?: string;
  prize2?: string;
  prize3?: string;
  maxParticipants?: number;
  status: 'draft' | 'published' | 'live' | 'finished' | 'cancelled';
}

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  const joinTournamentMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/tournaments/${tournament.id}/join`);
    },
    onSuccess: () => {
      toast({
        title: "Tournament Joined!",
        description: "Please complete your payment to secure your spot",
      });
      setShowPaymentModal(true);
      queryClient.invalidateQueries({ queryKey: ["/api/user/tournaments"] });
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
      
      const errorMessage = error.message;
      if (errorMessage.includes("Age verification required")) {
        setShowAgeVerification(true);
        return;
      }
      
      toast({
        title: "Failed to Join Tournament",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleJoinTournament = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to join tournaments",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }

    if (!user?.isAgeVerified) {
      setShowAgeVerification(true);
      return;
    }

    joinTournamentMutation.mutate();
  };

  const getStatusBadge = () => {
    switch (tournament.status) {
      case 'live':
        return (
          <Badge className="bg-green-500 text-white live-indicator">
            <Zap className="mr-1 h-3 w-3" />
            LIVE
          </Badge>
        );
      case 'published':
        return (
          <Badge className="bg-blue-500 text-white">
            <Clock className="mr-1 h-3 w-3" />
            UPCOMING
          </Badge>
        );
      case 'finished':
        return (
          <Badge className="bg-gray-500 text-white">
            <Trophy className="mr-1 h-3 w-3" />
            FINISHED
          </Badge>
        );
      default:
        return null;
    }
  };

  const getGameModeIcon = () => {
    return tournament.gameMode === 'solo' ? <Target className="h-4 w-4" /> : <Users className="h-4 w-4" />;
  };

  const getTournamentTypeIcon = () => {
    if (parseFloat(tournament.entryFee) >= 100) {
      return <Crown className="h-4 w-4 text-yellow-400" />;
    }
    return <Flame className="h-4 w-4 text-game-purple" />;
  };

  const isPremium = parseFloat(tournament.entryFee) >= 100;
  const totalPrize = (parseFloat(tournament.prize1 || '0') + 
                     parseFloat(tournament.prize2 || '0') + 
                     parseFloat(tournament.prize3 || '0')).toLocaleString();

  return (
    <>
      <Card className="tournament-card rounded-xl glow-effect hover:scale-105 transition-transform relative">
        <CardContent className="p-6">
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {getStatusBadge()}
          </div>

          {/* Tournament Logo/Banner */}
          <div className="w-full h-48 bg-game-blue rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            {tournament.logoUrl || tournament.bannerUrl ? (
              <img 
                src={tournament.logoUrl || tournament.bannerUrl} 
                alt={tournament.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                {getTournamentTypeIcon()}
                <div className="mt-2 text-game-purple font-bold">
                  {tournament.game || 'Free Flame'}
                </div>
              </div>
            )}
          </div>

          {/* Tournament Info */}
          <h3 className="text-xl font-bold text-white mb-2" data-testid={`tournament-name-${tournament.id}`}>
            {tournament.name}
          </h3>
          <p className="text-gray-300 mb-4 text-sm" data-testid={`tournament-description-${tournament.id}`}>
            {tournament.description || 'Epic tournament with amazing prizes'}
          </p>

          {/* Tournament Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center">
                {getGameModeIcon()}
                <span className="ml-1">Mode:</span>
              </span>
              <span className="text-game-purple font-medium capitalize" data-testid={`tournament-mode-${tournament.id}`}>
                {tournament.gameMode} {tournament.gameMode === 'squad' ? '(4v4)' : ''}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center">
                <DollarSign className="h-4 w-4" />
                <span className="ml-1">Entry Fee:</span>
              </span>
              <span className="text-green-400 font-bold" data-testid={`tournament-fee-${tournament.id}`}>
                ৳ {parseFloat(tournament.entryFee).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center">
                <Trophy className="h-4 w-4" />
                <span className="ml-1">Prize Pool:</span>
              </span>
              <span className="text-yellow-400 font-bold" data-testid={`tournament-prize-${tournament.id}`}>
                ৳ {totalPrize}
              </span>
            </div>
            {tournament.maxParticipants && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center">
                  <Users className="h-4 w-4" />
                  <span className="ml-1">Participants:</span>
                </span>
                <span className="text-white" data-testid={`tournament-participants-${tournament.id}`}>
                  0/{tournament.maxParticipants}
                </span>
              </div>
            )}
          </div>

          {/* Countdown Timer */}
          <div className="mb-4">
            <CountdownTimer 
              targetDate={tournament.startTime}
              onComplete={() => {
                toast({
                  title: "Tournament Started!",
                  description: `${tournament.name} has begun!`,
                });
              }}
            />
          </div>

          {/* Premium Badge */}
          {isPremium && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-yellow-500 text-black">
                <Crown className="mr-1 h-3 w-3" />
                PREMIUM
              </Badge>
            </div>
          )}

          {/* Join Button */}
          <Button 
            onClick={handleJoinTournament}
            disabled={joinTournamentMutation.isPending || tournament.status !== 'published'}
            className="w-full bg-gradient-to-r from-game-purple to-game-purple-light py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid={`button-join-${tournament.id}`}
          >
            <Gamepad2 className="mr-2 h-4 w-4" />
            {joinTournamentMutation.isPending 
              ? "Joining..." 
              : tournament.status === 'live' 
              ? "Live Now" 
              : tournament.status === 'finished'
              ? "Tournament Ended"
              : "Join Tournament"
            }
          </Button>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          tournamentName={tournament.name}
          tournamentId={tournament.id}
          amount={parseFloat(tournament.entryFee)}
        />
      )}

      {/* Age Verification Modal */}
      {showAgeVerification && (
        <AgeVerificationModal
          isOpen={showAgeVerification}
          onClose={() => setShowAgeVerification(false)}
          onVerified={() => {
            setShowAgeVerification(false);
            joinTournamentMutation.mutate();
          }}
        />
      )}
    </>
  );
}
