
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
    ),
    (
    'John Doe',
    'JoHn_Do3&&',
    'john_doe@aol.com',
    'This is my personal info that is gonna be displayed in my bio',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOWzTBt65oJxMTZCk0xevZezcExJQC7toe1Q&usqp=CAU"');

INSERT INTO recipe_info ( user_id, title, preparation, description, servings, url_image)

VALUES(
    1,
    'Frijoles con grasa',
    'Mezclas los frijoles con el aceite y vualá',
    'Sacada de las obras negras más demandantes del país',
    2,
    'www.google.com'
    ),
    (
    1,
    'Conejo con ejotes',
    'Lleva conejo y ejotes',
    'Da risa',
    1,
    'www.yahoo.com'),
    (3,
	 'Pizza',
	 'Heat it in the microwave',
	 'Convenient and easy to make',
	 2,
	 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpHLOST0fhz_-NIOTpe9jnxAsw8IpHc5Wrg&usqp=CAU');

INSERT INTO ingredients (recipe_id, name, unit, amount, kcal, protein, fiber, fat, carbohydrates)
VALUES(1,
    'dough',
    'kg',
    1.0,
    36.36,
    0.0,
    0.0,
    4.0,
    0.0),
    (1,
    'tomato sauce',
    'cup',
    0.5,
    3.3,
    0.21,
    0.21,
    0.0,
    0.53);


INSERT INTO rating_votes ( recipe_id, user_id, rating)
VALUES (1, 1, 5), 
        (1, 2, 4),
        (3, 3, 5),
        (3, 1, 4);