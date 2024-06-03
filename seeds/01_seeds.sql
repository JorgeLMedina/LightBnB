INSERT INTO users (name, email, password)
VALUES
('Marie Clair', 'm.clair@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Joe Lockwar', 'j.lockwar@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Steve McClain', 's.mcclain@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES
(1, 'Title', 'Description', 'https://www.thumbnail.com', 'https://www.cover.com', 150, 2, 2, 4, 'Canada', '678 35th Ave', 'New Westminster', 'BC', 'V8J 9U3'),
(2, 'Title', 'Description', 'https://www.thumbnail.com', 'https://www.cover.com', 250, 2, 2, 3, 'Canada', '1089 8th Ave', 'Richmond', 'BC', 'V4J 6Y5'),
(3, 'Title', 'Description', 'https://www.thumbnail.com', 'https://www.cover.com', 300, 1, 3, 4, 'Canada', '243 12th Ave', 'Coquitlam', 'BC', 'V2U 7T3');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES
('2024-06-03', '2024-07-03', 1, 1),
('2024-06-05', '2024-07-01', 2, 2),
('2024-08-03', '2024-09-03', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES
(1, 1, 1, 5, 'Message.'),
(2, 2, 2, 4, 'Message.'),
(3, 3, 3, 2, 'Message.');