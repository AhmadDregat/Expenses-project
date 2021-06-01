const data = require('./expenses.json')
const Expense = require("./model/expense.js")
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/expenseDB")

for (let doc of data) {
    let expense = new Expense(doc)
    expense.save()
}