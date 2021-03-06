import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as session from 'express-session';
// tslint:disable-next-line: no-var-requires
const flash: any = require('connect-flash');

import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as express from 'express';
import * as methodOverride from 'method-override';
import * as csrf from 'csurf';
import * as passport from 'passport';
import * as connectRedis from 'connect-redis';
import config from '../env';
import * as redis from 'redis';

const RedisStore: connectRedis.RedisStore = connectRedis(session);
const redisClient: redis.RedisClient = redis.createClient();

/**
 * @export
 * @param {express.Application} app
 */
export function configure(app: express.Application): void {
    app.use(methodOverride('_method'));
    app.set('views', `${__dirname}/../../views`);
    app.set('view engine', 'ejs');
    app.use(
        bodyParser.urlencoded({
            extended: false,
        }),
    );
    app.use(bodyParser.json());
    // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
    app.use(cookieParser());
    // added csrf token for request with to use cookie and ignore prime methods for test environment
    process.env.NODE_ENV === 'test'
        ? app.use(
              csrf({
                  cookie: true,
                  ignoreMethods: [
                      'GET',
                      'HEAD',
                      'OPTIONS',
                      'POST',
                      'PUT',
                      'DELETE',
                  ],
              }),
          )
        : app.use(
              csrf({
                  cookie: true,
              }),
          );

    // returns the compression middleware
    app.use(compression());
    // express session for create session
    app.use(
        session({
            secret: config.secret,
            resave: true,
            saveUninitialized: true,
            store: new RedisStore({
                port: config.redis.port,
                host: config.redis.host,
                client: redisClient,
                ttl: 300,
            }),
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    // allow to get flash message in response
    app.use(flash());
    // helps you secure your Express apps by setting various HTTP headers
    app.use(helmet());
    // providing a Connect/Express middleware that
    // can be used to enable CORS with various options
    app.use(cors());
    // cors
    app.use(
        (
            _req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ): void => {
            res.header(
                'Access-Control-Allow-Methods',
                'GET, POST, PUT, DELETE, OPTIONS ',
            );
            res.header('Access-Control-Allow-Credentials', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With,' +
                    ' Content-Type, Accept,' +
                    ' Authorization,' +
                    ' Access-Control-Allow-Credentials',
            );
            next();
        },
    );
}
