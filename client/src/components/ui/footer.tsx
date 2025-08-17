import { Flame, Smartphone, Wallet, TriangleAlert } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { href: "/tournaments", label: "Tournaments" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/buy-website", label: "Buy Website" },
    { href: "#faq", label: "FAQ" },
  ];

  const legalLinks = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/refund", label: "Refund Policy" },
    { href: "#contact", label: "Contact Us" },
  ];

  return (
    <footer className="bg-game-darker border-t border-game-purple/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Flame className="text-game-purple text-2xl h-8 w-8" />
              <span className="text-xl font-bold text-white">FF Tournament Hub</span>
            </div>
            <p className="text-gray-400 mb-4">
              The ultimate platform for Free Flame tournaments in Bangladesh. 
              Join epic battles, compete with skilled players, and win amazing prizes.
            </p>
            <div className="text-red-400 font-medium flex items-center">
              <TriangleAlert className="mr-2 h-4 w-4" />
              Age 15+ required • No refunds policy
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="hover:text-game-purple transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="hover:text-game-purple transition-colors"
                    data-testid={`footer-legal-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="border-t border-game-purple/20 pt-8 mt-8">
          <div className="text-center">
            <h4 className="text-white font-bold mb-4">Payment Information</h4>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
              <div className="flex items-center space-x-2">
                <Smartphone className="text-pink-400 h-5 w-5" />
                <span className="text-gray-300">
                  bKash: <span className="font-mono" data-testid="footer-bkash-number">01926298571</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Wallet className="text-orange-400 h-5 w-5" />
                <span className="text-gray-300">
                  Nagad: <span className="font-mono" data-testid="footer-nagad-number">01926298571</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-game-purple/20 pt-8 mt-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} FF Tournament Hub. All rights reserved. | Age 15+ Required | No Refunds
          </p>
          
          {/* Additional Disclaimers */}
          <div className="mt-4 space-y-2 text-xs">
            <p className="text-red-300">
              <strong>Important:</strong> All tournament payments are final and non-refundable. 
              Participants must be 15 years or older.
            </p>
            <p className="text-gray-500">
              Free Flame is a trademark of Garena. This platform is not affiliated with Garena.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
