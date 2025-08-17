import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, Link } from "wouter";
import { 
  Flame, 
  Trophy, 
  LayoutDashboard, 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Shield,
  UserPlus,
  LogIn
} from "lucide-react";

export default function Navigation() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [_, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // For now, assume user is not authenticated since we disabled the auth query
  const actuallyAuthenticated = false;

  const navigationItems = [
    { href: "/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, requireAuth: true },
    { href: "/buy-website", label: "Buy Website", icon: ShoppingCart },
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <nav className="bg-game-darker border-b border-game-purple/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3" data-testid="brand-link">
              <Flame className="text-game-purple text-2xl h-8 w-8" />
              <span className="text-xl font-bold text-white">FF Tournament Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-6">
                {navigationItems.map((item) => {
                  if (item.requireAuth && !actuallyAuthenticated) return null;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-gray-300 hover:text-game-purple transition-colors flex items-center"
                      data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <item.icon className="mr-1 h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                {actuallyAuthenticated && user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-gray-300 hover:text-game-purple transition-colors flex items-center"
                    data-testid="nav-link-admin"
                  >
                    <Shield className="mr-1 h-4 w-4" />
                    Admin
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Desktop Auth Buttons */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
              {isLoading ? (
                <div className="w-8 h-8 bg-game-purple/20 rounded-full animate-pulse"></div>
              ) : actuallyAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-game-purple/20" data-testid="user-menu-trigger">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className="bg-game-purple text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white">
                        {user?.name || user?.email?.split('@')[0] || 'User'}
                      </span>
                      {user?.isAgeVerified && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          Verified
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-game-blue border-game-purple/30 text-white" align="end">
                    <DropdownMenuItem asChild>
                      <a href="/dashboard" className="cursor-pointer" data-testid="dropdown-dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </a>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <a href="/admin" className="cursor-pointer" data-testid="dropdown-admin">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-game-purple/20" />
                    <DropdownMenuItem asChild>
                      <a href="/api/logout" className="cursor-pointer text-red-400" data-testid="dropdown-logout">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={() => setLocation('/register')}
                    className="bg-game-purple hover:bg-game-purple-light px-4 py-2 rounded-lg transition-colors glow-effect"
                    data-testid="button-register"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                  <Button 
                    onClick={() => setLocation('/login')}
                    variant="outline"
                    className="border border-game-purple text-game-purple hover:bg-game-purple hover:text-white px-4 py-2 rounded-lg transition-colors"
                    data-testid="button-login"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:bg-game-purple/20"
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="md:hidden border-t border-game-purple/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Navigation Links */}
              {navigationItems.map((item) => {
                if (item.requireAuth && !isAuthenticated) return null;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-gray-300 hover:text-game-purple block px-3 py-2 rounded-md text-base font-medium flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </a>
                );
              })}
              
              {isAdmin && (
                <a
                  href="/admin"
                  className="text-gray-300 hover:text-game-purple block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-nav-admin"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Admin Panel
                </a>
              )}

              {/* Auth Section */}
              <div className="border-t border-game-purple/20 pt-4">
                {isLoading ? (
                  <div className="px-3 py-2">
                    <div className="w-full h-10 bg-game-purple/20 rounded animate-pulse"></div>
                  </div>
                ) : isAuthenticated ? (
                  <div className="space-y-2">
                    {/* User Info */}
                    <div className="px-3 py-2 flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className="bg-game-purple text-white">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white font-medium">
                          {user?.name || user?.email?.split('@')[0] || 'User'}
                        </div>
                        {user?.isAgeVerified && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Dashboard Link */}
                    <a
                      href="/dashboard"
                      className="text-gray-300 hover:text-game-purple block px-3 py-2 rounded-md text-base font-medium flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid="mobile-nav-dashboard"
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Dashboard
                    </a>
                    
                    {/* Logout */}
                    <a
                      href="/api/logout"
                      className="text-red-400 hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                      data-testid="mobile-nav-logout"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                    </a>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <Button 
                      onClick={() => {
                        setLocation('/register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-game-purple hover:bg-game-purple-light glow-effect"
                      data-testid="mobile-button-register"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register
                    </Button>
                    <Button 
                      onClick={() => {
                        setLocation('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-game-purple text-game-purple hover:bg-game-purple hover:text-white"
                      data-testid="mobile-button-login"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
