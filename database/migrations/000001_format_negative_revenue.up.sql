CREATE FUNCTION format_negative_revenue()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
AS
$$
BEGIN
    NEW.revenue := REPLACE(NEW.revenue, '(','-');
    NEW.revenue := REPLACE(NEW.revenue, ')','');

    RETURN NEW;
END
$$;

CREATE TRIGGER monthly_revenue_elt_format_negative_bri
    BEFORE INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION format_negative_revenue();