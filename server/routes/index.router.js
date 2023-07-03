const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

const userCtrl = require('../controllers/user.controller');
const planCtrl = require('../controllers/plan.controller');
const challengeCtrl = require('../controllers/challenge.controller');
const pictureCtrl = require('../controllers/picture.controller');
const rankingCtrl = require('../controllers/ranking.controller');
const salesCtrl = require('../controllers/sales.controller');

const jwtHelper = require('../config/jwtHelper');

// signup & login
router.post('/signup', userCtrl.signup);
router.post('/authenticate', userCtrl.authenticate);

// user info
router.get('/getUserInfo', jwtHelper.verifyJwtToken, userCtrl.getUserInfo);

// workout plans
router.get('/getUserPlans', jwtHelper.verifyJwtToken, planCtrl.getUserPlans);
router.get('/getPublicPlans', jwtHelper.verifyJwtToken, planCtrl.getPublicPlans);
router.get('/getCurrentPlans', jwtHelper.verifyJwtToken, userCtrl.getCurrentPlans);

router.post('/savePlan', jwtHelper.verifyJwtToken, planCtrl.savePlan);
router.post('/buyPlan', jwtHelper.verifyJwtToken, userCtrl.buyPlan);
router.post('/changePlanPublicity', jwtHelper.verifyJwtToken, planCtrl.changePlanPublicity);
router.post('/selectCurrentPlan/:id', jwtHelper.verifyJwtToken, userCtrl.selectCurrentPlan);

router.delete('/removeCurrentPlan/:id', jwtHelper.verifyJwtToken, userCtrl.removeCurrentPlan);
router.delete('/deletePlan/:id', jwtHelper.verifyJwtToken, planCtrl.deletePlan);

// sales
router.get('/getSales', jwtHelper.verifyJwtToken, salesCtrl.getSales);

// milestones
router.post('/addMilestone', jwtHelper.verifyJwtToken, userCtrl.addMilestone);
router.delete('/deleteMilestone/:id', jwtHelper.verifyJwtToken, userCtrl.deleteMilestone);

// challenges & ranking
router.get('/getChallenges', jwtHelper.verifyJwtToken, challengeCtrl.getChallenges);
router.post('/addChallenge', jwtHelper.verifyJwtToken, challengeCtrl.addChallenge);
router.post('/finishChallenge', jwtHelper.verifyJwtToken, userCtrl.finishChallenge);

router.get('/getRankings', jwtHelper.verifyJwtToken, rankingCtrl.getRankings);
router.post('/updateRanking', jwtHelper.verifyJwtToken, rankingCtrl.updateRanking);

// pictures
router.get('/pictures', jwtHelper.verifyJwtToken, pictureCtrl.getPictures);
router.get('/pictures/:id', pictureCtrl.getPicture);
router.post('/uploadPicture', jwtHelper.verifyJwtToken, upload.single('file'), pictureCtrl.uploadPicture);
router.delete('/pictures/:id', jwtHelper.verifyJwtToken, pictureCtrl.deletePicture);


module.exports = router;