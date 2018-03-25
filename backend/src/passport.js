import bcrypt from "bcryptjs";
import User from "./models/user";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt as ExtractJWT } from "passport-jwt";
import authconfig from "./auth/authconfig";

const passport = require("passport");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, cb) => {
      try {
        const user = await User.query()
          .select("id", "email", "first_name", "last_name", "created_at", "updated_at", "hashed_pw")
          .findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.hashed_pw)) {
          return cb(null, false, { message: "Incorrect email or password" });
        }
        return cb(null, user, { message: "Logged in successfully" });
      } catch (error) {
        console.error(error);
        return cb(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: authconfig.secret
    },
    async function verify(jwtPayload, cb) {
      // Find the user in db if needed. This functionality may be omitted if you store everything
      // you'll need in JWT payload.
      try {
        const user = await User.query().findById(jwtPayload.id);
        if (user) {
          return cb(null, user);
        }
      } catch (error) {
        return cb(error);
      }
    }
  )
);
