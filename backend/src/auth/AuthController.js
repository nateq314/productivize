import express from "express";
import authconfig from "./authconfig";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, function authenticateCB(err, user, info) {
    if (err || !user) {
      console.error(err);
      return res.status(400).json({
        message: "Something is not right",
        user
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(Object.assign({}, user), authconfig.secret);
      return res.json({ id: user.id, token });
    });
  })(req, res);
});

// router.post("/register", async (req, res) => {
//   const hashed_pw = bcrypt.hashSync(req.body.password, 8);
//   const { first_name, last_name } = req.body;
//   try {
//     const user = await User.query().insert({
//       first_name,
//       last_name,
//       hashed_pw
//     });
//     const token = jwt.sign({ id: user.id }, authconfig.secret, {
//       expiresIn: 86400 // expires in 24 hours
//     });
//     res.status(200).send({ auth: true, token });
//   } catch (error) {
//     return res.status(500).send({ error: error.message });
//   }
// });

// router.get("/me", (req, res) => {
//   const token = req.headers["x-access-token"];
//   if (!token)
//     return res.status(401).send({ auth: false, message: "No token provided." });
//   jwt.verify(token, authconfig.secret, async (err, decoded) => {
//     if (err)
//       return res
//         .status(500)
//         .send({ auth: false, message: "Failed to authenticate token." });
//     try {
//       const user = await User.query()
//         .select("id", "first_name", "last_name", "created_at", "updated_at")
//         .findById(decoded.id);
//       if (!user) return res.status(404).send("No user found.");
//       res.status(200).send(user);
//     } catch (error) {
//       return res.status(500).send({ error: error.message });
//     }
//   });
// });

export default router;
