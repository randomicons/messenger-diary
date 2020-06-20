const {mongoDone} = require("./util")
const {UserModel} = require("../models/User")
const Sentiment = require("sentiment")
const sentiment = new Sentiment({})

exports.saveEntry = (text, senderId) => {
  const out = sentiment.analyze(text)
  UserModel.findOneAndUpdate(
    {_id: senderId},
    {$push: {entries: {text, sentiment: out.score}}},
    {upsert: true, setDefaultsOnInsert: true},
    mongoDone
  )
}

exports.showEntries = (senderId) => {
  return {text: `${process.env.APP_URL}/user/${senderId}/entries`}
}

exports.showAnalysis = (senderId) => {
  return {text: `${process.env.APP_URL}/user/${senderId}/analysis/all`}
}

exports.getReportPermission = (senderId) => {
  return {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "one_time_notif_req",
        "title": "Send you a report about your mood in week?",
        "payload": `ONE_TIME_REPORT`
      }
    }
  }
}
