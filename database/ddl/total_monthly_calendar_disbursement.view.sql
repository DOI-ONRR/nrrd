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
-- Name: total_monthly_calendar_disbursement; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.total_monthly_calendar_disbursement AS
 SELECT a.period,
    a.year,
    a.month,
    a.month_long,
    a.period_date,
    a.land_type,
    a.source,
    a.sort_order,
    a.fund_type,
    a.recipient,
    a.fund_class,
    sum(a.sum) AS sum
   FROM ( SELECT period.period,
            period.calendar_year AS year,
            period.month,
            period.month_long,
            period.period_date,
            location.land_type,
            fund.fund_type,
            fund.recipient,
                CASE
                    WHEN ((fund.fund_class)::text = ANY (ARRAY[('Native American tribes and individuals'::character varying)::text, ('Land and Water Conservation Fund'::character varying)::text, ('Reclamation Fund'::character varying)::text, ('State and local governments'::character varying)::text, ('U.S. Treasury'::character varying)::text, ('Historic Preservation Fund'::character varying)::text])) THEN fund.fund_class
                    ELSE 'Other funds'::character varying
                END AS fund_class,
            (location.land_type)::text AS source,
                CASE
                    WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
                    WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 0
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 1
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 4
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 3
                    ELSE 0
                END AS sort_order,
            sum(disbursement.disbursement) AS sum
           FROM ((((public.disbursement
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
             JOIN public.fund USING (fund_id))
          WHERE (((period.period)::text = 'Monthly'::text) AND (period.calendar_year <= ( SELECT max(period_1.calendar_year) AS max
                   FROM (public.disbursement disbursement_1
                     JOIN public.period period_1 USING (period_id))
                  WHERE (period_1.month = 12))) AND (period.calendar_year >= ( SELECT max((period_1.calendar_year - 3)) AS max
                   FROM (public.disbursement disbursement_1
                     JOIN public.period period_1 USING (period_id))
                  WHERE (period_1.month = 12))))
          GROUP BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, location.land_category, location.land_class, location.land_type, fund.fund_type, fund.recipient, fund.fund_class) a
  GROUP BY a.period, a.year, a.month, a.month_long, a.period_date, a.land_type, a.source, a.sort_order, a.fund_type, a.recipient, a.fund_class
  ORDER BY a.period, a.year, a.month, a.sort_order;


ALTER TABLE public.total_monthly_calendar_disbursement OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

