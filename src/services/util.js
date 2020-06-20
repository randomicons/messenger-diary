const axios = require("axios")

exports.callSendAPI = (senderPsid, response) => {
  // Construct the message body
  const requestBody = {
    recipient: {
      id: senderPsid
    },
    message: response
  }

  // Send the HTTP request to the Messenger Platform
  console.log("used callSend")
  axios.post(
    "https://graph.facebook.com/v2.6/me/messages",
    requestBody
    , {params: {access_token: process.env.PAGE_ACCESS_TOKEN}}
  ).then(res => console.log("sent reply"))
    .catch(err => console.log("failed sending reply", JSON.stringify(err)))
}

exports.mongoDone = function (error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log("db command success")
  }
}
