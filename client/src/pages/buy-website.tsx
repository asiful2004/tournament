import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import PaymentModal from "@/components/ui/payment-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Star, 
  Bolt, 
  Check, 
  ShoppingCart, 
  TriangleAlert,
  Smartphone,
  Wallet
} from "lucide-react";

export default function BuyWebsite() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }
      await apiRequest("POST", "/api/website-orders");
    },
    onSuccess: () => {
      toast({
        title: "Order Created",
        description: "Please complete the payment to receive your download link",
      });
      setShowPaymentModal(true);
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
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to purchase the website source code",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
    
    createOrderMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-game-purple/20 to-game-pink/20 border border-game-purple/30 glow-effect">
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
                <Code className="mr-3 h-10 w-10 text-game-purple" />
                Buy This Website Source Code
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Get the complete React + Express.js source code of this tournament platform. 
                Perfect for developers and entrepreneurs.
              </p>
              
              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-game-blue/50 border-game-purple/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Star className="mr-2 h-5 w-5 text-yellow-400" />
                      What's Included
                    </h3>
                    <ul className="text-left text-gray-300 space-y-2">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Complete React + TypeScript frontend
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Express.js backend with PostgreSQL
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Admin panel with full features
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Email automation system
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Payment integration (bKash/Nagad)
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Responsive dark theme UI
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-game-blue/50 border-game-purple/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Bolt className="mr-2 h-5 w-5 text-blue-400" />
                      Technical Details
                    </h3>
                    <ul className="text-left text-gray-300 space-y-2">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Modern React architecture
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        TypeScript for type safety
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Tailwind CSS + Shadcn UI
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Replit Auth integration
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        SEO optimized with meta tags
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Setup documentation included
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Pricing */}
              <Card className="bg-gradient-to-r from-game-purple to-game-purple-light border-none mb-8">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-bold text-white mb-2" data-testid="text-price">৳ 15,000</div>
                  <div className="text-xl text-purple-200">One-time purchase • No refunds</div>
                </CardContent>
              </Card>
              
              {/* Payment Methods for Website Purchase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Card className="payment-method border-2 border-transparent hover:border-game-purple transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
                        <Smartphone className="text-white h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-medium">bKash Payment</div>
                        <div className="text-gray-300 text-sm">Send to: 01926298571</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="payment-method border-2 border-transparent hover:border-game-purple transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                        <Wallet className="text-white h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-medium">Nagad Payment</div>
                        <div className="text-gray-300 text-sm">Send to: 01926298571</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* No Refund Warning */}
              <Card className="bg-red-900/30 border border-red-500/50 mb-8">
                <CardContent className="p-4">
                  <div className="text-red-400 font-bold text-lg mb-2 flex items-center justify-center">
                    <TriangleAlert className="mr-2 h-5 w-5" />
                    Important Notice
                  </div>
                  <p className="text-red-300 text-center">
                    <strong>NO REFUNDS:</strong> All website purchases are final. 
                    You will receive a one-time download link after payment verification by admin.
                    The download link expires after 7 days.
                  </p>
                </CardContent>
              </Card>
              
              <Button 
                onClick={handlePurchase}
                disabled={createOrderMutation.isPending}
                className="bg-gradient-to-r from-game-purple to-game-purple-light px-8 py-4 rounded-xl font-bold text-lg glow-effect hover:scale-105 transition-transform"
                data-testid="button-purchase-website"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {createOrderMutation.isPending ? "Processing..." : "Purchase Source Code Now"}
              </Button>

              <div className="mt-4 text-sm text-gray-400">
                {!isAuthenticated && "You will be redirected to login before purchase"}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          tournamentName="Website Source Code"
          amount={15000}
          isWebsitePurchase={true}
        />
      )}

      <Footer />
    </div>
  );
}
