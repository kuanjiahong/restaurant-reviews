import { useRouter } from "next/router";
import { useState } from "react";

import Nav from '../components/Nav';
import styles from '../styles/Home.module.css';

export default function AddRestaurant() {
    const [name, setName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [rating, setRating] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleRestaurant = async (e) => {
        e.preventDefault();

        // reset error and message
        setError('');
        setMessage('');

        // fields check
        if (!name || !cuisine || !rating) return setError('All fields are required');

        // Restaurant structure
        let restaurant = {
            name,
            cuisine,
            rating,
            // published: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Save the restaurant
        let response = await fetch('/api/restaurants', {
            method: 'POST',
            body: JSON.stringify(restaurant),
        });

        // Get the data
        let data = await response.json();
        if (data.success) {
            // Reset the fields
            setName('')
            setCuisine('')
            setRating('')
            // Set the message
            setMessage(data.message);
            return router.push("/");
        } else {
            // Set the error
            return setError(data.message);
        }

    };

    return (
        <div>
            <Nav />
            <div className={styles.container}>
                <form onSubmit={handleRestaurant} className={styles.form}>
                    {error ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.error}>{error}</h3>
                        </div>
                    ) : null}
                    {message ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.message}>{message}</h3>
                        </div>
                    ) : null}
                    <div className={styles.formItem}>
                        <label htmlFor="name">Restaurant Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            placeholder="Name" 
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label htmlFor="cuisine">Cuisine</label>
                        <input 
                            type="text" 
                            name="cuisine" 
                            onChange={(e) => setCuisine(e.target.value)} 
                            value={cuisine} 
                            placeholder="Cuisine"
                        />
                    </div>
                    <div>
                        <label htmlFor="rating">Rating</label>
                        <div onChange={(e) => setRating(e.target.value)}>
                            <input type="radio" value="5" name="rating" />
                            <label htmlFor="rating-5">5</label>
                            <br />
                            <input type="radio" value="4" name="rating" />
                            <label htmlFor="rating-4">4</label>
                            <br />
                            <input type="radio" value="3" name="rating" />
                            <label htmlFor="rating-3">3</label>
                            <br />
                            <input type="radio" value="2" name="rating" />
                            <label htmlFor="rating-2">2</label>
                            <br />
                            <input type="radio" value="1" name="rating" />
                            <label htmlFor="rating-1">1</label>
                        </div>
                    </div>
                    <div className={styles.formItem}>
                        <button type="submit">Add Restaurant</button>
                    </div>
                </form>
            </div>
        </div>
    )

}