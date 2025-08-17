import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className = '' }: NavigationProps) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation('/');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className={`bg-gray-900/95 border-b border-purple-500/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setLocation('/')}
              className="text-xl font-bold text-white hover:text-purple-400 transition-colors"
              data-testid="logo-button"
            >
              SkillsMoney
            </button>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setLocation('/')}
              className={`text-gray-300 hover:text-white transition-colors ${location === '/' ? 'text-purple-400' : ''}`}
              data-testid="nav-home"
            >
              Home
            </button>
            <button
              onClick={() => setLocation('/tournaments')}
              className={`text-gray-300 hover:text-white transition-colors ${location === '/tournaments' ? 'text-purple-400' : ''}`}
              data-testid="nav-tournaments"
            >
              Tournaments
            </button>
            <button
              onClick={() => setLocation('/how-to-play')}
              className={`text-gray-300 hover:text-white transition-colors ${location === '/how-to-play' ? 'text-purple-400' : ''}`}
              data-testid="nav-how-to-play"
            >
              How to Play
            </button>
            <button
              onClick={() => setLocation('/faq')}
              className={`text-gray-300 hover:text-white transition-colors ${location === '/faq' ? 'text-purple-400' : ''}`}
              data-testid="nav-faq"
            >
              FAQ
            </button>
            <button
              onClick={() => setLocation('/contact')}
              className={`text-gray-300 hover:text-white transition-colors ${location === '/contact' ? 'text-purple-400' : ''}`}
              data-testid="nav-contact"
            >
              Contact Us
            </button>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300 text-sm">
                  Welcome, {user?.name}
                </span>
                {user?.role === 'admin' || user?.role === 'super_admin' ? (
                  <Button
                    onClick={() => setLocation('/admin')}
                    variant="outline"
                    size="sm"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                    data-testid="nav-admin"
                  >
                    Admin Panel
                  </Button>
                ) : (
                  <Button
                    onClick={() => setLocation('/dashboard')}
                    variant="outline"
                    size="sm"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                    data-testid="nav-dashboard"
                  >
                    Dashboard
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                  disabled={logoutMutation.isPending}
                  data-testid="nav-logout"
                >
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setLocation('/login')}
                  variant="outline"
                  size="sm"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                  data-testid="nav-login"
                >
                  Login
                </Button>
                <Button
                  onClick={() => setLocation('/register')}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  data-testid="nav-register"
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
              data-testid="mobile-menu-button"
            >
              ☰
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}