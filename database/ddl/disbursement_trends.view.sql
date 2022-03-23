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
-- Name: disbursement_trends; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.disbursement_trends AS
 SELECT a.fiscal_year,
    a.calendar_year,
    a.trend_type,
    a.current_month,
    sum(a.total_ytd) AS total_ytd,
    sum(a.total) AS total
   FROM ( SELECT period.fiscal_year,
            period.calendar_year,
                CASE
                    WHEN ((fund.fund_type)::text = 'U.S. Treasury'::text) THEN 1
                    WHEN ((fund.fund_type)::text ~~ '%State%'::text) THEN 2
                    WHEN ((fund.fund_type)::text ~~ '%Reclamation%'::text) THEN 3
                    WHEN ((location.land_class)::text = 'Native American'::text) THEN 4
                    ELSE 5
                END AS trend_order,
                CASE
                    WHEN ((fund.fund_type)::text = 'U.S. Treasury'::text) THEN 'U.S. Treasury'::text
                    WHEN ((fund.fund_type)::text ~~ '%State%'::text) THEN 'States & counties'::text
                    WHEN ((fund.fund_type)::text ~~ '%Reclamation%'::text) THEN 'Reclamation fund'::text
                    WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native Americans'::text
                    ELSE 'Other Funds'::text
                END AS trend_type,
            ( SELECT period_1.month_long
                   FROM public.period period_1
                  WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                           FROM (public.period period_2
                             JOIN public.disbursement disbursement_1 USING (period_id))))) AS current_month,
            sum(
                CASE
                    WHEN (period.fiscal_month <= ( SELECT period_1.fiscal_month
                       FROM public.period period_1
                      WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                               FROM (public.period period_2
                                 JOIN public.disbursement disbursement_1 USING (period_id)))))) THEN disbursement.disbursement
                    ELSE (0)::numeric
                END) AS total_ytd,
            sum(disbursement.disbursement) AS total
           FROM ((((public.disbursement
             JOIN public.period USING (period_id))
             JOIN public.commodity USING (commodity_id))
             JOIN public.location USING (location_id))
             JOIN public.fund USING (fund_id))
          WHERE ((fund.fund_type IS NOT NULL) AND (((period.period)::text = 'Monthly'::text) OR (((period.period)::text = 'Fiscal Year'::text) AND (period.period_date < ( SELECT min(period_1.period_date) AS min
                   FROM (public.disbursement disbursement_1
                     JOIN public.period period_1 USING (period_id))
                  WHERE ((period_1.period)::text = 'Monthly'::text))))))
          GROUP BY period.fiscal_year, period.calendar_year, fund.fund_type, location.land_class
        UNION
         SELECT period.fiscal_year,
            period.calendar_year,
            5 AS trend_order,
            'Total'::character varying AS trend_type,
            ( SELECT period_1.month_long
                   FROM public.period period_1
                  WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                           FROM (public.period period_2
                             JOIN public.disbursement disbursement_1 USING (period_id))))) AS current_month,
            sum(
                CASE
                    WHEN (period.fiscal_month <= ( SELECT period_1.fiscal_month
                       FROM public.period period_1
                      WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                               FROM (public.period period_2
                                 JOIN public.disbursement disbursement_1 USING (period_id)))))) THEN disbursement.disbursement
                    ELSE (0)::numeric
                END) AS total_ytd,
            sum(disbursement.disbursement) AS total
           FROM (((public.disbursement
             JOIN public.period USING (period_id))
             JOIN public.commodity USING (commodity_id))
             JOIN public.fund USING (fund_id))
          WHERE ((commodity.commodity IS NOT NULL) AND (((period.period)::text = 'Monthly'::text) OR (((period.period)::text = 'Fiscal Year'::text) AND (period.period_date < ( SELECT min(period_1.period_date) AS min
                   FROM (public.disbursement disbursement_1
                     JOIN public.period period_1 USING (period_id))
                  WHERE ((period_1.period)::text = 'Monthly'::text))))))
          GROUP BY period.fiscal_year, period.calendar_year) a
  GROUP BY a.fiscal_year, a.calendar_year, a.trend_type, a.trend_order, a.current_month
  ORDER BY a.fiscal_year, a.trend_order;


ALTER TABLE public.disbursement_trends OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

