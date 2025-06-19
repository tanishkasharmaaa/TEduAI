const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require("../models/User");
require("dotenv").config()

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"/api/auth/google/callback"
},async(accessToken, refreshToken,profile,done)=>{
    const user = await User.findOneAndUpdate(
        {googleId:profile.id},
        {name:profile.displayName,email:profile.emails[0].value},
        {new:true,upsert:true}
    );
    return done(null,user)
}))

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser(async(id, done)=>{
    const user = await User.findById(id);
    done(null,user)
})