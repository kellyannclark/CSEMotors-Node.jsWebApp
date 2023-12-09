const pool = require("../database/")
const bcrypt = require('bcrypt');


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Update account data
* *************************** */
async function updateAccountData(account_id, updatedData) {


  try {
    const { account_firstname, account_lastname, account_email } = updatedData;
    console.log('Updating account with data:', {
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });

    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    console.log('SQL Query:', sql, [account_firstname, account_lastname, account_email, account_id]);

    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    console.log('Query Result:', result.rows);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new Error("Failed to update account. No matching account found.");
    }
  } catch (error) {
    console.error('Error updating account data:', error.message);
    throw new Error(`Error updating account data: ${error.message}`);
  }
}


/* *****************************
 * Get account data by account ID
 * *************************** */
async function getAccountById(account_id) {
  try {
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM public.account WHERE account_id = $1";
    const result = await pool.query(sql, [account_id]);

    
    // Check if there is a matching account
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new Error("No matching account found");
    }
  } catch (error) {
    return error.message;
  }
}

/* *****************************
*   Update Account 
* *************************** */
async function updatePassword(new_password, account_id) {
  try {
    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(new_password, 10);

    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [hashedPassword, account_id]);

    return result.rows[0];
  } catch (error) {
    console.error(`Error hashing password: ${error}`);
    return null;
  }
}





  module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, updateAccountData, getAccountById, updatePassword};

