const pool = require("../database/")

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

// Check to see if an email already exists in the database
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

// Check to see if a password matches
async function checkPassword(account_email, account_password){
    try {
        const sql = "SELECT $1 FROM account WHERE account_password = $2"
        const email = await pool.query(sql, [account_email, account_password])
        return email.rowCount
    } catch (error){
        return error.message
    }
}

module.exports = {registerAccount, checkExistingEmail, checkPassword}