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
import { IdCard, TriangleAlert, Calendar } from "lucide-react";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified?: () => void;
}

export default function AgeVerificationModal({ isOpen, onClose, onVerified }: AgeVerificationModalProps) {
  const { toast } = useToast();
  const [dateOfBirth, setDateOfBirth] = useState('');

  const verifyAgeMutation = useMutation({
    mutationFn: async () => {
      if (!dateOfBirth) {
        throw new Error("Please enter your date of birth");
      }

      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 15) {
        throw new Error("You must be 15 years or older to participate in tournaments");
      }

      await apiRequest("POST", "/api/auth/verify-age", { dateOfBirth });
    },
    onSuccess: () => {
      toast({
        title: "Age Verified",
        description: "Your age has been verified successfully! You can now join tournaments.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
      if (onVerified) {
        onVerified();
      }
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
        title: "Age Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVerify = () => {
    if (!dateOfBirth) {
      toast({
        title: "Date Required",
        description: "Please enter your date of birth",
        variant: "destructive",
      });
      return;
    }

    verifyAgeMutation.mutate();
  };

  // Calculate max date (today - 15 years) for the input
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate())
    .toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-game-blue border-game-purple/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center flex items-center justify-center">
            <IdCard className="mr-3 h-8 w-8 text-game-purple" />
            Age Verification Required
          </DialogTitle>
          <p className="text-gray-300 text-center">
            You must be 15+ years old to participate in tournaments
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Date of Birth Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="dateOfBirth" className="text-gray-300 flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={maxDate}
                className="bg-game-darker border-game-purple/30 text-white focus:border-game-purple"
                data-testid="input-date-of-birth"
              />
              <p className="text-xs text-gray-400 mt-1">
                You must be at least 15 years old
              </p>
            </div>
          </div>

          {/* Age Restriction Warning */}
          <Card className="bg-red-900/20 border border-red-500/30">
            <CardContent className="p-4">
              <div className="text-red-400 text-sm flex items-start">
                <TriangleAlert className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold mb-1">Age Restriction:</div>
                  <div>
                    Only users aged 15 and above can register for tournaments. 
                    False information will result in account suspension.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Notice */}
          <Card className="bg-blue-900/20 border border-blue-500/30">
            <CardContent className="p-4">
              <div className="text-blue-300 text-sm">
                <div className="font-medium mb-1">Why we need this:</div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Tournament participation requires minimum age of 15</li>
                  <li>Compliance with gaming and payment regulations</li>
                  <li>Ensuring responsible gaming practices</li>
                  <li>Your date of birth is stored securely and privately</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              data-testid="button-cancel-verification"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleVerify}
              disabled={verifyAgeMutation.isPending || !dateOfBirth}
              className="flex-1 bg-gradient-to-r from-game-purple to-game-purple-light hover:scale-105 transition-transform disabled:opacity-50"
              data-testid="button-verify-age"
            >
              <IdCard className="mr-2 h-4 w-4" />
              {verifyAgeMutation.isPending ? "Verifying..." : "Verify & Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
