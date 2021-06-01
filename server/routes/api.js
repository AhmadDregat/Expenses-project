const express = require('express')
const router = express.Router()
const expensesJSON = require('../../Expenses')
const Expense = require('../../model/Expense')
const moment = require('moment')


/**
 * this route should simply respond with all of the expenses currently in your DB.
 */
router.get('/expenses', function(req, res) {
    const d1 = req.query.d1
    const d2 = req.query.d2
    if (d1 && d2) {
        Expense.find({
            $and: [{ date: { $gt: d1 } }, { date: { $lt: d2 } }]
        }).sort('date').exec(function(err, expenses) {
            res.send(expenses)
        })
    }
    if (d1 && !d2) {
        Expense.find({
            date: { $gt: d1 }
        }).sort('date').exec(function(err, expenses) {
            res.send(expenses)
        })
    }
    if (!d1 && !d2) {
        Expense.find({}).sort('date').exec(function(err, expenses) {
            res.send(expenses)
        })
    }
})

router.post('/new', function(req, res) {
    const item = req.body.item;
    const amount = req.body.amount;
    const group = req.body.group;
    let date = req.body.date
    if (date === "") {
        date = moment().format()
    }
    const newExpense = new Expense({ item: item, amount: amount, date: date, group: group })
    newExpense.save().then(() => console.log(`Spent ${amount}$ on ${item}`))
    res.send()
})



router.put('/update', function(req, res) {
    const group1 = req.query.group1
    const group2 = req.query.group2
    Expense.findOneAndUpdate({ group: group1 }, { group: group2 }, function(err, result) {
        res.send(` the ${group1}s was changed to ${group2} group`)
    })
})


router.get('/expenses/:group', function(req, res) {
    const group = req.params.group
    const isTotal = req.query.total || 'false'

    if (isTotal === "false") {
        Expense.find({
            group: group
        }).then(function(expenses) {
            res.send(expenses)
        })
    } else {
        Expense.aggregate([{
            $match: { group: group }
        }, {
            $group: { _id: group, isTotal: { $sum: "$amount" } }
        }]).then(function(expenses) {
            res.send(expenses)
        })
    }

})




module.exports = router