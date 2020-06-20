require('dotenv').config()
const path = require("path")
const express = require("express")
const {urlencoded, json} = require("body-parser")
const mongoose = require('mongoose')
const {setProfile} = require("./profile")
const {setupWebviewRoutes} = require("./webviewRoutes")
const {setupRoutes} = require("./routes")
const {verifyRequestSignature} = require("./middleware")

const app = express()
app.use(urlencoded({extended: true}))
app.use(json({verify: verifyRequestSignature}))
app.use(express.static(path.join(path.resolve(), "public")))
app.set("view engine", "ejs")

setupRoutes(app)
setupWebviewRoutes(app)

// Respond with index file when a GET request is made to the homepage
// app.get("/", function (_req, res) {
//   res.render("index")
// })


// Set up your App's Messenger Profile
// app.get("/profile", (req, res) => {
//   let token = req.query["verify_token"]
//   let mode = req.query["mode"]
//
//   if (!process.env.APP_URL.startsWith("https://")) {
//     res.status(200).send("ERROR - Need a proper API_URL in the .env file")
//   }
//   let Profile = require("./services/profile.js")
//   Profile = new Profile()
//
//   // Checks if a token and mode is in the query string of the request
//   if (mode && token) {
//     if (token === config.verifyToken) {
//       if (mode == "webhook" || mode == "all") {
//         Profile.setWebhook()
//         res.write(
//           `<p>Set app ${config.appId} call to ${config.webhookUrl}</p>`
//         )
//       }
//       if (mode == "profile" || mode == "all") {
//         Profile.setThread()
//         res.write(`<p>Set Messenger Profile of Page ${config.pageId}</p>`)
//       }
//       if (mode == "personas" || mode == "all") {
//         Profile.setPersonas()
//         res.write(`<p>Set Personas for ${config.appId}</p>`)
//         res.write(
//           "<p>To persist the personas, add the following variables \
//           to your environment variables:</p>"
//         )
//         res.write("<ul>")
//         res.write(`<li>PERSONA_BILLING = ${config.personaBilling.id}</li>`)
//         res.write(`<li>PERSONA_CARE = ${config.personaCare.id}</li>`)
//         res.write(`<li>PERSONA_ORDER = ${config.personaOrder.id}</li>`)
//         res.write(`<li>PERSONA_SALES = ${config.personaSales.id}</li>`)
//         res.write("</ul>")
//       }
//       if (mode == "nlp" || mode == "all") {
//         GraphAPi.callNLPConfigsAPI()
//         res.write(`<p>Enable Built-in NLP for Page ${config.pageId}</p>`)
//       }
//       if (mode == "domains" || mode == "all") {
//         Profile.setWhitelistedDomains()
//         res.write(`<p>Whitelisting domains: ${config.whitelistedDomains}</p>`)
//       }
//       if (mode == "private-reply") {
//         Profile.setPageFeedWebhook()
//         res.write(`<p>Set Page Feed Webhook for Private Replies.</p>`)
//       }
//       res.status(200).end()
//     } else {
//       // Responds with '403 Forbidden' if verify tokens do not match
//       res.sendStatus(403)
//     }
//   } else {
//     // Returns a '404 Not Found' if mode or token are missing
//     res.sendStatus(404)
//   }
// })

const mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// setProfile().then(r => console.log("profile set"))

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port)
})

if (process.env.PAGE_ID) {
  console.log("Test your app by messaging:")
  console.log("https://m.me/" + process.env.PAGE_ID)
}

