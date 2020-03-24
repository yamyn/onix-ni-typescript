import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import AdminModel, { IAdminModel } from '../components/Auth/model';
import { NextFunction, Request, Response } from 'express';

type LocalStrategyType = typeof passportLocal.Strategy;

const LocalStrategy: LocalStrategyType = passportLocal.Strategy;

/**
 * @description
 * determines, which data of the user object should be stored in the session.
 * The result of the serializeUser method is attached to the session
 * as req.session.passport.user = {}
 */
passport.serializeUser(
    (
        admin: {
            id: number;
        },
        done: Function,
    ): void => {
        done(undefined, admin.id);
    },
);

/**
 * @description
 * checks if user exists in database
 * if everything ok, proceed to route
 */
passport.deserializeUser(
    async (id: number, done: Function): Promise<void> => {
        try {
            const admin: IAdminModel = await AdminModel.findOne({ id });

            done(null, admin);
        } catch (error) {
            done(error);
        }
    },
);

/**
 * @description
 * configuring new local strategy
 * and use it in passport
 */
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (
            email: string,
            password: string,
            done: Function,
        ): Promise<void> => {
            try {
                const admin: IAdminModel = await AdminModel.findOne({
                    email: email.toLowerCase(),
                });

                if (!admin) {
                    return done(null, false, {
                        message: `Email ${email} not found.`,
                    });
                }
                console.log(admin);
                const isMatched: boolean = await admin.comparePassword(
                    password,
                );

                if (isMatched) {
                    return done(null, admin);
                }

                return done(null, false, {
                    message: 'Invalid email or password.',
                });
            } catch (error) {
                done(error);
            }
        },
    ),
);

/**
 * @description Login Required middleware.
 */
export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    if (req.isAuthenticated()) {
        console.log('Autorized');
        return next();
    }
    console.log('non autorized');
    res.redirect('/v1/auth/login');
}
