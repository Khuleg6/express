import fs from "fs";
import jwt from "jsonwebtoken";

const userData = fs.readFileSync("./users.json", "utf-8");
let users = JSON.parse(userData);

export const auth = (req, res, next) => {
  const rawToken = req.headers.authorization;
  if (!rawToken.startsWith("Bearer")) {
    return res.status(401).send({ message: "Invalid Token" });
  }
  const token = rawToken.split(" ")[1];

  let payload = null;
  try {
    payload = jwt.verify(token, "MySecret");
  } catch (e) {
    return res.status(401).send({ message: "Invalid Token" });
  }
  const existingUser = users.find((user) => user.id === payload.id);
  req.user = existingUser;
  return next();
};
