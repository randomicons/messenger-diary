const {handleOptin} = require("./services")
const {handleMessage, handlePostback} = require("./services/")
const {setProfile} = require("./profile")

exports.setupRoutes = (app) => {

// Adds support for GET requests to our webhook
  app.get("/webhook", (req, res) => {
    // Parse the query params
    let mode = req.query["hub.mode"]
    let token = req.query["hub.verify_token"]
    let challenge = req.query["hub.challenge"]

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log("WEBHOOK_VERIFIED")
        res.status(200).send(challenge)
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403)
      }
    }
  })

// Creates the endpoint for your webhook
  app.post("/webhook", (req, res) => {
    let body = req.body

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {
        // Gets the message. entry.messaging is an array, but
        // will only ever contain one message, so we get index 0
        let webhookEvent = entry.messaging[0]
        let senderPsid = webhookEvent.sender.id
        if (webhookEvent.message) {
          handleMessage(senderPsid, webhookEvent.message)
        } else if (webhookEvent.postback) {
          handlePostback(senderPsid, webhookEvent.postback)
        } else if (webhookEvent.optin) {
          handleOptin(senderPsid, webhookEvent.optin)
        }
        console.log(webhookEvent)
      })

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED')
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404)
    }
  })


}
