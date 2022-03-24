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
-- Name: revenue_trends; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.revenue_trends AS
 SELECT a.fiscal_year,
    a.calendar_year,
    a.trend_type,
    a.current_month,
    sum(a.total_ytd) AS total_ytd,
    sum(a.total) AS total
   FROM ( SELECT period.fiscal_year,
            period.calendar_year,
                CASE
                    WHEN ((fund.revenue_type)::text = 'Royalties'::text) THEN 1
                    WHEN ((fund.revenue_type)::text = 'Bonus'::text) THEN 2
                    WHEN ((fund.revenue_type)::text = 'Rents'::text) THEN 3
                    WHEN (((fund.revenue_type)::text = 'Other Revenues'::text) OR ((fund.revenue_type)::text = 'Civil Penalties'::text) OR ((fund.revenue_type)::text = 'Inspection Fees'::text)) THEN 4
                    ELSE NULL::integer
                END AS trend_order,
                CASE
                    WHEN (((fund.revenue_type)::text = 'Other Revenues'::text) OR ((fund.revenue_type)::text = 'Civil Penalties'::text) OR ((fund.revenue_type)::text = 'Inspection Fees'::text)) THEN 'Other Revenues'::character varying
                    ELSE fund.revenue_type
                END AS trend_type,
            ( SELECT period_1.month_long
                   FROM public.period period_1
                  WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                           FROM public.period period_2))) AS current_month,
            sum(
                CASE
                    WHEN (period.fiscal_month <= ( SELECT period_1.fiscal_month
                       FROM public.period period_1
                      WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                               FROM public.period period_2)))) THEN revenue.revenue
                    ELSE (0)::numeric
                END) AS total_ytd,
            sum(revenue.revenue) AS total
           FROM (((public.revenue
             JOIN public.period USING (period_id))
             JOIN public.commodity USING (commodity_id))
             JOIN public.fund USING (fund_id))
          WHERE ((commodity.commodity IS NOT NULL) AND ((period.period)::text = 'Monthly'::text))
          GROUP BY period.fiscal_year, period.calendar_year, fund.revenue_type
        UNION
         SELECT period.fiscal_year,
            period.calendar_year,
            5 AS trend_order,
            'All Revenue'::character varying AS trend_type,
            ( SELECT period_1.month_long
                   FROM public.period period_1
                  WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                           FROM public.period period_2))) AS current_month,
            sum(
                CASE
                    WHEN (period.fiscal_month <= ( SELECT period_1.fiscal_month
                       FROM public.period period_1
                      WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                               FROM public.period period_2)))) THEN revenue.revenue
                    ELSE (0)::numeric
                END) AS total_ytd,
            sum(revenue.revenue) AS total
           FROM ((public.revenue
             JOIN public.period USING (period_id))
             JOIN public.commodity USING (commodity_id))
          WHERE ((commodity.commodity IS NOT NULL) AND ((period.period)::text = 'Monthly'::text))
          GROUP BY period.fiscal_year, period.calendar_year) a
  GROUP BY a.fiscal_year, a.calendar_year, a.trend_type, a.trend_order, a.current_month
  ORDER BY a.fiscal_year, a.trend_order;


ALTER TABLE public.revenue_trends OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

