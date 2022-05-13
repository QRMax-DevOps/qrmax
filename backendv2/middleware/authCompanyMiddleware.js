const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const CompanyAccount = require('../models/companyAccountModel')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(',')[0]
	  token = token.split(' ')[1]
	  
	  console.log("Debug: Token === ",token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      //const decoded = jwt.verify(token, 'zzz4564')

      // Get company from the token
      req.company = await CompanyAccount.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }