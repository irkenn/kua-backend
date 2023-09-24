CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    bio_info VARCHAR(120),
    url_image TEXT
);


CREATE TABLE ingredients (
    id INTEGER PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    unit TEXT,
    amount DECIMAL,
    kcal DECIMAL,
    protein DECIMAL,
    fiber DECIMAL,
    fat DECIMAL,
    carbohydrates DECIMAL
);

CREATE TABLE recipe_info (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  cal_count INTEGER,
  preparation TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at timestamp with time zone
  servings INTEGER,
  url_image TEXT
);

CREATE TABLE rating_votes (
    recipe_id INTEGER REFERENCES recipe_info(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating <= 5),
    PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE recipe_ingredients (
    recipe_id INTEGER REFERENCES recipe_info(id) ON DELETE CASCADE,
    ingredients_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, ingredients_id)
);




