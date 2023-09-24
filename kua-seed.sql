
INSERT INTO users (username, password, email, bio_info, url_image)
VALUES(
    'Erick',
    '1234567890', 
    'erick@aol.com', 
    'My favorite recipes are cereal and instant noodles',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpHLOST0fhz_-NIOTpe9jnxAsw8IpHc5Wrg&usqp=CAU'),
    (
    'Anita',
    '1234567890',
    'anita@aol.com',
    'I like to cook deserts',
    'www.yahoo.com'
    );

INSERT INTO ingredients (id, name, unit, amount, kcal, protein, fiber, fat, carbohydrates)
VALUES(
    4582,
    'oil',
    'teaspoon',
    1.0,
    36.36,
    0.0,
    0.0,
    4.0,
    0.0
    ),
    (16202,
    'refried beans',
    'cup',
    0.5,
    3.3,
    0.21,
    0.21,
    0.0,
    0.53);

INSERT INTO recipe_info ( id, user_id, title, cal_count, preparation, description, servings, url_image)

VALUES(
    1,
    1,
    'Frijoles con grasa',
    1200,
    'Mezclas los frijoles con el aceite y vualá',
    'Sacada de las obras negras más demandantes del país',
    2,
    'www.google.com'
);

INSERT INTO rating_votes ( recipe_id, user_id, rating)
VALUES (1, 1, 5), 
        (1, 2, 4);