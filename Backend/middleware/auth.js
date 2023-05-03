const firebaseAdmin = require("firebase-admin");

const authenticate = async (req, res, next) => {
  const sessionCookie = req.cookies.user_session;
  
  try {
    if (!sessionCookie) {
      throw new Error("Cookie not found");
    }
    const decodedCookie = await firebaseAdmin.auth().verifySessionCookie(sessionCookie,true);
    req.uid = decodedCookie.uid;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed!", error });
  }
};

module.exports = { authenticate };
