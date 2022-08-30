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
-- Name: disbursement_recipient_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.disbursement_recipient_summary AS
( SELECT 'NF'::character varying AS state_or_area,
    (fund.fund_class)::text AS recipient,
    'Nationwide Federal'::text AS location,
    period.fiscal_year,
    period.calendar_year,
    sum(disbursement.disbursement) AS total
   FROM (((public.disbursement
     JOIN public.fund USING (fund_id))
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  GROUP BY fund.fund_class, 'Nationwide Federal'::text, period.fiscal_year, period.calendar_year
  ORDER BY (sum(disbursement.disbursement)) DESC)
UNION
( SELECT location.state AS state_or_area,
        CASE
            WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text = ''::text)) THEN 'States'::text
            WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text <> ''::text)) THEN 'Counties'::text
            ELSE NULL::text
        END AS recipient,
    'State'::text AS location,
    period.fiscal_year,
    period.calendar_year,
    sum(disbursement.disbursement) AS total
   FROM (((public.disbursement
     JOIN public.commodity USING (commodity_id))
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.state)::text <> ''::text))
  GROUP BY location.state,
        CASE
            WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text = ''::text)) THEN 'States'::text
            WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text <> ''::text)) THEN 'Counties'::text
            ELSE NULL::text
        END, 'State'::text, period.fiscal_year, period.calendar_year
  ORDER BY (sum(disbursement.disbursement)) DESC);


ALTER TABLE public.disbursement_recipient_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

