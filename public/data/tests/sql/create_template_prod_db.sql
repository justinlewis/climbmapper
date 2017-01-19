/* Templating prod database for testing
 *
 * TODO: Temporary db? Could save space/boost test performance
 *
 */

CREATE DATABASE IF NOT EXISTS climbmapper_test TEMPLATE climbmapper;
CREATE USER IF NOT EXISTS test WITH PASSWORD 'reader';
GRANT CONNECT ON DATABASE climbmapper_test TO test;
GRANT SELECT, INSERT, UPDATE, DELETE -- should probably adjust these
ON ALL TABLES IN SCHEMA public 
TO test;


/* For live prod db we need to revoke existing connections while templating for testing...
 *
 * 

REVOKE CONNECT ON DATABASE climbmapper FROM PUBLIC;

-- while connected to another DB (like the default maintenance DB "postgres")

SELECT pg_terminate_backend(pid)
FROM   pg_stat_activity
WHERE  datname = 'climbmapper'  
AND    pid <> pg_backend_pid();

CREATE DATABASE climbmapper_test TEMPLATE climbmapper;

GRANT CONNECT ON DATABASE climbmapper TO PUBLIC; 

 *
 *
 */