const crypto = require('crypto')

exports.verifyRequestSignature = (req, res, buf) => {
  const signature = req.headers["x-hub-signature"]

  if (!signature) {
    console.log("Couldn't validate the signature.")
  } else {
    const elements = signature.split("=")
    const signatureHash = elements[1]
    const expectedHash = crypto
      .createHmac("sha1", process.env.APP_SECRET)
      .update(buf)
      .digest("hex")
    if (signatureHash !== expectedHash) {
      throw new Error("Couldn't validate the request signature.")
    }
  }
}
