const pool = require("./db");


(async () => {
  try {
    const res = await pool.query('SELECT * FROM recipes');
    console.log(res.rows); // Should log your sample recipes
  } catch (err) {
    console.error('DB error:', err);
  } finally {
    pool.end();
  }
})();