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
-- Name: production_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.production_summary AS
 SELECT a.period,
    a.location_name,
    a.state,
    a.location_type,
    a.land_category,
    a.year,
    a.location,
    a.product,
    a.commodity,
    a.unit_abbr,
    a.total
   FROM ( SELECT period.period,
            location.offshore_region AS location_name,
            location.state,
            'Offshore'::text AS location_type,
            location.land_category,
                CASE
                    WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            location.fips_code AS location,
            commodity.product,
            commodity.commodity,
            production.unit_abbr,
            sum(production.volume) AS total
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE ((location.land_category)::text = 'Offshore'::text)
          GROUP BY period.period, location.fips_code, location.offshore_region, location.land_category, location.region_type, commodity.product, commodity.commodity, period.fiscal_year, period.calendar_year, production.unit_abbr, location.state
        UNION
         SELECT period.period,
            location.state_name AS location_name,
            location.state,
            'State'::text AS location_type,
            location.land_category,
                CASE
                    WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            location.state AS location,
            commodity.product,
            commodity.commodity,
            production.unit_abbr,
            sum(production.volume) AS total
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE ((location.state_name)::text <> ''::text)
          GROUP BY period.period, location.state_name, 'State'::text, location.land_category, commodity.product, commodity.commodity, period.fiscal_year, period.calendar_year, location.state, production.unit_abbr
        UNION
         SELECT period.period,
            location.location_name,
            location.state,
            'County'::text AS location_type,
            location.land_category,
                CASE
                    WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            location.fips_code AS location,
            commodity.product,
            commodity.commodity,
            production.unit_abbr,
            sum(production.volume) AS total
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE ((location.region_type)::text = 'County'::text)
          GROUP BY period.period, location.fips_code, location.location_name, location.land_category, commodity.product, commodity.commodity, period.fiscal_year, period.calendar_year, production.unit_abbr, location.state
        UNION
         SELECT period.period,
            'Nationwide Federal'::text AS location_name,
            location.state,
            'Nationwide Federal'::text AS location_type,
            'Nationwide Federal'::character varying AS land_category,
                CASE
                    WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            'NF'::text AS location,
            commodity.product,
            commodity.commodity,
            production.unit_abbr,
            sum(production.volume) AS total
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE ((location.land_class)::text = 'Federal'::text)
          GROUP BY period.period, 'Nationwide Federal'::text, commodity.product, commodity.commodity, period.fiscal_year, period.calendar_year, production.unit_abbr, location.state
        UNION
         SELECT period.period,
            'Native American'::text AS location_name,
            location.state,
            'Native American'::text AS location_type,
            'Native American'::character varying AS land_category,
                CASE
                    WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            'NA'::text AS location,
            commodity.product,
            commodity.commodity,
            production.unit_abbr,
            sum(production.volume) AS total
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE ((location.land_class)::text = 'Native American'::text)
          GROUP BY period.period, 'Native American'::text, commodity.product, commodity.commodity, period.fiscal_year, period.calendar_year, production.unit_abbr, location.state
        UNION
         SELECT period.period,
            'Not tied to a lease'::text AS location_name,
            location.state,
            'State'::text AS location_type,
            'State'::character varying AS land_category,
                CASE
                    WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            'State'::text AS location,
            commodity.product,
            commodity.commodity,
            production.unit_abbr,
            sum(production.volume) AS total
           FROM (((public.production
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((location.land_class)::text <> 'Native American'::text) AND (((location.location_name)::text = 'Not tied to a lease'::text) AND ((location.region_type)::text = 'State'::text)))
          GROUP BY period.period, 'State'::text, commodity.product, commodity.commodity, period.fiscal_year, period.calendar_year, production.unit_abbr, location.state) a
  ORDER BY a.year, a.location;


ALTER TABLE public.production_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

