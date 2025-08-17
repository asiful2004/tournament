import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string | Date;
  onComplete?: () => void;
  showSecretInfo?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function CountdownTimer({ targetDate, onComplete, showSecretInfo = false }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeRemaining = (): TimeRemaining => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      };
    };

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    // Set up interval
    const interval = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining();
      setTimeRemaining(newTimeRemaining);

      // Call onComplete when timer expires
      if (newTimeRemaining.isExpired && onComplete) {
        onComplete();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  // Check if we're within 5 minutes of start (for secret info reveal)
  const isNearStart = !timeRemaining.isExpired && 
    timeRemaining.days === 0 && 
    timeRemaining.hours === 0 && 
    timeRemaining.minutes <= 5;

  return (
    <Card className={`bg-game-darker border ${
      timeRemaining.isExpired 
        ? 'border-red-500/50' 
        : isNearStart 
        ? 'border-green-500/50' 
        : 'border-game-purple/20'
    }`}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className={`mr-2 h-4 w-4 ${
              timeRemaining.isExpired 
                ? 'text-red-400' 
                : isNearStart 
                ? 'text-green-400' 
                : 'text-gray-400'
            }`} />
            <span className={`text-sm ${
              timeRemaining.isExpired 
                ? 'text-red-400' 
                : isNearStart 
                ? 'text-green-400' 
                : 'text-gray-400'
            }`}>
              {timeRemaining.isExpired 
                ? 'Tournament Started!' 
                : isNearStart 
                ? 'Starting Very Soon!' 
                : 'Starts in:'
              }
            </span>
          </div>
          
          {!timeRemaining.isExpired ? (
            <div className="flex justify-center space-x-2 text-2xl font-bold">
              {timeRemaining.days > 0 && (
                <div className="bg-game-blue px-3 py-2 rounded-lg">
                  <span className="countdown-digit" data-testid="countdown-days">{timeRemaining.days}</span>
                  <div className="text-xs text-gray-400">DAY{timeRemaining.days !== 1 ? 'S' : ''}</div>
                </div>
              )}
              <div className="bg-game-blue px-3 py-2 rounded-lg">
                <span className="countdown-digit" data-testid="countdown-hours">
                  {timeRemaining.hours.toString().padStart(2, '0')}
                </span>
                <div className="text-xs text-gray-400">HRS</div>
              </div>
              <div className="bg-game-blue px-3 py-2 rounded-lg">
                <span className="countdown-digit" data-testid="countdown-minutes">
                  {timeRemaining.minutes.toString().padStart(2, '0')}
                </span>
                <div className="text-xs text-gray-400">MIN</div>
              </div>
              <div className="bg-game-blue px-3 py-2 rounded-lg">
                <span className="countdown-digit" data-testid="countdown-seconds">
                  {timeRemaining.seconds.toString().padStart(2, '0')}
                </span>
                <div className="text-xs text-gray-400">SEC</div>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-red-400" data-testid="tournament-started">
              🔥 LIVE NOW! 🔥
            </div>
          )}

          {/* Secret info availability indicator */}
          {isNearStart && !timeRemaining.isExpired && (
            <div className="mt-3 text-green-400 text-sm font-medium animate-pulse" data-testid="secret-info-ready">
              🔓 Secret match info available!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
