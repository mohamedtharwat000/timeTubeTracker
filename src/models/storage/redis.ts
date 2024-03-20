import * as redis from 'redis';

type RedisClientType = ReturnType<typeof redis.createClient>;

const redisPort = process.env.redisPort || '6379';
const redisHost = process.env.redisHost || '127.0.0.1';


/**
 * Redis Class that create a Redis Client
 */
class RedisClient {
    public client: RedisClientType;

    /**
     * Initialized a Redis Client but without connecting to it
     *
     */
    constructor() {
        this.client = redis.createClient({
            socket: {
                host: redisHost,
                port: parseInt(redisPort)
            }
        });

        this.client.on('error', (err) => {
            console.error((err as redis.ErrorReply).message);
        });
    }

    /**
     * Checks if Redis Client is ready
     *
     * @returns {boolean} true if ready, false otherwise.
     */
    public isAlive(): boolean {
        return this.client.isReady;
    }

    /**
     * Connect to the redis client
     *
     * @async
     */
    public async connect() {
        await this.client.connect();
    }
}

const redisClient = new RedisClient();

export default redisClient;
