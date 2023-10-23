CREATE OR REPLACE PROCEDURE delete_revenue()
AS $$
DECLARE
    v_from_date monthly_revenue_elt.accept_date%TYPE;
BEGIN
    SELECT MIN(accept_date)
    INTO v_from_date
    FROM monthly_revenue_elt;

    DELETE FROM revenue r
    WHERE EXISTS (
        SELECT 1
        FROM period p
        WHERE p.period_id = r.period_id
          AND p.period_date >= v_from_date
    );
END $$ LANGUAGE PLPGSQL;