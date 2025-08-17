import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TriangleAlert, Shield, Users, CreditCard } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Shield className="mr-3 h-10 w-10 text-game-purple" />
              Terms & Conditions
            </h1>
            <p className="text-gray-300 text-lg">
              Please read these terms carefully before using our tournament platform
            </p>
          </div>

          {/* Age Restriction Notice */}
          <Card className="bg-red-900/20 border border-red-500/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <TriangleAlert className="h-6 w-6 text-red-400 mr-3" />
                <h2 className="text-xl font-bold text-red-300">Age Restriction</h2>
              </div>
              <p className="text-red-200">
                <strong>You must be 15 years or older to participate in tournaments.</strong> 
                Age verification is required during registration. Providing false age information 
                will result in immediate account suspension and forfeiture of any payments made.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="mr-2 h-5 w-5 text-game-purple" />
                  1. User Accounts and Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  By registering for an account, you agree to provide accurate and complete information. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Minimum age requirement: 15 years old</li>
                  <li>Valid email address required for communication</li>
                  <li>Age verification is mandatory before tournament participation</li>
                  <li>One account per person - multiple accounts are prohibited</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-game-purple" />
                  2. Payment and Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-300 font-bold text-center">
                    <TriangleAlert className="inline mr-2 h-5 w-5" />
                    NO REFUNDS - ALL PAYMENTS ARE FINAL
                  </p>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Entry fees must be paid before tournament participation</li>
                  <li>Payments are processed manually via bKash (01926298571) or Nagad (01926298571)</li>
                  <li>Payment verification may take up to 24 hours</li>
                  <li>Rejected payments will not be refunded - resubmission required</li>
                  <li>Tournament cancellations do not guarantee refunds</li>
                  <li>Website source code purchases are final with no refunds</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">3. Tournament Rules</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Players must be available at the scheduled tournament time</li>
                  <li>Secret match information is revealed 5 minutes before tournament start</li>
                  <li>Cheating, hacking, or use of unauthorized software is strictly prohibited</li>
                  <li>Unsportsmanlike behavior may result in disqualification</li>
                  <li>Tournament decisions by administrators are final</li>
                  <li>Players must use their registered username/ID in the game</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">4. Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Creating multiple accounts or sharing accounts</li>
                  <li>Providing false age or personal information</li>
                  <li>Using cheats, hacks, or exploits in tournaments</li>
                  <li>Harassment or abusive behavior towards other players</li>
                  <li>Attempting to manipulate payment systems</li>
                  <li>Reverse engineering or copying the platform's source code</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">5. Liability and Disclaimers</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  The platform is provided "as is" without any warranties. We are not liable for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Technical issues preventing tournament participation</li>
                  <li>Game server downtime or connectivity issues</li>
                  <li>Disputes between players</li>
                  <li>Loss of virtual items or game progress</li>
                  <li>Payment processor fees or delays</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">6. Account Termination</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  We reserve the right to suspend or terminate accounts for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violation of these terms and conditions</li>
                  <li>Fraudulent activity or payment disputes</li>
                  <li>Inappropriate behavior or harassment</li>
                  <li>Underage users (below 15 years)</li>
                  <li>Extended inactivity (12+ months)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">7. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  For questions about these terms or platform-related issues:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment Support: bKash/Nagad 01926298571</li>
                  <li>Tournament Disputes: Contact admin through platform</li>
                  <li>Technical Issues: Use platform support system</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-red-400 font-medium mt-2">
              By using this platform, you acknowledge that you have read and agree to these terms.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
