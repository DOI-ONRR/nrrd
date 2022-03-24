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
-- Name: disbursement_source_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.disbursement_source_summary AS
 SELECT t1.state_or_area,
    t1.source,
    t1.location,
    t1.fiscal_year,
    t1.calendar_year,
    sum(t1.total) AS total
   FROM (( SELECT 'NF'::text AS state_or_area,
                CASE
                    WHEN ((location.land_category)::text = 'Onshore'::text) THEN location.land_category
                    WHEN ((fund.fund_type)::text = 'State 8(g)'::text) THEN '8(g) offshore'::character varying
                    WHEN (upper((fund.fund_type)::text) ~~ '%GOMESA%'::text) THEN 'GOMESA offshore'::character varying
                    ELSE 'Offshore'::character varying
                END AS source,
            'Nationwide Federal'::text AS location,
            period.fiscal_year,
            period.calendar_year,
            sum(disbursement.disbursement) AS total
           FROM ((((public.disbursement
             JOIN public.commodity USING (commodity_id))
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.fund USING (fund_id))
          WHERE ((period.period)::text = 'Fiscal Year'::text)
          GROUP BY fund.source, location.land_category, fund.fund_type, period.fiscal_year, period.calendar_year
          ORDER BY period.fiscal_year,
                CASE
                    WHEN ((location.land_category)::text = 'Onshore'::text) THEN location.land_category
                    WHEN ((fund.fund_type)::text = 'State 8(g)'::text) THEN '8(g) offshore'::character varying
                    WHEN (upper((fund.fund_type)::text) ~~ '%GOMESA%'::text) THEN 'GOMESA offshore'::character varying
                    ELSE 'Offshore'::character varying
                END, (sum(disbursement.disbursement)) DESC)
        UNION
        ( SELECT location.state AS state_or_area,
                CASE
                    WHEN ((location.land_category)::text = 'Onshore'::text) THEN location.land_category
                    WHEN ((fund.fund_type)::text = 'State 8(g)'::text) THEN '8(g) offshore'::character varying
                    WHEN (upper((fund.fund_type)::text) ~~ '%GOMESA%'::text) THEN 'GOMESA offshore'::character varying
                    ELSE 'Offshore'::character varying
                END AS source,
            'States'::text AS location,
            period.fiscal_year,
            period.calendar_year,
            sum(disbursement.disbursement) AS total
           FROM ((((public.disbursement
             JOIN public.commodity USING (commodity_id))
             JOIN public.fund USING (fund_id))
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.state)::text <> ''::text))
          GROUP BY location.state,
                CASE
                    WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text = ''::text)) THEN 'States'::text
                    WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text <> ''::text)) THEN 'Counties'::text
                    ELSE NULL::text
                END, 'State'::text, period.fiscal_year, period.calendar_year, location.land_category, fund.fund_type
          ORDER BY (sum(disbursement.disbursement)) DESC)) t1
  GROUP BY t1.state_or_area, t1.source, t1.location, t1.fiscal_year, t1.calendar_year
  ORDER BY t1.fiscal_year, t1.state_or_area, (sum(t1.total));


ALTER TABLE public.disbursement_source_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

