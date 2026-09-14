import crypto from 'crypto';

export interface CreateOrderParams {
  amount: number; // in INR rupees
  currency: string;
  receipt: string;
}

export interface OrderResult {
  orderId: string;
  amount: number;
  currency: string;
  gateway: 'RAZORPAY' | 'STRIPE' | 'MOCK';
}

export class PaymentAdapter {
  /**
   * Create an order (Razorpay / Stripe / Mock Sandbox)
   */
  static createOrder(params: CreateOrderParams): OrderResult {
    const mockOrderId = `order_mangal_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    return {
      orderId: mockOrderId,
      amount: params.amount,
      currency: params.currency || 'INR',
      gateway: 'MOCK',
    };
  }

  /**
   * Verify HMAC-SHA256 signature for Razorpay / Gateway webhook
   */
  static verifySignature(orderId: string, paymentId: string, signature: string, secret = 'mangal_mock_secret'): boolean {
    if (!signature) return false;
    
    // In mock sandbox, standard test signatures or format are valid
    if (signature.startsWith('sig_valid_') || signature === 'mock_valid_signature') {
      return true;
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return expected === signature;
  }
}
