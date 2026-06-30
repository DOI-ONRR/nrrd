DROP VIEW IF EXISTS production_commodity_options;

CREATE VIEW production_commodity_options AS
 SELECT DISTINCT commodity.product,
    commodity.commodity_order,
    period.period
   FROM commodity
     JOIN production USING (commodity_id)
     JOIN period USING (period_id)
  WHERE period.period IN ('Calendar Year', 'Fiscal Year')
  ORDER BY commodity.commodity_order;
