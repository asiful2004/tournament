import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Wallet, 
  TriangleAlert, 
  Info, 
  ChevronRight,
  CreditCard
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentName: string;
  tournamentId?: string;
  amount: number;
  isWebsitePurchase?: boolean;
}

type PaymentMethod = 'bkash' | 'nagad' | null;

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  tournamentName, 
  tournamentId,
  amount, 
  isWebsitePurchase = false 
}: PaymentModalProps) {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [payerNumber, setPayerNumber] = useState('');
  const [txnId, setTxnId] = useState('');

  const submitPaymentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMethod || !payerNumber || !txnId) {
        throw new Error("Please fill in all payment details");
      }

      const paymentData = {
        method: selectedMethod,
        payerNumber,
        txnId,
        amount,
        ...(isWebsitePurchase ? { websiteOrderId: 'website' } : { tournamentId }),
      };

      await apiRequest("POST", "/api/payments", paymentData);
    },
    onSuccess: () => {
      toast({
        title: "Payment Submitted",
        description: "Your payment is being verified by admin. You'll receive an email confirmation.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      onClose();
      // Reset form
      setSelectedMethod(null);
      setPayerNumber('');
      setTxnId('');
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
        title: "Payment Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleSubmit = () => {
    if (!selectedMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    if (!payerNumber || !txnId) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number and transaction ID",
        variant: "destructive",
      });
      return;
    }

    submitPaymentMutation.mutate();
  };

  const paymentNumber = "01926298571";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-game-blue border-game-purple/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Submit Payment
          </DialogTitle>
          <div className="text-center">
            <p className="text-gray-300">
              {isWebsitePurchase ? 'Website Source Code' : `Tournament: ${tournamentName}`}
            </p>
            <p className="text-yellow-400 font-bold text-xl">
              Amount: ৳ {amount.toLocaleString()}
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Payment Methods */}
          {!selectedMethod ? (
            <div className="space-y-4">
              <h4 className="text-white font-medium">Choose Payment Method:</h4>
              
              {/* bKash */}
              <Card 
                className="payment-method border-2 border-transparent hover:border-game-purple transition-all cursor-pointer"
                onClick={() => handleMethodSelect('bkash')}
                data-testid="payment-method-bkash"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="text-white h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">bKash</div>
                      <div className="text-gray-300 text-sm">{paymentNumber}</div>
                    </div>
                    <ChevronRight className="text-gray-400 h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Nagad */}
              <Card 
                className="payment-method border-2 border-transparent hover:border-game-purple transition-all cursor-pointer"
                onClick={() => handleMethodSelect('nagad')}
                data-testid="payment-method-nagad"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Wallet className="text-white h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Nagad</div>
                      <div className="text-gray-300 text-sm">{paymentNumber}</div>
                    </div>
                    <ChevronRight className="text-gray-400 h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected Method Display */}
              <div className="flex items-center space-x-3 p-4 bg-game-darker rounded-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedMethod === 'bkash' ? 'bg-pink-600' : 'bg-orange-600'
                }`}>
                  {selectedMethod === 'bkash' ? 
                    <Smartphone className="text-white h-5 w-5" /> : 
                    <Wallet className="text-white h-5 w-5" />
                  }
                </div>
                <div>
                  <div className="text-white font-medium capitalize">{selectedMethod}</div>
                  <div className="text-gray-300 text-sm">{paymentNumber}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedMethod(null)}
                  className="ml-auto text-game-purple hover:text-white"
                >
                  Change
                </Button>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payerNumber" className="text-gray-300">Your Phone Number</Label>
                  <Input
                    id="payerNumber"
                    type="tel"
                    value={payerNumber}
                    onChange={(e) => setPayerNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="bg-game-darker border-game-purple/30 text-white placeholder-gray-400 focus:border-game-purple"
                    data-testid="input-payer-number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="txnId" className="text-gray-300">Transaction ID</Label>
                  <Input
                    id="txnId"
                    type="text"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="TXN123456789"
                    className="bg-game-darker border-game-purple/30 text-white placeholder-gray-400 focus:border-game-purple"
                    data-testid="input-transaction-id"
                  />
                </div>
              </div>

              {/* Payment Instructions */}
              <Card className="bg-yellow-900/20 border border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="text-yellow-400 font-medium mb-2 flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    Payment Instructions:
                  </div>
                  <ol className="text-yellow-300 text-sm space-y-1 list-decimal list-inside">
                    <li>Send ৳ {amount.toLocaleString()} to <span className="font-mono">{paymentNumber}</span></li>
                    <li>Save the transaction ID</li>
                    <li>Enter your details above</li>
                    <li>Wait for admin approval</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          )}

          {/* No Refund Notice */}
          <Card className="bg-red-900/20 border border-red-500/30">
            <CardContent className="p-3">
              <div className="text-red-400 text-sm text-center flex items-center justify-center">
                <TriangleAlert className="mr-2 h-4 w-4" />
                <span>
                  <strong>NO REFUNDS:</strong> All payments are final. Age 15+ required.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              data-testid="button-cancel-payment"
            >
              Cancel
            </Button>
            {selectedMethod && (
              <Button 
                onClick={handleSubmit}
                disabled={submitPaymentMutation.isPending || !payerNumber || !txnId}
                className="flex-1 bg-gradient-to-r from-game-purple to-game-purple-light hover:scale-105 transition-transform disabled:opacity-50"
                data-testid="button-submit-payment"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {submitPaymentMutation.isPending ? "Submitting..." : "Submit Payment"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
