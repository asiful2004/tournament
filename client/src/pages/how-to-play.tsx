import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Clock, Trophy, DollarSign, TriangleAlert } from "lucide-react";

export default function HowToPlay() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              How to Play
            </h1>
            <p className="text-xl text-gray-300">
              Complete guide to joining Free Fire tournaments on SkillsMoney
            </p>
            
            {/* Age Requirement Notice */}
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg max-w-md mx-auto">
              <TriangleAlert className="inline mr-2 h-5 w-5 text-red-400" />
              <span className="text-red-300 font-medium">Minimum age 15+ years required to participate</span>
            </div>
          </div>

          {/* Step by step guide */}
          <div className="space-y-8">
            {/* Step 1 */}
            <Card className="bg-gray-900/90 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Badge className="bg-purple-600 text-white">Step 1</Badge>
                  <CardTitle className="text-2xl text-white">Create Account</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="flex items-start gap-4">
                  <User className="h-6 w-6 text-purple-400 mt-1" />
                  <div>
                    <p className="mb-2">Register with your email and verify you're 15+ years old</p>
                    <p className="text-sm text-orange-400">⚠️ Age verification is mandatory for tournament participation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-gray-900/90 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Badge className="bg-purple-600 text-white">Step 2</Badge>
                  <CardTitle className="text-2xl text-white">Choose Tournament</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="flex items-start gap-4">
                  <Trophy className="h-6 w-6 text-purple-400 mt-1" />
                  <div>
                    <p className="mb-2">Browse available Free Fire tournaments</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Solo tournaments (1 player)</li>
                      <li>Squad tournaments (4 players)</li>
                      <li>Entry fees range from ৳10 to ৳500</li>
                      <li>Prize pools up to ৳10,000+</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="bg-gray-900/90 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Badge className="bg-purple-600 text-white">Step 3</Badge>
                  <CardTitle className="text-2xl text-white">Pay Entry Fee</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="flex items-start gap-4">
                  <DollarSign className="h-6 w-6 text-purple-400 mt-1" />
                  <div>
                    <p className="mb-2">Pay tournament entry fee via mobile banking</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Supported: bKash and Nagad</li>
                      <li>Upload payment screenshot for verification</li>
                      <li>Admin will approve within 10 minutes</li>
                      <li>No refunds after admin approval</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="bg-gray-900/90 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Badge className="bg-purple-600 text-white">Step 4</Badge>
                  <CardTitle className="text-2xl text-white">Get Room Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-purple-400 mt-1" />
                  <div>
                    <p className="mb-2">Room details revealed 5 minutes before tournament start</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Room ID and password will be shown</li>
                      <li>You'll receive email reminder notifications</li>
                      <li>Join the game room at the scheduled time</li>
                      <li>Follow tournament rules and fair play</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tournament Rules */}
            <Card className="bg-red-900/20 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-red-300">Important Rules</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Minimum age 15+ years required
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    No refunds after payment approval
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Must join room within 5 minutes of start time
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Cheating or hacking results in permanent ban
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Prizes paid within 24 hours of tournament completion
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}