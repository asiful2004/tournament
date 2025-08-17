import { Link } from "wouter";
import { Trophy, Mail, Shield, FileText, HelpCircle, Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-game-darker border-t border-game-purple/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-game-purple to-game-purple-light rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Skills Money</h3>
                <p className="text-sm text-gray-400">Free Fire Tournament Platform</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Join the ultimate Free Fire tournament experience. Compete with skilled players, 
              win real money prizes, and become a champion in the gaming arena.
            </p>
            <p className="text-xs text-gray-500">
              Age Requirement: Must be 15+ years old to participate
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-game-purple transition-colors flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="text-gray-400 hover:text-game-purple transition-colors flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/how-to-play" className="text-gray-400 hover:text-game-purple transition-colors flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  How to Play
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-game-purple transition-colors flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-game-purple transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-game-purple transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-game-purple transition-colors flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 hover:text-game-purple transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-game-purple/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Skills Money. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2 md:mt-0">
              Built with ❤️ for Free Fire gamers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;