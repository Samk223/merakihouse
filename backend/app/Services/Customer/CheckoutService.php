<?php

namespace App\Services\Customer;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use App\Services\Shared\OrderNumberService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    protected OrderNumberService $orderNumberService;

    public function __construct(OrderNumberService $orderNumberService)
    {
        $this->orderNumberService = $orderNumberService;
    }
    /**
     * Perform the complete checkout workflow for the user.
     *
     * @throws ValidationException
     */
    public function checkout(User $user, ?int $addressId): Order
    {
        // 1. Load Cart & verify not empty
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart || $cart->cartItems()->count() === 0) {
            throw ValidationException::withMessages([
                'cart' => ['Your shopping cart is empty.'],
            ]);
        }

        $cartItems = $cart->cartItems()->with('product')->get();

        // 2. Validate products exists and stock availability
        foreach ($cartItems as $item) {
            $product = $item->product;

            if (!$product || !$product->is_active) {
                throw ValidationException::withMessages([
                    'cart' => ["The product '{$item->product->name}' is no longer active or available."],
                ]);
            }

            if ($product->track_inventory && $item->quantity > $product->stock) {
                throw ValidationException::withMessages([
                    'quantity' => ["Insufficient stock for product '{$product->name}'. Only {$product->stock} available in stock."],
                ]);
            }
        }

        // 3. Resolve shipping address
        $address = null;

        if ($addressId) {
            $address = Address::where('id', $addressId)->first();

            if (!$address) {
                throw ValidationException::withMessages([
                    'address_id' => ['The specified address does not exist.'],
                ]);
            }

            if ($address->user_id !== $user->id) {
                throw ValidationException::withMessages([
                    'address_id' => ['The specified address does not belong to you.'],
                ]);
            }
        } else {
            // Find default address
            $address = Address::where('user_id', $user->id)->where('is_default', true)->first();

            // Fallback to any address if no default is explicitly marked
            if (!$address) {
                $address = Address::where('user_id', $user->id)->first();
            }
        }

        if (!$address) {
            throw ValidationException::withMessages([
                'address_id' => ['Please add a shipping address before completing checkout.'],
            ]);
        }

        // 4. Calculate Subtotal, Shipping, and Total
        $subtotal = 0.00;
        foreach ($cartItems as $item) {
            $subtotal += (float) ($item->product->price * $item->quantity);
        }

        $shipping = 0.00;
        if ($subtotal > 0) {
            if ($subtotal < (float) config('commerce.free_shipping_above')) {
                $shipping = (float) config('commerce.shipping_charge');
            } else {
                $shipping = 0.00;
            }
        }

        $total = $subtotal + $shipping;

        // 5. Begin Database Transaction
        return DB::transaction(function () use ($user, $cart, $cartItems, $address, $subtotal, $shipping, $total) {
            // Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $this->orderNumberService->generateNextOrderNumber(),
                'status' => config('commerce.default_order_status'),
                'payment_status' => config('commerce.default_payment_status'),
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $total,
                'shipping_address_snapshot' => [
                    'full_name' => $address->full_name,
                    'phone' => $address->phone,
                    'address_line_1' => $address->address_line_1,
                    'address_line_2' => $address->address_line_2,
                    'city' => $address->city,
                    'state' => $address->state,
                    'postal_code' => $address->postal_code,
                    'country' => $address->country ?? config('commerce.default_country'),
                ],
            ]);

            // Create OrderItems and reduce product inventory
            foreach ($cartItems as $item) {
                $product = $item->product;

                // Create OrderItem copy of historical price
                $order->orderItems()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $product->price,
                ]);

                // Reduce inventory stock
                if ($product->track_inventory) {
                    $newStock = $product->stock - $item->quantity;

                    if ($newStock < 0) {
                        throw new \Exception("Stock for '{$product->name}' became negative during checkout transaction.");
                    }

                    $product->update(['stock' => $newStock]);
                }
            }

            // Clear CartItems
            $cart->cartItems()->delete();

            return $order;
        });
    }
}
