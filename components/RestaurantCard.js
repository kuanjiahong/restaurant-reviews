import { useState } from "react";
import { useRouter } from "next/router";

import Link from "next/link";

export default function RestaurantCard({ restaurant }) {
    // const [publishing, setPublishing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    // Delete Restaurant
    const deleteRestaurant = async (restaurantId) => {
        // Change the deleting state
        setDeleting(true);

        try {
            // Delete restaurant
            await fetch('api/restaurants', {
                method: 'DELETE',
                body: restaurantId,
            });

            // Reset the deleting state
            setDeleting(false);

            // Reload the page
            return router.push(router.asPath);
        } catch (error) {
            // Stop deleting state
            setDeleting(false);
        }
    };

    return (
        <>
            <li>
                <h3>Name: {restaurant.name}</h3>
                <p>Cuisine: {restaurant.cuisine}</p>
                <p>Rating: {restaurant.rating}</p>
                <small>Created: {new Date(restaurant.createdAt).toLocaleDateString()}</small>
                <br />
                <small>Last updated: {new Date(restaurant.updatedAt).toLocaleDateString()}</small>
                <br />
                <Link href={`/edit/${restaurant._id}`}>
                    <button type="button">Edit</button>
                </Link>
                <button type="button" onClick={() => deleteRestaurant(restaurant['_id'])}>
                    {deleting ? 'Deleting' : 'Delete'}
                </button>
            </li>
        </>
    )
}