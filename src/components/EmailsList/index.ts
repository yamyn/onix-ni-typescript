const EmailsListService = require('./service');

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function findAll(req, res, next) {
    try {
        const emails = await EmailsListService.findAll();

        res.status(200).json({ emails });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });

        next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function create(req, res, next) {
    try {
        EmailsListService.create(req.body);
        res.status(200).json({ message: 'emails was saved' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });

        next(error);
    }
}

module.exports = {
    findAll,
    create,
};
