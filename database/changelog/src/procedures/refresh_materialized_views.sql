CREATE OR REPLACE PROCEDURE refresh_materialized_views()
AS $$
DECLARE
    matviews CURSOR FOR
    SELECT matviewname
    FROM pg_matviews
    WHERE schemaname = 'public';
BEGIN
    FOR matview IN matviews LOOP
        EXECUTE FORMAT('REFRESH MATERIALIZED VIEW %s', matview.matviewname);
    END LOOP;
END $$ LANGUAGE PLPGSQL;