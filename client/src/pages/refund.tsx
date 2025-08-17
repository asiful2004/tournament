import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TriangleAlert, X, CreditCard, AlertCircle, Clock } from "lucide-react";

export default function Refund() {
  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <X className="mr-3 h-10 w-10 text-red-500" />
              Refund Policy
            </h1>
            <p className="text-gray-300 text-lg">
              Important information about our no-refund policy
            </p>
          </div>

          {/* Main No Refund Notice */}
          <Card className="bg-red-900/30 border-2 border-red-500/50 mb-8">
            <CardContent className="p-8 text-center">
              <X className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-red-300 mb-4">NO REFUNDS</h2>
              <p className="text-red-200 text-xl font-semibold">
                ALL PAYMENTS ARE FINAL AND NON-REFUNDABLE
              </p>
              <p className="text-red-300 mt-4">
                This policy applies to all tournament entry fees, website purchases, 
                and any other transactions made on this platform.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-game-purple" />
                  1. Tournament Entry Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300 font-bold flex items-center">
                    <TriangleAlert className="mr-2 h-5 w-5" />
                    Tournament fees are non-refundable under any circumstances
                  </p>
                </div>
                <p>This includes situations such as:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unable to participate due to personal reasons</li>
                  <li>Technical issues on the player's end</li>
                  <li>Internet connectivity problems</li>
                  <li>Device malfunctions or software issues</li>
                  <li>Last-minute schedule changes</li>
                  <li>Tournament postponement or cancellation</li>
                  <li>Disqualification due to rule violations</li>
                  <li>Change of mind after payment</li>
                </ul>
                
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-4">
                  <p className="text-yellow-300">
                    <strong>Before Paying:</strong> Ensure you can participate at the scheduled time 
                    and understand all tournament rules and requirements.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-game-purple" />
                  2. Website Source Code Purchases
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300 font-bold">
                    Website source code purchases are final with no refunds or exchanges
                  </p>
                </div>
                <p>The ৳15,000 website purchase is non-refundable because:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Digital products cannot be "returned" once downloaded</li>
                  <li>Source code provides complete functionality as advertised</li>
                  <li>Technical support is provided for setup issues</li>
                  <li>Product description clearly outlines what is included</li>
                </ul>
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-4">
                  <p className="text-blue-300">
                    <strong>Download Links:</strong> You have 7 days to download after approval. 
                    Expired links cannot be regenerated.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-game-purple" />
                  3. Payment Verification Process
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Our manual payment verification process means that once you submit payment details:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payments cannot be reversed or refunded</li>
                  <li>Incorrect transaction details may result in payment rejection</li>
                  <li>Rejected payments are not refunded - you must resubmit correctly</li>
                  <li>Verification can take up to 24 hours</li>
                  <li>Admin decisions on payment verification are final</li>
                </ul>
                
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mt-4">
                  <p className="text-orange-300">
                    <strong>Payment Tips:</strong> Double-check your transaction ID and phone number 
                    before submitting to avoid rejection.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">4. Why No Refunds?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>Our no-refund policy exists because:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Tournament Planning:</strong> Entry fees help us plan tournament sizes and prizes</li>
                  <li><strong>Fair Competition:</strong> Prevents last-minute dropouts that affect other players</li>
                  <li><strong>Operational Costs:</strong> Platform maintenance and administration costs</li>
                  <li><strong>Payment Processing:</strong> bKash/Nagad transactions cannot be easily reversed</li>
                  <li><strong>Digital Nature:</strong> Tournament slots and digital products cannot be "returned"</li>
                  <li><strong>Age Compliance:</strong> Clear terms help maintain our 15+ age requirement</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">5. Exceptional Circumstances</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300 font-bold">
                    Even in exceptional circumstances, refunds are not provided
                  </p>
                </div>
                <p>This includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Medical emergencies or personal crises</li>
                  <li>Natural disasters or power outages</li>
                  <li>Government restrictions or lockdowns</li>
                  <li>Platform technical issues (we provide alternatives when possible)</li>
                  <li>Game server problems (tournaments may be rescheduled)</li>
                </ul>
                
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mt-4">
                  <p className="text-green-300">
                    <strong>Alternative Solutions:</strong> In case of platform issues, we may offer 
                    tournament credits or rescheduling, but no cash refunds.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">6. Age Requirement and Responsibility</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300 font-bold">
                    Users under 15 years old are not permitted and will not receive refunds
                  </p>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Age verification is required before any payments</li>
                  <li>Underage users will have accounts suspended without refunds</li>
                  <li>Parents/guardians are responsible for monitoring their children's activities</li>
                  <li>False age information voids any refund considerations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">7. Contact and Disputes</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  If you have payment or tournament issues (not refund requests):
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment verification issues: Contact via platform admin</li>
                  <li>Tournament technical problems: Report immediately during event</li>
                  <li>Account issues: Use platform support system</li>
                  <li>Payment questions: bKash/Nagad 01926298571</li>
                </ul>
                
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4 mt-4">
                  <p className="text-gray-300">
                    <strong>Important:</strong> Contacting us does not guarantee any resolution 
                    that involves refunds. All payments remain final.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card className="bg-red-900/30 border-2 border-red-500/50">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-red-300 mb-4">
                  By Making Any Payment, You Acknowledge:
                </h3>
                <ul className="text-red-200 space-y-2 text-left max-w-2xl mx-auto">
                  <li>• You have read and understood this no-refund policy</li>
                  <li>• You meet the minimum age requirement of 15 years</li>
                  <li>• You understand all payments are final and non-refundable</li>
                  <li>• You accept responsibility for your participation and payments</li>
                  <li>• You agree to abide by all tournament rules and platform terms</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-red-400 font-medium mt-2">
              This policy is strictly enforced. Please read carefully before making any payments.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
}
