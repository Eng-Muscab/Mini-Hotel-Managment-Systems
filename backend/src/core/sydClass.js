import { pool as db } from "../config/db.js";

class sydClass {
  constructor() {
    this.result = null;
  }

  // Run INSERT / UPDATE / DELETE
  async operation(qry, params = []) {
    try {
      const result = await db.query(qry, params);
      return { success: true, rowCount: result.rowCount };
    } catch (err) {
      console.error("SQL Error:", err.message);
      return { success: false, error: err.message };
    }
  }

  // Return single value (first column of first row)
  async operationReturn(qry, params = []) {
    try {
      const result = await db.query(qry, params);
      if (result.rows.length > 0) {
        const firstRow = result.rows[0];
        return Object.values(firstRow)[0]; // Return first column value
      }
      return null;
    } catch (err) {
      console.error("SQL Error:", err.message);
      return null;
    }
  }

  // Return full result set
  async search(qry, params = []) {
    try {
      const result = await db.query(qry, params);
      return result.rows; // return array of objects as JSON
    } catch (err) {
      console.error("SQL Error:", err.message);
      return [];
    }
  }

  // Return dropdown options as array of { value, label }
  async getOptionsFillCombo(qry, params = []) {
    try {
      const result = await db.query(qry, params);
      return result.rows.map(row => {
        const keys = Object.keys(row);
        return {
          value: row[keys[0]],
          label: row[keys[1]]
        };
      });
    } catch (err) {
      console.error("SQL Error:", err.message);
      return [];
    }
  }
}

export default sydClass;
