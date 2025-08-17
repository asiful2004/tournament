import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, Mail, Users } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-game-dark text-gray-100">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Shield className="mr-3 h-10 w-10 text-game-purple" />
              Privacy Policy
            </h1>
            <p className="text-gray-300 text-lg">
              How we collect, use, and protect your information
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-game-purple" />
                  1. Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <h3 className="text-white font-semibold">Personal Information:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email address (required for account creation)</li>
                  <li>First and last name (from authentication provider)</li>
                  <li>Profile picture (if provided by authentication service)</li>
                  <li>Date of birth (for age verification - users 15+ only)</li>
                  <li>Payment information (phone numbers for bKash/Nagad transactions)</li>
                </ul>
                
                <h3 className="text-white font-semibold mt-6">Tournament Data:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Tournament participation history</li>
                  <li>Payment records and transaction IDs</li>
                  <li>Game performance and results</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-white font-semibold mt-6">Technical Information:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and browser information</li>
                  <li>Device type and operating system</li>
                  <li>Login times and session data</li>
                  <li>Platform usage analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="mr-2 h-5 w-5 text-game-purple" />
                  2. How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Management:</strong> Creating and maintaining user accounts</li>
                  <li><strong>Age Verification:</strong> Ensuring users meet the 15+ age requirement</li>
                  <li><strong>Tournament Operations:</strong> Managing registrations and participation</li>
                  <li><strong>Payment Processing:</strong> Verifying bKash/Nagad transactions</li>
                  <li><strong>Communication:</strong> Sending tournament reminders and updates</li>
                  <li><strong>Customer Support:</strong> Responding to inquiries and issues</li>
                  <li><strong>Platform Improvement:</strong> Analytics to enhance user experience</li>
                  <li><strong>Legal Compliance:</strong> Meeting regulatory requirements</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-game-purple" />
                  3. Email Communications
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We send automated emails for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Tournament reminders (30, 20, and 5 minutes before start)</li>
                  <li>Payment confirmation and status updates</li>
                  <li>Tournament registration confirmations</li>
                  <li>Website purchase download links</li>
                  <li>Important platform announcements</li>
                </ul>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-4">
                  <p className="text-yellow-300">
                    <strong>Note:</strong> Tournament reminder emails are essential for participation 
                    and cannot be disabled. Other promotional emails can be managed through your account settings.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="mr-2 h-5 w-5 text-game-purple" />
                  4. Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We do not sell your personal information. We may share data only in these cases:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Tournament Results:</strong> Usernames and scores may be displayed publicly</li>
                  <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
                  <li><strong>Service Providers:</strong> With trusted partners who help operate our platform</li>
                  <li><strong>Payment Verification:</strong> Transaction details with payment processors (bKash/Nagad)</li>
                  <li><strong>Safety:</strong> To prevent fraud or protect user safety</li>
                </ul>
                
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mt-4">
                  <p className="text-green-300">
                    <strong>We Never Share:</strong> Your email address, phone number, or financial 
                    information with third parties for marketing purposes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-game-purple" />
                  5. Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We implement security measures to protect your information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encrypted data transmission (HTTPS/SSL)</li>
                  <li>Secure database storage with access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited employee access to personal data</li>
                  <li>Password hashing and secure authentication</li>
                  <li>Session management and timeout controls</li>
                </ul>
                
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-4">
                  <p className="text-red-300">
                    <strong>Important:</strong> No system is 100% secure. While we use industry-standard 
                    security practices, we cannot guarantee absolute security of your data.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">6. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update incorrect or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Export your tournament history</li>
                  <li><strong>Objection:</strong> Object to certain data processing activities</li>
                </ul>
                
                <p className="mt-4">
                  <strong>Account Deletion:</strong> Deleting your account will remove all personal 
                  information, but tournament results may remain for record-keeping purposes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Active Accounts:</strong> Data retained while account is active</li>
                  <li><strong>Inactive Accounts:</strong> Data deleted after 12 months of inactivity</li>
                  <li><strong>Payment Records:</strong> Retained for 3 years for legal compliance</li>
                  <li><strong>Tournament Results:</strong> Retained indefinitely for historical records</li>
                  <li><strong>Support Communications:</strong> Retained for 2 years</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">8. Age Restrictions</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300 font-bold">
                    This platform is only for users 15 years and older.
                  </p>
                </div>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>We require age verification during registration</li>
                  <li>Underage users will have their accounts suspended</li>
                  <li>We do not knowingly collect data from users under 15</li>
                  <li>Parents can contact us to request deletion of underage user data</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">9. Changes to Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  We may update this privacy policy to reflect changes in our practices or legal requirements. 
                  We will notify users of significant changes via email or platform announcements.
                </p>
                <p>
                  Continued use of the platform after policy updates constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-game-blue/50 border-game-purple/20">
              <CardHeader>
                <CardTitle className="text-white">10. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  For privacy-related questions or to exercise your rights:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: Contact through platform support system</li>
                  <li>Data Requests: Use account settings or contact admin</li>
                  <li>Payment Issues: bKash/Nagad 01926298571</li>
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
            <p className="text-game-purple font-medium mt-2">
              Your privacy is important to us. We are committed to protecting your personal information.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
}
