const passport = require('passport');
const { execute } = require('../dbConnection/executeQuery');
require("dotenv").config();

let JwtStrategy = require('passport-jwt').Strategy;

const getToken = (req) => {
  return req.cookies.token;
}

let opts = {};

opts.jwtFromRequest = getToken;
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts,async function(jwt_payload,done){
  try{
    let query2 =`SELECT * FROM users WHERE user_id=?;`;
    let user = await execute(query2, [jwt_payload.id]);
    if (user) {
      return done(null, user);
    }
    else {
      return done(null, false);
    }
  }
  catch (error) {
    return done(error);
  }
}));