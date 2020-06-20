const {getReportPermission} = require("./postback")
const {showAnalysis} = require("./postback")
const {showEntries} = require("./postback")
const {saveEntry} = require("./postback")
const axios = require('axios')
const schedule = require('node-schedule')

const postbackConst = {
  saveEntry: "SAVE_ENTRY",
  discardEntry: "DELETE_ENTRY",
  getStarted: "GET_STARTED",
  viewEntries: "VIEW_ENTRIES",
  viewAnalysis: "VIEW_ANALYSIS",
  weeklyReport: "WEEKLY_REPORT"

}
exports.postbackConst = postbackConst
const {callSendAPI} = require('./util')

exports.handleMessage = (senderId, receivedMessage) => {
  let response
  const payload = receivedMessage.text.toLowerCase()
  if (payload === 'view diary') {
    response = showEntries(senderId)
  } else if (payload === 'view analysis') {
    response = showAnalysis(senderId)
  } else if (payload === 'weekly report') {
    response = getReportPermission(senderId)
  } else {
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "Do you want to save this entry?",
          "buttons": [
            {
              "type": "postback",
              "title": "Yes",
              "payload": `${postbackConst.saveEntry}_${receivedMessage.text}`,
            },
            {
              "type": "postback",
              "title": "No",
              "payload": postbackConst.discardEntry,
            },
          ]
        }
      }
    }
  }
  callSendAPI(senderId, response)
}


exports.handleOptin = (senderId, optin) => {
  if (optin.payload.startsWith("ONE_TIME_REPORT")) {
    const date = new Date()
    date.setMilliseconds(date.getMilliseconds() + 2000)
    schedule.scheduleJob(date, function () {
      const req = {
        "recipient": {
          "one_time_notif_token": optin.one_time_notif_token
        },
        "message": {
          "text": `${process.env.APP_URL}/user/${senderId}/analysis/week`
        }
      }
      axios.post("https://graph.facebook.com/v7.0/me/messages", req,
        {params: {access_token: process.env.PAGE_ACCESS_TOKEN}})
        .then(res => console.log("sent weekly report"))
        .catch(err => console.log(err))
    })
  }
}

exports.handlePostback = (senderId, postback) => {
  let response
  const payload = postback.payload

  if (payload.startsWith(postbackConst.saveEntry)) {
    response = {"text": "Saved!"}
    saveEntry(payload.slice(postbackConst.saveEntry.length + 1), senderId)
  } else if (payload === postbackConst.discardEntry) {
    response = {"text": "Discarded!"}
  } else if (payload === postbackConst.getStarted) {
    response = {text: "Send messages to me to save your diary entries"}
  } else if (payload === postbackConst.viewEntries) {
    response = showEntries(senderId)
  } else if (payload === postbackConst.viewAnalysis) {
    response = showAnalysis(senderId)
  } else if (payload === postbackConst.weeklyReport) {
    response = getReportPermission(senderId)
  } else {
    console.log(payload, " payload didn't match")
  }
  callSendAPI(senderId, response)
}

