CREATE MATERIALIZED VIEW public.query_tool_production AS
 SELECT location.location_name,
    location.location_order,
    location.land_type,
    location.region_type,
    location.district_type,
    location.state_name,
    location.county,
    commodity.product,
    period.period,
    period.fiscal_year,
    period.calendar_year,
        CASE
            WHEN ((period.month_long)::text <> ''::text) THEN (period.month_long)::text
            ELSE NULL::text
        END AS month_long,
    (production.volume)::double precision AS production,
        CASE
            WHEN ((location.county)::text <> ''::text) THEN concat(location.state_name, ', ', location.county, ' ', location.district_type)
            ELSE NULL::text
        END AS county_name,
        CASE
            WHEN ((period.period)::text = 'Monthly'::text) THEN NULL::character varying
            WHEN ((location.region_type)::text = 'County'::text) THEN location.state_name
            WHEN ((location.region_type)::text = 'Offshore'::text) THEN (concat('Offshore ', location.location_name))::character varying
            ELSE location.location_name
        END AS state_offshore_name
   FROM (((public.production
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id))
   WHERE location.land_class != 'Mixed Exploratory'
  WITH NO DATA;


ALTER TABLE public.query_tool_production OWNER TO postgres;

CREATE INDEX query_tool_production_county_idx ON public.query_tool_production USING btree (county);
CREATE INDEX query_tool_production_district_type_idx ON public.query_tool_production USING btree (district_type);
CREATE INDEX query_tool_production_fiscal_year_idx ON public.query_tool_production USING btree (fiscal_year);
CREATE INDEX query_tool_production_land_type_idx ON public.query_tool_production USING btree (land_type);
CREATE INDEX query_tool_production_location_name_idx ON public.query_tool_production USING btree (location_name);
CREATE INDEX query_tool_production_location_order_idx ON public.query_tool_production USING btree (location_order);
CREATE INDEX query_tool_production_period_idx ON public.query_tool_production USING btree (period);
CREATE INDEX query_tool_production_product_idx ON public.query_tool_production USING btree (product);
CREATE INDEX query_tool_production_region_type_idx ON public.query_tool_production USING btree (region_type);
CREATE INDEX query_tool_production_state_name_idx ON public.query_tool_production USING btree (state_name);

REFRESH MATERIALIZED VIEW public.query_tool_production;