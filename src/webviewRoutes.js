const {UserModel} = require('./models/User')

exports.setupWebviewRoutes = (app) => {
  app.get("/user/:id/analysis/week", async (req, res) => {
    try {
      const today = Date.now()
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 7)
      const out = await UserModel.findById(req.params.id)

      const date = out.entries
        .filter(item => item.date > lastWeek && item.date <= today)
        .map(item => `"${item.date.toISOString()}"`)
        .join(",")
      const sentiment = out.entries.map(item => item.sentiment)
      res.render('analysis', {date, sentiment, id: req.params.id, weekly: true})
    } catch (e) {
      console.log(e)
      res.send("error")
    }
  })

  app.get("/user/:id/entries", async (req, res) => {
    try {
      const out = await UserModel.findById(req.params.id)
      const entries = out.entries
        .sort((a, b) => a.date - b.date)
        .map(item => {
          const dateTimeFormat = new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
          })
          const [{value: month}, , {value: day}, , {value: year}] =
            dateTimeFormat.formatToParts(item.date)
          return {
            date: `${day}-${month}-${year}`,
            text: item.text,
            sentiment: item.sentiment
          }
        })
      res.render('entries', {entries, id: req.params.id})
    } catch (e) {
      console.log(e)
      res.send("error 404")
    }
  })

  app.get("/user/:id/analysis/all", async (req, res) => {
    try {
      const out = await UserModel.findById(req.params.id)
      const date = out.entries.map(item => `"${item.date.toISOString()}"`).join(",")
      const sentiment = out.entries.map(item => item.sentiment)
      res.render('analysis', {date, sentiment, id: req.params.id, weekly: false})
    } catch (e) {
      console.log(e)
      res.send("error")
    }
  })

}

