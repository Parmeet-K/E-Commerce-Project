const crypto = require("crypto");

const TOKEN_SECRET = process.env.TOKEN_SECRET || "catalog-secret-key";

function createToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyToken(token) {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(encoded).digest("base64url");
  if (expected !== signature) {
    return null;
  }

  return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
}

module.exports = {
  createToken,
  verifyToken,
};
