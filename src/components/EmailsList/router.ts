const { Router } = require('express');
const EmailListComponent = require('../EmailsList');

const router = Router();

/**
 * Route serving list of emails.
 * @name /v1/emails
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/', EmailListComponent.findAll);

/**
 * Route serving a new emailsList
 * @name /v1/emails
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/', EmailListComponent.create);

module.exports = router;
