import { createClient } from 'redis';
import 'dotenv/config';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Successfully connected to Redis!');
    } catch (error) {
        console.error('Could not connect to Redis:', error);
    }
};

connectRedis();

export default redisClient;