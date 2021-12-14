import Head from 'next/head';

import Nav from "../components/Nav";
import RestaurantCard from "../components/RestaurantCard";
import styles from "../styles/Home.module.css";

export default function Home({ restaurants }) {
    return (
        <div>
            <Head>
                <title>Restaurant Reviews</title>
            </Head>

            <Nav />

            <main>
                <div className={styles.container}>
                    {restaurants.length === 0 ? (
                        <h2>No added restaurants</h2> // if no restaurants
                    ) : ( // else
                        <ul>
                            {restaurants.map((restaurant, i) => (
                                <RestaurantCard restaurant={restaurant} key={i}/>
                            ))}
                        </ul>
                    )}

                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    // Get the current environment
    let dev = process.env.NODE_ENV !== 'production';
    let { DEV_URL, PROD_URL } = process.env;

    // Request restaurants from api
    let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/restaurants`);
    // Extract the data
    let data = await response.json();
    return {
        props: {
            restaurants: data['message'],
        }
    }
}