const express=require('express');
const router=express.Router();

const jobsController=require('../controllers/jobs');

router.get('/',jobsController.getAllJobs);
router.get('/:id',jobsController.getJob);
router.post('/',jobsController.createJob);
router.patch('/:id',jobsController.updateJob);
router.delete('/:id',jobsController.deleteJob);

module.exports=router;