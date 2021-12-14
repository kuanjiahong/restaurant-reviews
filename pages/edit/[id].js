import { useRouter } from "next/router";
import { useState } from "react";

import Nav from "../../components/Nav";
import styles from "../../styles/Home.module.css";

import { connectToDatabase } from "../../lib/mongodb";
const ObjectId = require("mongodb").ObjectId

export default function UpdateRestaurant({ restaurant }) {
    const [name, setName] = useState(restaurant[0].name);
    const [cuisine, setCuisine] = useState(restaurant[0].cuisine);
    const [rating, setRating] = useState(restaurant[0].rating);
    const [id, setId] = useState(restaurant[0]._id);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    // const [id, setId] = useState(router.query);
    const handleRestaurant = async (e) => {
        e.preventDefault();

        // Reset error and message
        setError('');
        setMessage('');

        // fields check
        if (!name || !cuisine || !rating) return setError('All fields are required')

        // Restaurant structure 
        let restaurant = {
            id: id,
            name,
            cuisine,
            rating,
        }

        // Save the restaurant
        let response = await fetch('/api/restaurants', {
            method: 'PUT',
            body: JSON.stringify(restaurant),
        });

        // Get the data
        let data = await response.json();
        if (data.success) {
            setMessage(data.message);
            // Return to home page
            return router.push("/");
        } else {
            // Set the error
            return setError(data.message);
        }

    }
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
                        <input type="radio" value="5" name="rating" checked={rating=== "5"}/>
                        <label htmlFor="rating-5">5</label>
                        <br />
                        <input type="radio" value="4" name="rating" checked={rating=== "4"}/>
                        <label htmlFor="rating-4">4</label>
                        <br />
                        <input type="radio" value="3" name="rating" checked={rating=== "3"}/>
                        <label htmlFor="rating-3">3</label>
                        <br />
                        <input type="radio" value="2" name="rating" checked={rating=== "2"}/>
                        <label htmlFor="rating-2">2</label>
                        <br />
                        <input type="radio" value="1" name="rating" checked={rating=== "1"}/>
                        <label htmlFor="rating-1">1</label>
                    </div>
                </div>
                <div className={styles.formItem}>
                    <button type="submit">Update Restaurant</button>
                </div>
            </form>
        </div>
    </div>
    )
}

export async function getServerSideProps(ctx) {
    const restaurantId = ObjectId(ctx.params.id);
    try {
        let { db } = await connectToDatabase();
        let restaurant = await db.collection('restaurants').find({ _id: restaurantId }).toArray();
        // Return the restaurants
        console.log(restaurant)
        return {
            props: {
                restaurant: JSON.parse(JSON.stringify(restaurant)),
            }
        }
    } catch (error) {
        // Return the error
        return {
            props: {
                restaurant: new Error(error).message,
            }
        }

    } 
    
}