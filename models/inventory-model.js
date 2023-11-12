const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
/* ***************************
 * Get inventory item by ID
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryById error: " + error);
  }

}

/* ***************************
 * Add new classification to the database
 * ************************** */
async function insertNewClassification(classification_name) {
  try {
    const query = "INSERT INTO public.classification (classification_name) VALUES ($1)";
    const values = [classification_name];
    await pool.query(query, values);
  } catch (error) {
    console.error("insertNewClassification error: " + error);

  }
}
/* ***************************
 * Add new inventory to the database
 * ************************** */
async function insertInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_color, inv_miles) {
  try {
    const sql = "classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_color, inv_miles) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING *"
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_color, inv_miles ])
  } catch (error) {
    return error.message
  }
}




module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, insertNewClassification, insertInventory };