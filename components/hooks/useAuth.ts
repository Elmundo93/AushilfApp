// components/hooks/useAuth.ts
import { useAuthStore } from '@/components/stores/AuthStore';
import { AuthController } from '@/components/services/Auth/AuthController';

export const useAuth = () => {
  const auth = useAuthStore();

  return {
    isAuthenticated: auth.authenticated,
    user: auth.user,
    loading: auth.isLoading,
    error: auth.error,
    loginWithEmail: AuthController.loginWithEmail,
    register: AuthController.register,
    loginWithOAuth: AuthController.loginWithOAuth,
    finalizeOAuth: AuthController.finalizeOAuthLogin,
    logout: AuthController.logout,
  };
};