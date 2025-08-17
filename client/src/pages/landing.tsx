import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { Trophy, Flame, Crown, Clock, TriangleAlert } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Gaming battle scene" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Epic </span>
            <span className="text-game-purple">Free Fire</span>
            <span className="text-white"> Tournaments</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join competitive Free Fire tournaments, compete with skilled players, and win amazing cash prizes. 
            <span className="text-game-purple font-semibold"> Age 15+ required.</span>
          </p>
          
          {/* Trust Building Section */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Why Join SkillsMoney Tournaments?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg">✓ Secure</div>
                <div className="text-gray-300">Your payments and data are 100% safe</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg">✓ Fair</div>
                <div className="text-gray-300">Equal opportunity gaming for all players</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg">✓ Trusted</div>
                <div className="text-gray-300">Join thousands of satisfied gamers</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => setLocation('/login')}
              className="bg-gradient-to-r from-game-purple to-game-purple-light px-8 py-4 rounded-xl font-semibold text-lg glow-effect hover:scale-105 transition-transform"
              data-testid="button-join-tournament"
            >
              <Trophy className="mr-2 h-5 w-5" />
              Join Tournament Now
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-game-purple text-game-purple px-8 py-4 rounded-xl font-semibold text-lg hover:bg-game-purple hover:text-white transition-colors"
              data-testid="button-watch-demo"
            >
              <Flame className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Age Restriction Notice */}
          <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg max-w-md mx-auto">
            <TriangleAlert className="inline mr-2 h-5 w-5 text-red-400" />
            <span className="text-red-300 font-medium">Minimum age 15+ required to participate</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-game-darker/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-300 text-lg">The ultimate tournament experience awaits</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-game-purple mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Competitive Tournaments</h3>
                <p className="text-gray-300">Join tournaments with skilled players and win real cash prizes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-game-purple mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Real-time Updates</h3>
                <p className="text-gray-300">Get live countdown timers and instant match information</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Crown className="h-12 w-12 text-game-purple mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Secure Payments</h3>
                <p className="text-gray-300">Safe and verified payment processing via bKash and Nagad</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-game-purple/20 to-game-pink/20 rounded-2xl p-8 border border-game-purple/30 glow-effect">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Compete?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of players in epic Free Fire tournaments
            </p>
            <Button 
              onClick={() => setLocation('/register')}
              className="bg-gradient-to-r from-game-purple to-game-purple-light px-8 py-4 rounded-xl font-bold text-lg glow-effect hover:scale-105 transition-transform"
              data-testid="button-get-started"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      
      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Winner Showcase</h2>
            <p className="text-gray-300 text-lg">See what our champions have to say</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-6">
                <div className="text-yellow-400 text-lg mb-2">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-300 mb-4">"Won ৳5,000 in my first tournament! Fast payout, no hassles."</p>
                <div className="text-purple-400 font-semibold">- Champion Player</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-6">
                <div className="text-yellow-400 text-lg mb-2">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-300 mb-4">"Safe platform, fair gameplay. Highly recommended!"</p>
                <div className="text-purple-400 font-semibold">- Pro Gamer</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-6">
                <div className="text-yellow-400 text-lg mb-2">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-300 mb-4">"Best tournament platform in Bangladesh. Amazing experience!"</p>
                <div className="text-purple-400 font-semibold">- Elite Player</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
