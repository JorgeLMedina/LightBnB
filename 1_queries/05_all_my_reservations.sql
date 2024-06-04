SELECT reservations.id, title, reservations.start_date, cost_per_night, avg(property_reviews.rating) as average_rating
FROM properties
JOIN reservations ON properties.id = property_id
JOIN property_reviews ON reservations.id = reservation_id
WHERE reservations.guest_id = 1
GROUP BY reservations.id, title, reservations.start_date, cost_per_night
ORDER BY start_date
LIMIT 10;