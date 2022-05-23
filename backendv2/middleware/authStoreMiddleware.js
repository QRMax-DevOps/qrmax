const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const StoreAccount = require('../models/storeAccountModel')

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

      // Verify token
      // eslint-disable-next-line no-undef
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      //const decoded = jwt.verify(token, 'zzz4564')

      // Get company from the token
      req.store = await StoreAccount.findById(decoded.id).select('-password')
      if(!req.store){
        throw new Error('Store account not found');
      }

      next()
    } catch (error) {
      console.log(error)
      res.status(401).json({status:"fail",cause:"Not authorized, check bearer token"});
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401).json({status:"fail",cause:"Not authorized, no token"});
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }
