/**
 * @interface DatabaseParams
 * Defines the shape of the database configuration object.
 * This interface ensures type safety when reading environment variables for database connection.
 */
export interface DatabaseParams {
    /**
     * Database username.
     * Required for connecting to the database.
     */
    USER: string;
    /**
     * Database password.
     * Can be empty or undefined if the database allows passwordless connections.
     */
    PASSWORD: string;
    /**
     * Database name.
     * The name of the database to connect to.
     */
    NAME: string;
    /**
     * Database host.
     * Can be an IP address, hostname, or 'localhost'.
     */
    HOST: string;
    /**
     * Database port.
     * Must be a number. For example, 5432 for PostgreSQL, 3306 for MySQL.
     */
    PORT: number;
}
