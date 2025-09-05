import { useState, useCallback, useEffect } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { x402PaymentService, PaymentConfig, PaymentResult, PaymentStatus } from '../x402-payment';

export interface UseX402PaymentReturn {
  // Payment state
  isLoading: boolean;
  error: string | null;
  paymentResult: PaymentResult | null;
  paymentStatus: PaymentStatus | null;
  
  // USDC balance
  usdcBalance: string;
  isLoadingBalance: boolean;
  
  // Actions
  initiatePayment: (config: PaymentConfig) => Promise<PaymentResult>;
  checkPaymentStatus: (transactionHash: string) => Promise<PaymentStatus>;
  refreshBalance: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

/**
 * React hook for x402 payments using wagmi
 */
export function useX402Payment(): UseX402PaymentReturn {
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  
  // Payment state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  
  // Balance state
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Set wallet client when available
  useEffect(() => {
    if (walletClient) {
      x402PaymentService.setWalletClient(walletClient);
    }
  }, [walletClient]);

  // Load USDC balance when wallet is connected
  useEffect(() => {
    if (address && isConnected && walletClient) {
      refreshBalance();
    }
  }, [address, isConnected, walletClient]);

  /**
   * Initiate a payment
   */
  const initiatePayment = useCallback(async (config: PaymentConfig): Promise<PaymentResult> => {
    if (!walletClient) {
      const error = 'Wallet not connected';
      setError(error);
      return { success: false, error };
    }

    setIsLoading(true);
    setError(null);
    setPaymentResult(null);
    setPaymentStatus(null);

    try {
      const result = await x402PaymentService.initiatePayment(config);
      setPaymentResult(result);
      
      if (!result.success) {
        setError(result.error || 'Payment failed');
      } else if (result.transactionHash) {
        // Start monitoring payment status
        monitorPaymentStatus(result.transactionHash);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [walletClient]);

  /**
   * Check payment status
   */
  const checkPaymentStatus = useCallback(async (transactionHash: string): Promise<PaymentStatus> => {
    try {
      const status = await x402PaymentService.checkPaymentStatus(transactionHash);
      setPaymentStatus(status);
      
      if (status.error) {
        setError(status.error);
      }
      
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check payment status';
      setError(errorMessage);
      return { status: 'failed', transactionHash, error: errorMessage };
    }
  }, []);

  /**
   * Monitor payment status with polling
   */
  const monitorPaymentStatus = useCallback(async (transactionHash: string) => {
    const maxAttempts = 30; // Monitor for up to 5 minutes (30 * 10s)
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setError('Payment monitoring timeout');
        return;
      }

      try {
        const status = await checkPaymentStatus(transactionHash);
        
        if (status.status === 'confirmed') {
          // Payment confirmed, refresh balance
          await refreshBalance();
          return;
        } else if (status.status === 'failed') {
          // Payment failed, stop monitoring
          return;
        } else {
          // Still pending, continue monitoring
          attempts++;
          setTimeout(poll, 10000); // Poll every 10 seconds
        }
      } catch (err) {
        console.error('Error monitoring payment status:', err);
        attempts++;
        setTimeout(poll, 10000);
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 2000);
  }, [checkPaymentStatus]);

  /**
   * Refresh USDC balance
   */
  const refreshBalance = useCallback(async () => {
    if (!address || !walletClient) {
      return;
    }

    setIsLoadingBalance(true);
    try {
      const balance = await x402PaymentService.getUSDCBalance(address);
      setUsdcBalance(balance);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
      setError('Failed to load USDC balance');
    } finally {
      setIsLoadingBalance(false);
    }
  }, [address, walletClient]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setPaymentResult(null);
    setPaymentStatus(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    paymentResult,
    paymentStatus,
    usdcBalance,
    isLoadingBalance,
    
    // Actions
    initiatePayment,
    checkPaymentStatus,
    refreshBalance,
    clearError,
    reset,
  };
}
