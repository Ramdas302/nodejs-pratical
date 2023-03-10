const { check } = require('express-validator');
user_signupvalidation = 
    [
        check('first_name').isLength({min:3,max:15}).withMessage('first name should be minimum 3 characters and maximum 15 characters.').not().isEmpty().withMessage('first name is require'),
        check('last_name').isLength({min:3,max:15}).withMessage('last name should be minimum 3 characters and maximum 15 characters.').not().isEmpty().withMessage('last name is require'),
        check('email').not().isEmpty().withMessage('email is require').matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).withMessage('Please include a valid email'),
        check('password').isLength({ min: 4 }).withMessage('password must be at least 4 characters')
    ],
     
module.exports={
    user_signupvalidation
    
}