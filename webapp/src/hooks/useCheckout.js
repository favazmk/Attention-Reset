import { useCallback, useState } from 'react';
import { authedPost } from '../api';

/**
 * Buy one product: create the order, hand it to Razorpay, verify what came back.
 *
 * The amount is never passed in. `/api/create-order` decides what this user pays
 * for this product and returns an order already priced; this only opens the
 * sheet for it. That is what stops a discounted price from being claimed by
 * anyone who can edit a request.
 *
 * The caller supplies `onSuccess` for the case where verification confirms the
 * grant, and `onError` for a human-readable failure.
 */
export default function useCheckout({ onSuccess, onError }) {
  const [busy, setBusy] = useState(false);

  const start = useCallback(
    async ({ productId, name, description, prefill }) => {
      if (busy) return;
      setBusy(true);

      try {
        const order = await authedPost('/api/create-order', { productId });

        const rzp = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name,
          description,
          order_id: order.id,
          handler: async (response) => {
            try {
              await authedPost('/api/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (window.fbq) {
                window.fbq(
                  'track',
                  'Purchase',
                  {
                    value: order.amount / 100,
                    currency: order.currency,
                    content_name: name,
                  },
                  { eventID: response.razorpay_order_id }
                );
              }

              onSuccess?.(productId);
            } catch (err) {
              console.error('Verification error:', err);
              onError?.(
                'Your payment went through but we could not unlock it automatically. Refresh the page — if it is still locked, message us on WhatsApp and we will fix it right away.'
              );
            } finally {
              setBusy(false);
            }
          },
          modal: { ondismiss: () => setBusy(false) },
          prefill: prefill || { name: '', email: '', contact: '' },
          theme: { color: '#F5C842' },
        });

        rzp.on('payment.failed', (response) => {
          setBusy(false);
          onError?.(`Payment failed: ${response.error?.description || 'please try again.'}`);
        });

        rzp.open();
      } catch (err) {
        console.error('Checkout error:', err);
        setBusy(false);

        // The server refuses a second sale of something already owned. Treat
        // that as the success it effectively is rather than an error.
        if (err.data?.error === 'already_enrolled') {
          onSuccess?.(err.data.productId || productId);
          return;
        }

        onError?.(err.message || 'Could not start checkout. Please try again.');
      }
    },
    [busy, onSuccess, onError]
  );

  return { start, busy };
}
