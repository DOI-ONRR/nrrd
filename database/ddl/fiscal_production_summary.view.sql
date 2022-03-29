--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Debian 12.9-1.pgdg110+1)
-- Dumped by pg_dump version 13.5 (Ubuntu 13.5-0ubuntu0.21.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: fiscal_production_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.fiscal_production_summary AS
 SELECT a.location_type,
    a.land_category,
    a.location_name,
    a.state,
    a.unit_abbr,
    a.fiscal_year,
    a.state_or_area,
    a.sum,
    a.commodity
   FROM (( SELECT 'Offshore'::text AS location_type,
            'Offshore'::character varying AS land_category,
            location.offshore_region AS location_name,
            location.offshore_region AS state,
            production.unit_abbr,
            period.fiscal_year,
            location.fips_code AS state_or_area,
            sum(production.volume) AS sum,
            commodity.product AS commodity
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_category)::text = 'Offshore'::text) AND ((location.offshore_region)::text <> ''::text))
          GROUP BY location.land_type, location.location_name, location.state, production.unit_abbr, location.offshore_region, location.fips_code, location.land_category, period.fiscal_year, commodity.product, commodity.commodity_order
          ORDER BY commodity.commodity_order, period.fiscal_year, location.offshore_region)
        UNION
        ( SELECT 'State'::text AS location_type,
            'Onshore'::character varying AS land_category,
            location.state_name AS location_name,
            location.state,
            production.unit_abbr,
            period.fiscal_year,
            location.state AS state_or_area,
            sum(production.volume) AS sum,
            commodity.product AS commodity
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.state)::text <> ''::text))
          GROUP BY location.state_name, location.state, production.unit_abbr, period.fiscal_year, commodity.product, commodity.commodity_order
          ORDER BY commodity.commodity_order, period.fiscal_year, location.state)
        UNION
        ( SELECT 'County'::text AS location_type,
            'Onshore'::character varying AS land_category,
            location.location_name AS name,
            location.state,
            production.unit_abbr,
            period.fiscal_year,
            location.fips_code AS state_or_area,
            sum(production.volume) AS sum,
            commodity.product AS commodity
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_category)::text = 'Onshore'::text) AND ((location.county)::text <> ''::text))
          GROUP BY location.land_type, location.location_name, location.state, location.county, location.fips_code, production.unit_abbr, location.offshore_region, period.fiscal_year, commodity.product, commodity.commodity_order
          ORDER BY commodity.commodity_order)
        UNION
        ( SELECT 'Nationwide Federal'::text AS location_type,
            'Nationwide Federal'::character varying AS land_category,
            'Nationwide'::character varying AS location_name,
            'Nationwide'::character varying AS state,
            production.unit_abbr,
            period.fiscal_year,
            'Nationwide Federal'::text AS state_or_area,
            sum(production.volume) AS sum,
            commodity.product AS commodity
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Federal'::text))
          GROUP BY production.unit_abbr, 'Nationwide Federal'::text, period.fiscal_year, commodity.product, commodity.commodity_order
          ORDER BY commodity.commodity_order)
        UNION
        ( SELECT 'Native American'::text AS location_type,
            'Native American'::character varying AS land_category,
            'Native American lands'::character varying AS location_name,
            'Native American lands'::character varying AS state,
            production.unit_abbr,
            period.fiscal_year,
            'Native American'::text AS state_or_area,
            sum(production.volume) AS sum,
            commodity.product AS commodity
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Native American'::text))
          GROUP BY production.unit_abbr, 'Native American'::text, period.fiscal_year, commodity.product, commodity.commodity_order
          ORDER BY commodity.commodity_order)) a
  ORDER BY a.fiscal_year;


ALTER TABLE public.fiscal_production_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

