const Router = require('express')
const router = new Router();
const controller = require('../controller/db_controller')

router.post('/register', controller.createUser)
router.post('/login', controller.login)
router.get('/images/:nameimage', controller.getImage)

router.post('/sync/:userId', controller.syncronize)

module.exports = router
