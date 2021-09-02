const express = require('express');
const router = express.Router();
const { getAllBootcamp, 
        updateBootcamp, 
        deleteBootcamp, 
        createNewBootcamp } = require('../controllers/bootcampController')

router
    .route('/')
    .get(getAllBootcamp)
    .post(createNewBootcamp)

router
    .route('/:id')
    .put(updateBootcamp)
    .delete(deleteBootcamp)

module.exports = router;