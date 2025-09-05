'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useX402Payment } from '@/lib/hooks/useX402Payment';
import { PaymentConfig } from '@/lib/x402-payment';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  AlertCircle,
  Wallet
} from 'lucide-react';

export function X402PaymentDemo() {
  const { address, isConnected } = useAccount();
  const {
    isLoading,
    error,
    paymentResult,
    paymentStatus,
    usdcBalance,
    isLoadingBalance,
    initiatePayment,
    checkPaymentStatus,
    refreshBalance,
    clearError,
    reset,
  } = useX402Payment();

  // Form state
  const [amount, setAmount] = useState('0.01');
  const [recipient, setRecipient] = useState('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'); // Example address
  const [description, setDescription] = useState('Test x402 payment');

  const handlePayment = async () => {
    if (!amount || !recipient) {
      return;
    }

    const config: PaymentConfig = {
      amount,
      recipient,
      description,
      metadata: {
        source: 'nexus-weaver',
        timestamp: Date.now(),
      },
    };

    await initiatePayment(config);
  };

  const handleCheckStatus = async () => {
    if (paymentResult?.transactionHash) {
      await checkPaymentStatus(paymentResult.transactionHash);
    }
  };

  const getStatusIcon = () => {
    if (!paymentStatus) return null;
    
    switch (paymentStatus.status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    if (!paymentStatus) return 'text-gray-500';
    
    switch (paymentStatus.status) {
      case 'confirmed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl border border-gray-800">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400 mb-6">
            Connect your wallet to test x402 payments with USDC on Base
          </p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-xl border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-8 h-8 text-purple-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">X402 Payment Demo</h2>
          <p className="text-gray-400">Test USDC payments on Base using x402 protocol</p>
        </div>
      </div>

      {/* USDC Balance */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-white font-medium">USDC Balance</span>
          </div>
          <div className="flex items-center gap-2">
            {isLoadingBalance ? (
              <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
            ) : (
              <button
                onClick={refreshBalance}
                className="p-1 hover:bg-gray-700 rounded"
                title="Refresh balance"
              >
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <span className="text-xl font-bold text-green-500">
              {usdcBalance} USDC
            </span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (USDC)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Payment description"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-400">{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Payment Actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handlePayment}
          disabled={isLoading || !amount || !recipient}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          {isLoading ? 'Processing...' : 'Send Payment'}
        </button>

        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Payment Result */}
      {paymentResult && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Payment Result</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={paymentResult.success ? 'text-green-500' : 'text-red-500'}>
                {paymentResult.success ? 'Success' : 'Failed'}
              </span>
            </div>
            
            {paymentResult.transactionHash && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Transaction:</span>
                <a
                  href={`https://basescan.org/tx/${paymentResult.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-mono text-sm truncate max-w-[200px]"
                >
                  {paymentResult.transactionHash}
                </a>
              </div>
            )}
          </div>

          {paymentResult.transactionHash && (
            <button
              onClick={handleCheckStatus}
              className="mt-3 flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
            >
              <RefreshCw className="w-3 h-3" />
              Check Status
            </button>
          )}
        </div>
      )}

      {/* Payment Status */}
      {paymentStatus && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Transaction Status</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className={getStatusColor()}>
                  {paymentStatus.status.charAt(0).toUpperCase() + paymentStatus.status.slice(1)}
                </span>
              </div>
            </div>
            
            {paymentStatus.confirmations !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Confirmations:</span>
                <span className="text-white">{paymentStatus.confirmations}</span>
              </div>
            )}
            
            {paymentStatus.transactionHash && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Transaction:</span>
                <a
                  href={`https://basescan.org/tx/${paymentStatus.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-mono text-sm truncate max-w-[200px]"
                >
                  {paymentStatus.transactionHash}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
        <h4 className="text-blue-400 font-medium mb-2">Testing Instructions:</h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• Make sure you have USDC on Base network</li>
          <li>• Enter a small amount (e.g., 0.01 USDC) for testing</li>
          <li>• Use a valid recipient address</li>
          <li>• Monitor transaction confirmations on Base</li>
          <li>• Check your balance after successful payment</li>
        </ul>
      </div>
    </div>
  );
}
