import * as dotenv from 'dotenv';

dotenv.config();

interface IConfig {
    port: string | number;
    database: {
        MONGODB_URI: string;
        MONGODB_DB_MAIN: string;
    };
    dropboxToken: string;
    secret: string;
    redis: {
        port: number;
        host: string;
    };
}

const NODE_ENV: string = process.env.NODE_ENV || 'development';

const development: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
        MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || 'users_ts_db',
    },
    dropboxToken: process.env.DROPBOX_TOKEN || 'DropboxKey',
    secret: process.env.SECRET || '@CANS',
    redis: {
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        host: process.env.REDIS_HOST || '127.0.0.1',
    },
};

const production: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://production_uri/',
        MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || 'users_ts_db',
    },
    dropboxToken: process.env.DROPBOX_TOKEN || 'DropboxKey',
    secret: process.env.SECRET || '@CANS',
    redis: {
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        host: process.env.REDIS_HOST || '127.0.0.1',
    },
};

const test: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        MONGODB_DB_MAIN: 'test_users_db',
    },
    dropboxToken: process.env.DROPBOX_TOKEN || 'DropboxKey',
    secret: process.env.SECRET || '@CANS',
    redis: {
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        host: process.env.REDIS_HOST || '127.0.0.1',
    },
};

const config: {
    [name: string]: IConfig;
} = {
    test,
    development,
    production,
};

export default config[NODE_ENV];
