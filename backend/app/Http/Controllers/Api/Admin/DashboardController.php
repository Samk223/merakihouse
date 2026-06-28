<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\DashboardResource;
use App\Services\Admin\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Retrieve statistics for the admin dashboard.
     */
    public function index(Request $request): JsonResponse
    {
        $stats = $this->dashboardService->getStats();

        return response()->json((new DashboardResource($stats))->resolve(), 200);
    }
}
