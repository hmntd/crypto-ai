<?php

namespace App\Http\Controllers;

use App\Models\Cryptocurrency;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FavouriteCryptoController extends Controller
{
    /**
     * Toggle favourite status for a cryptocurrency.
     */
    public function toggle(Request $request, Cryptocurrency $crypto): JsonResponse
    {
        $user = $request->user();

        if (! $user->can_favourite_coins) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to favourite coins.',
            ], Response::HTTP_FORBIDDEN);
        }

        $isFavourite = $user->favouriteCryptos()->where('cryptocurrency_id', $crypto->id)->exists();

        if ($isFavourite) {
            $user->favouriteCryptos()->detach($crypto->id);
            $newStatus = false;
            $message = "{$crypto->name} removed from favourites.";
        } else {
            $user->favouriteCryptos()->attach($crypto->id);
            $newStatus = true;
            $message = "{$crypto->name} added to favourites!";
        }

        return response()->json([
            'success' => true,
            'is_favourite' => $newStatus,
            'message' => $message,
        ]);
    }
}
