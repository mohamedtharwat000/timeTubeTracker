import { createClient } from 'redis';
import { log } from 'hlputils';

/**
 * Class representing a Redis client.
 */
class RedisClient {
  private client;

  /**
   * Creates an instance of RedisClient.
   */
  constructor() {
    this.client = createClient();
    this.connect();
  }

  /**
   * Connects to the Redis database.
   */
  private async connect() {
    this.client
      .on('connect', () => log('Connected to Redis.'))
      .on('ready', () => log('Redis connection ready.'))
      .on('error', (err) => log(`Redis Client Error: ${err}`))
      .connect();
  }

  /**
   * Checks if the Redis client is connected.
   * @returns {boolean} True if the client is connected, false otherwise.
   */
  public connected(): boolean {
    return this.client.connected;
  }

  /**
   * Sets a key-value pair in Redis with an optional expiration time.
   * @param key - The key to set.
   * @param value - The value to set.
   * @param expiresIn - Optional expiration time in seconds.
   * @returns Promise<void>
   */
  public async set(
    key: string,
    value: string,
    expiresIn?: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (expiresIn) {
        this.client.set(key, value, 'EX', expiresIn, (err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        this.client.set(key, value, (err) => {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  }

  /**
   * Gets the value associated with a key from Redis.
   * @param key - The key to get the value for.
   * @returns Promise<string | null>
   */
  public async get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      });
    });
  }

  /**
   * Deletes a key from Redis.
   * @param key - The key to delete.
   * @returns Promise<number>
   */
  public async del(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, numDeleted) => {
        if (err) reject(err);
        else resolve(numDeleted);
      });
    });
  }

  /**
   * Closes the Redis connection.
   */
  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.quit((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

const redisClient = new RedisClient();

export default redisClient;
