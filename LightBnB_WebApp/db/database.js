// const properties = require("./json/properties.json");
// const users = require("./json/users.json");

const { Pool } = require("pg");
const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "lightbnb",
  port: 5432
});

// pool
//   .query(`SELECT title FROM properties LIMIT 10;`)
//   .then(response => { console.log(response) })
//   .catch((err) => console.error("query error", err.stack));

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return Promise.reject(err);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return Promise.reject(err);
    })
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return Promise.reject(err);
    })
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`
      SELECT reservations.id, 
      properties.title, 
      properties.cost_per_night, 
      reservations.start_date, 
      avg(rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2;`, [guest_id, limit])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
      return Promise.reject(err);
    })
  // return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  WHERE 1=1
  `;

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += ` AND owner_id = $${queryParams.length}\n`;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `AND (cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length})\n`;
  } else if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += ` AND cost_per_night >= $${queryParams.length - 1}\n`;
  } else if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += ` AND cost_per_night <= $${queryParams.length - 1}\n`;
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParams.length}\n`;
  }

  queryString += `
   GROUP BY properties.id\n
  `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += ` HAVING avg(property_reviews.rating) >= $${queryParams.length}\n`;
  }

  queryParams.push(limit);

  queryString += `
   ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  //////////////////////////////////////////////////////////
  // PROMISE RETURN
  //////////////////////////////////////////////////////////
  return pool
    .query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err.message);
      return Promise.reject(err);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  return pool
    .query(`
      INSERT INTO properties 
      (
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms
      )
      VALUES
      (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13,
      $14
      )
      RETURNING *;`, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
      return Promise.reject(err);
    })
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
