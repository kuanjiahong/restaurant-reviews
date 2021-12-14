import { connectToDatabase } from '../../lib/mongodb'

const ObjectId = require("mongodb").ObjectId

async function getRestaurant(req, res) {
    try {
        // Connect to the database
        let { db } = await connectToDatabase();
        // Fetch the restaurants in descending order of rating
        let restaurants = await db.collection('restaurants').find({}).sort({ rating: -1 }).toArray();
        // Return the restaurants
        return res.json({
            message: JSON.parse(JSON.stringify(restaurants)),
            success: true,
        });
    } catch (error) {
        // Return the error
        return res.json({
            message: new Error(error).message,
            success:false,
        });
    }
}

async function addRestaurant(req, res) {
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // Add the restaurant
        await db.collection('restaurants').insertOne(JSON.parse(req.body));
        // Return a message
        return res.json({
            message: 'Restaurant added successfully',
            success: true,
        });
    } catch (error) {
        // Return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        })
    }
}

async function updateRestaurant(req, res) {
    try {
        // Connect to the database
        let { db } = await connectToDatabase();
        const restaurant = JSON.parse(req.body);
        // Update the restaurant
        await db.collection('restaurants').updateOne(
            {
                _id: ObjectId(restaurant.id)
            },
            { $set: 
                { updatedAt: new Date().toISOString(), name: restaurant.name, cuisine: restaurant.cuisine, rating: restaurant.rating } }
        );

        // Return a message
        return res.json({
            message: 'Restaurant updated successfully',
            success: true,
        });
    } catch (error) {
        // Return an error
        return res.json({
            message: new Error(error).message,
            success:false,
        });
    }
}

async function deleteRestaurant(req, res) {
    try {
        // Connect to the database
        let { db } = await connectToDatabase();

        // Deleting the restaurant
        await db.collection('restaurants').deleteOne({
            _id: new ObjectId(req.body),
        });

        // Returning a message
        return res.json({
            message: 'Restaurant deleted successfully',
            success: true,
        })
    } catch (error) {
        // Returning an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

export default async function handler(req, res) {
    // switch the method
    switch(req.method) {
        case "GET": {
            return getRestaurant(req, res)
        }

        case "POST": {
            return addRestaurant(req, res)
        }

        case "PUT": {
            return updateRestaurant(req, res)
        }

        case "DELETE": {
            return deleteRestaurant(req, res)
        }
    }
}