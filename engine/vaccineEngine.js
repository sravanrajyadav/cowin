const express = require('express')

const vac = require('../controllers/vaccineController')

const router = express.Router()

// POST /v1/voicera/checkHydD1Slots
router.post('/checkD1Slots', vac.checkD1Slots)
// POST /v1/voicera/checkHydD2Slots
router.post('/checkD2Slots', vac.checkD2Slots)

module.exports = router