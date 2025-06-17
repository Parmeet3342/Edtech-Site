const express = require('express');
const router = express.Router();

const {
    capturePayment,
    verifySignature,
    sendPaymentSuccessfull
} =require('../controllers/payment');

const {auth ,isStudent} = require('../middlewares/auth');

router.post('/capturePayment',auth,isStudent,capturePayment);
router.post("/verifySignature",auth,isStudent,verifySignature);
router.post("/sendPaymentSuccessfull",auth,isStudent,sendPaymentSuccessfull)

module.exports = router;