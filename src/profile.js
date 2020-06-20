const axios = require("axios")
const {postbackConst} = require("./services")

const profile = {
  "whitelisted_domains": [
    process.env.APP_URL,
  ],
  greeting: [
    {
      locale: "default",
      text: "Record and analyze your thoughts."
    }
  ],
  get_started: {
    payload: postbackConst.getStarted
  },
  persistent_menu: [
    {
      "locale": "default",
      "composer_input_disabled": false,
      "call_to_actions": [
        {
          "type": "postback",
          "title": "View Diary",
          "payload": postbackConst.viewEntries
        },
        {
          "type": "postback",
          "title": "View Analysis",
          "payload": postbackConst.viewAnalysis
        },
        {
          "type": "postback",
          "title": "Weekly Report",
          "payload": postbackConst.weeklyReport
        },
        // {
        //   "type": "web_url",
        //   "title": "View Analysis",
        //   "url": process.env.APP_URL + "/user/" + 3177297955671237,
        //   "messenger_extensions": true,
        //   "webview_height_ratio": "full"
        // }
      ]
    }
  ]
}

exports.setProfile = () => {
  return axios.post("https://graph.facebook.com/v2.6/me/messenger_profile", profile, {
    params: {access_token: process.env.PAGE_ACCESS_TOKEN}
  })
}

// setProfile()
//   .then(res => console.log("set profile success"))
//   .catch(err => console.error(err))
