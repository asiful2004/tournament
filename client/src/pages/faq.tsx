import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TriangleAlert } from "lucide-react";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300">
              Get answers to common questions about SkillsMoney tournaments
            </p>
            
            {/* Age Requirement Notice */}
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg max-w-md mx-auto">
              <TriangleAlert className="inline mr-2 h-5 w-5 text-red-400" />
              <span className="text-red-300 font-medium">Minimum age 15+ years required to participate</span>
            </div>
          </div>

          <Card className="bg-gray-900/90 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Tournament Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="age-requirement" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-purple-400">
                    What is the minimum age requirement?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    You must be at least 15 years old to participate in any tournament on SkillsMoney. 
                    Age verification is mandatory during registration and strictly enforced.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment-methods" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-purple-400">
                    Which payment methods are supported?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    We accept payments via bKash and Nagad mobile banking. Upload your payment screenshot 
                    and our admin will verify and approve it within 10 minutes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="refund-policy" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-purple-400">
                    What is your refund policy?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <strong className="text-red-400">No refunds</strong> are provided once your payment has been 
                    approved by the admin. Please make sure you can participate before making payment.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="room-details" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-purple-400">
                    When will I get room details?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Room ID and password will be revealed exactly 5 minutes before the tournament start time. 
                    You'll also receive email reminders at 30, 20, and 5 minutes before the tournament.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="prize-payout" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-purple-400">
                    How fast are prize payouts?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Prizes are paid within 24 hours of tournament completion via bKash or Nagad 
                    to the mobile number used for registration.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tournament-types" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-purple-400">
                    What types of tournaments are available?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    We offer both Solo (1 player) and Squad (4 players) Free Fire tournaments with 
                    various entry fees ranging from ৳10 to ৳500 and prize pools up to ৳10,000+.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cheating-policy" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-purple-400">
                    What happens if someone cheats?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Cheating, hacking, or any unfair gameplay results in immediate disqualification 
                    and permanent ban from the platform. We maintain zero tolerance for cheating.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="technical-support" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-purple-400">
                    What if I face technical issues?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Contact our support team immediately via the Contact Us page. We provide 
                    24/7 support during tournament hours to resolve any technical issues quickly.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="account-security" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-purple-400">
                    How secure is my account and payment data?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Your account and payment information are completely secure. We use industry-standard 
                    encryption and never store sensitive payment details on our servers.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="late-joining" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-purple-400">
                    Can I join a tournament after it starts?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    No, you must join the room within 5 minutes of the tournament start time. 
                    Late entries are not allowed to ensure fair gameplay for all participants.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-gray-300 mb-6">
              Our support team is here to help you 24/7
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              data-testid="link-contact-support"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}