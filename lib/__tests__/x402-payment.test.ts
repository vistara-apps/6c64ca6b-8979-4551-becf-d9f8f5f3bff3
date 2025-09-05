/**
 * Test file for X402 Payment Service
 * This file contains tests to verify the x402 payment flow implementation
 */

import { X402PaymentService, PaymentConfig, USDC_BASE_ADDRESS } from '../x402-payment';

// Mock wallet client for testing
const mockWalletClient = {
  sendTransaction: jest.fn(),
  getTransactionReceipt: jest.fn(),
  getBlockNumber: jest.fn(),
  readContract: jest.fn(),
  estimateGas: jest.fn(),
};

// Mock x402-axios
jest.mock('x402-axios', () => ({
  withPaymentInterceptor: jest.fn(),
  decodeXPaymentResponse: jest.fn(),
}));

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
  })),
}));

describe('X402PaymentService', () => {
  let paymentService: X402PaymentService;

  beforeEach(() => {
    paymentService = new X402PaymentService();
    paymentService.setWalletClient(mockWalletClient as any);
    jest.clearAllMocks();
  });

  describe('Payment Configuration Validation', () => {
    test('should validate payment amount', async () => {
      const invalidConfigs = [
        { amount: '', recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
        { amount: '0', recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
        { amount: '-1', recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
        { amount: 'invalid', recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
      ];

      for (const config of invalidConfigs) {
        const result = await paymentService.initiatePayment(config as PaymentConfig);
        expect(result.success).toBe(false);
        expect(result.error).toContain('amount');
      }
    });

    test('should validate recipient address', async () => {
      const invalidConfigs = [
        { amount: '0.01', recipient: '' },
        { amount: '0.01', recipient: 'invalid' },
        { amount: '0.01', recipient: '0x123' }, // Too short
        { amount: '0.01', recipient: 'not_hex_address' },
      ];

      for (const config of invalidConfigs) {
        const result = await paymentService.initiatePayment(config as PaymentConfig);
        expect(result.success).toBe(false);
        expect(result.error).toContain('address');
      }
    });

    test('should accept valid payment configuration', async () => {
      const validConfig: PaymentConfig = {
        amount: '0.01',
        recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        description: 'Test payment',
      };

      // Mock successful axios response
      const axios = require('axios');
      const mockAxiosInstance = axios.create();
      mockAxiosInstance.post.mockResolvedValue({ data: 'success' });

      // Mock x402 decode response
      const { decodeXPaymentResponse } = require('x402-axios');
      decodeXPaymentResponse.mockReturnValue({
        transaction: '0x123456789abcdef',
      });

      const result = await paymentService.initiatePayment(validConfig);
      expect(result.success).toBe(true);
      expect(result.transactionHash).toBe('0x123456789abcdef');
    });
  });

  describe('Payment Status Checking', () => {
    test('should return pending status for non-existent receipt', async () => {
      mockWalletClient.getTransactionReceipt.mockResolvedValue(null);

      const status = await paymentService.checkPaymentStatus('0x123456789abcdef');
      expect(status.status).toBe('pending');
      expect(status.transactionHash).toBe('0x123456789abcdef');
    });

    test('should return confirmed status for successful transaction with confirmations', async () => {
      mockWalletClient.getTransactionReceipt.mockResolvedValue({
        status: 'success',
        blockNumber: BigInt(100),
      });
      mockWalletClient.getBlockNumber.mockResolvedValue(BigInt(102));

      const status = await paymentService.checkPaymentStatus('0x123456789abcdef');
      expect(status.status).toBe('confirmed');
      expect(status.confirmations).toBe(2);
    });

    test('should return failed status for reverted transaction', async () => {
      mockWalletClient.getTransactionReceipt.mockResolvedValue({
        status: 'reverted',
        blockNumber: BigInt(100),
      });
      mockWalletClient.getBlockNumber.mockResolvedValue(BigInt(102));

      const status = await paymentService.checkPaymentStatus('0x123456789abcdef');
      expect(status.status).toBe('failed');
    });
  });

  describe('USDC Balance Checking', () => {
    test('should return formatted USDC balance', async () => {
      // Mock USDC balance of 1000000 (1 USDC with 6 decimals)
      mockWalletClient.readContract.mockResolvedValue(BigInt(1000000));

      const balance = await paymentService.getUSDCBalance('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
      expect(balance).toBe('1');
    });

    test('should return 0 balance on error', async () => {
      mockWalletClient.readContract.mockRejectedValue(new Error('Network error'));

      const balance = await paymentService.getUSDCBalance('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
      expect(balance).toBe('0');
    });
  });

  describe('Gas Estimation', () => {
    test('should estimate gas for payment transaction', async () => {
      const config: PaymentConfig = {
        amount: '0.01',
        recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      };

      mockWalletClient.estimateGas.mockResolvedValue(BigInt(130000));

      const gasEstimate = await paymentService.estimatePaymentGas(config);
      expect(gasEstimate).toBe(BigInt(150000)); // 130000 + 20000 buffer
    });

    test('should return default gas estimate on error', async () => {
      const config: PaymentConfig = {
        amount: '0.01',
        recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      };

      mockWalletClient.estimateGas.mockRejectedValue(new Error('Gas estimation failed'));

      const gasEstimate = await paymentService.estimatePaymentGas(config);
      expect(gasEstimate).toBe(BigInt(100000));
    });
  });

  describe('Error Handling', () => {
    test('should handle wallet client not set error', async () => {
      const serviceWithoutWallet = new X402PaymentService();
      
      const config: PaymentConfig = {
        amount: '0.01',
        recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      };

      const result = await serviceWithoutWallet.initiatePayment(config);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Wallet client not set');
    });

    test('should handle axios client errors', async () => {
      const config: PaymentConfig = {
        amount: '0.01',
        recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      };

      // Mock axios error
      const axios = require('axios');
      const mockAxiosInstance = axios.create();
      mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));

      const result = await paymentService.initiatePayment(config);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    test('should handle decode response errors', async () => {
      const config: PaymentConfig = {
        amount: '0.01',
        recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      };

      // Mock successful axios response but failed decode
      const axios = require('axios');
      const mockAxiosInstance = axios.create();
      mockAxiosInstance.post.mockResolvedValue({ data: 'success' });

      // Mock x402 decode response failure
      const { decodeXPaymentResponse } = require('x402-axios');
      decodeXPaymentResponse.mockReturnValue(null);

      const result = await paymentService.initiatePayment(config);
      expect(result.success).toBe(true); // Should still succeed with mock hash
      expect(result.transactionHash).toMatch(/^0x[a-f0-9]{64}$/);
    });
  });

  describe('Constants', () => {
    test('should have correct USDC Base address', () => {
      expect(USDC_BASE_ADDRESS).toBe('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
    });
  });
});

// Integration test scenarios
describe('X402 Payment Integration Tests', () => {
  test('End-to-end payment flow simulation', async () => {
    const paymentService = new X402PaymentService();
    paymentService.setWalletClient(mockWalletClient as any);

    const config: PaymentConfig = {
      amount: '0.01',
      recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      description: 'Integration test payment',
      metadata: {
        testId: 'integration-test-1',
        timestamp: Date.now(),
      },
    };

    // Mock successful flow
    const axios = require('axios');
    const mockAxiosInstance = axios.create();
    mockAxiosInstance.post.mockResolvedValue({ data: 'success' });

    const txHash = '0x123456789abcdef';
    const { decodeXPaymentResponse } = require('x402-axios');
    decodeXPaymentResponse.mockReturnValue({
      transaction: txHash,
    });

    // Step 1: Initiate payment
    const paymentResult = await paymentService.initiatePayment(config);
    expect(paymentResult.success).toBe(true);
    expect(paymentResult.transactionHash).toBe(txHash);

    // Step 2: Check payment status (pending)
    mockWalletClient.getTransactionReceipt.mockResolvedValue(null);
    let status = await paymentService.checkPaymentStatus(txHash);
    expect(status.status).toBe('pending');

    // Step 3: Check payment status (confirmed)
    mockWalletClient.getTransactionReceipt.mockResolvedValue({
      status: 'success',
      blockNumber: BigInt(100),
    });
    mockWalletClient.getBlockNumber.mockResolvedValue(BigInt(102));

    status = await paymentService.checkPaymentStatus(txHash);
    expect(status.status).toBe('confirmed');
    expect(status.confirmations).toBe(2);

    // Step 4: Check USDC balance
    mockWalletClient.readContract.mockResolvedValue(BigInt(990000)); // 0.99 USDC after payment
    const balance = await paymentService.getUSDCBalance('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
    expect(balance).toBe('0.99');
  });
});
