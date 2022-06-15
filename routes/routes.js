const Router = require('express')
const router = new Router();
const controller = require('../controller/db_controller')

router.post('/register', controller.createUser)
router.post('/login', controller.login)
router.get('/display', controller.displayUsers)
router.get('/display/:id', controller.displayUser)
<<<<<<< Updated upstream
router.get('/',controller.main)
=======
router.post('/displayPath/:id', controller.displayPath)
router.post('/images/:nameimage', controller.getImage)
>>>>>>> Stashed changes

module.exports = router
