const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            fullName: profile.displayName || "Google User",
            email: profile.emails[0].value,
            avatar: profile.photos?.[0]?.value || "",
            password: "google_oauth_user",
            role: "user",
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        return cb(null, user);
      } catch (error) {
        console.error("Google Auth Error:", error);
        return cb(error, null);
      }
    }
  )
);

module.exports = passport;
