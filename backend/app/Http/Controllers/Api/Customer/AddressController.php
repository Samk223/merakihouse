<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\StoreAddressRequest;
use App\Http\Requests\Api\Customer\UpdateAddressRequest;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    /**
     * Display a listing of the user's addresses.
     */
    public function index(Request $request): JsonResponse
    {
        $addresses = Address::where('user_id', $request->user()->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Addresses retrieved successfully.',
            'data' => $addresses,
        ], 200);
    }

    /**
     * Store a newly created address (automatic default promotion for first address).
     */
    public function store(StoreAddressRequest $request): JsonResponse
    {
        $userId = $request->user()->id;
        $isFirst = !Address::where('user_id', $userId)->exists();
        
        $data = $request->validated();
        
        if ($isFirst) {
            $data['is_default'] = true;
        }

        if (isset($data['is_default']) && $data['is_default'] == true) {
            $this->unsetOtherDefaults($userId);
        } else {
            $data['is_default'] = false;
        }

        $address = $request->user()->addresses()->create($data);

        return response()->json([
            'success' => true,
            'message' => 'Address created successfully.',
            'data' => $address,
        ], 201);
    }

    /**
     * Update the specified address.
     */
    public function update(UpdateAddressRequest $request, int $id): JsonResponse
    {
        $address = Address::find($id);

        if (! $address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found.',
            ], 404);
        }

        // Ownership check
        if ($address->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $data = $request->validated();

        if (isset($data['is_default']) && $data['is_default'] == true) {
            $this->unsetOtherDefaults($request->user()->id, $address->id);
        }

        $address->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully.',
            'data' => $address,
        ], 200);
    }

    /**
     * Remove the specified address (promotes oldest remaining if default is deleted).
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $address = Address::find($id);

        if (! $address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found.',
            ], 404);
        }

        // Ownership check
        if ($address->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $wasDefault = $address->is_default;
        $address->delete();

        // If the deleted address was default, promote oldest remaining address
        if ($wasDefault) {
            $oldestRemainingAddress = Address::where('user_id', $request->user()->id)
                ->orderBy('created_at', 'asc')
                ->first();

            if ($oldestRemainingAddress) {
                $oldestRemainingAddress->update(['is_default' => true]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Address deleted successfully.',
        ], 200);
    }

    /**
     * Mark the specified address as the default address.
     */
    public function setDefault(Request $request, int $id): JsonResponse
    {
        $address = Address::find($id);

        if (! $address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found.',
            ], 404);
        }

        // Ownership check
        if ($address->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $this->unsetOtherDefaults($request->user()->id, $address->id);
        $address->update(['is_default' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Default address updated successfully.',
            'data' => $address,
        ], 200);
    }

    /**
     * Helper to unset is_default flag from other addresses of the user.
     */
    private function unsetOtherDefaults(int $userId, ?int $exceptAddressId = null): void
    {
        $query = Address::where('user_id', $userId)->where('is_default', true);
        
        if ($exceptAddressId) {
            $query->where('id', '!=', $exceptAddressId);
        }

        $query->update(['is_default' => false]);
    }
}
