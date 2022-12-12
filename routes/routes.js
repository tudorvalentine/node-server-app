const Router = require('express')
const router = new Router();
const controller = require('../controller/db_controller')

router.get('/', controller.index)
router.post('/register', controller.createUser)
router.post('/login', controller.login)
router.get('/images/:nameimage', controller.getImage)
router.get('/pdf/:pdf', controller.getPdf)

router.post('/sync/:userId', controller.syncronize)

module.exports = router