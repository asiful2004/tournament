import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAgeVerified: boolean;
  emailVerified: boolean;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: false, // Disable automatic execution
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    error,
  };
}
