\echo 'Delete and recreate kua db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE kua;
CREATE DATABASE kua;
\connect kua

\i kua-schema.sql
\i kua-seed.sql

\echo 'Delete and recreate kua_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE kua_test;
CREATE DATABASE kua_test;
\connect kua_test

\i kua-schema.sql