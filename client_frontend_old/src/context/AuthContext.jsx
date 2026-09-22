import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { customerApi } from '../services/api';

const AuthContext = createContext(null);

function readStoredCustomer() {
  try {
    const stored = localStorage.getItem('customer_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getCustomerFromResponse(result) {
  return (
    result?.customer ||
    result?.data?.customer ||
    result?.data ||
    result?.user ||
    null
  );
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => readStoredCustomer());
  const [token, setToken] = useState(() => localStorage.getItem('customer_token'));
  const [authLoading, setAuthLoading] = useState(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    sessionStorage.removeItem('customer_session_only');
    setToken(null);
    setCustomer(null);
  }, []);

  const saveCustomer = useCallback((customerData) => {
    if (!customerData) return;
    localStorage.setItem('customer_user', JSON.stringify(customerData));
    setCustomer(customerData);
  }, []);

  const login = useCallback(
    async (identifier, password) => {
      const cleanIdentifier = String(identifier || '').trim();
      const payload = cleanIdentifier.includes('@')
        ? { email: cleanIdentifier, password }
        : { customerId: cleanIdentifier, password };

      const result = await customerApi.login(payload);
      const nextToken =
        result?.token || result?.data?.token || result?.accessToken || null;
      const nextCustomer = getCustomerFromResponse(result);

      if (!nextToken || !nextCustomer) {
        throw new Error('Invalid login response. Customer details were not received.');
      }

      localStorage.setItem('customer_token', nextToken);
      localStorage.setItem('customer_user', JSON.stringify(nextCustomer));

      setToken(nextToken);
      setCustomer(nextCustomer);

      return result;
    },
    []
  );

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const refreshCustomer = useCallback(async () => {
    if (!localStorage.getItem('customer_token')) {
      clearAuth();
      return null;
    }

    try {
      const result = await customerApi.me();
      const freshCustomer = getCustomerFromResponse(result);

      if (freshCustomer && typeof freshCustomer === 'object') {
        saveCustomer(freshCustomer);
        return freshCustomer;
      }

      return customer;
    } catch (error) {
      clearAuth();
      throw error;
    }
  }, [clearAuth, customer, saveCustomer]);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem('customer_token');
      const storedCustomer = readStoredCustomer();

      if (!storedToken || !storedCustomer) {
        if (active) {
          clearAuth();
          setAuthLoading(false);
        }
        return;
      }

      if (active) {
        setToken(storedToken);
        setCustomer(storedCustomer);
      }

      try {
        const result = await customerApi.me();
        const freshCustomer = getCustomerFromResponse(result);

        if (active && freshCustomer && typeof freshCustomer === 'object') {
          localStorage.setItem('customer_user', JSON.stringify(freshCustomer));
          setCustomer(freshCustomer);
        }
      } catch {
        if (active) clearAuth();
      } finally {
        if (active) setAuthLoading(false);
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      customer,
      token,
      login,
      logout,
      refreshCustomer,
      authLoading,
      isLoggedIn: Boolean(token && customer),
    }),
    [customer, token, login, logout, refreshCustomer, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
