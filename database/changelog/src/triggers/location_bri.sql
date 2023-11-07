DROP TRIGGER IF EXISTS location_bri ON location;
 
CREATE TRIGGER location_bri
    BEFORE INSERT
    ON location
    FOR EACH ROW
    EXECUTE FUNCTION location_bri();