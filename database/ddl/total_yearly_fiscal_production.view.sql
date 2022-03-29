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
-- Name: total_yearly_fiscal_production; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.total_yearly_fiscal_production AS
 SELECT b.year,
    b.month,
    b.month_long,
    b.product_order,
    b.product,
    b.source,
    b.sort_order,
    sum(b.sum) AS total
   FROM ( SELECT a.period,
            a.year,
            a.month,
            a.month_long,
            a.product_order,
            a.product,
            a.source,
            a.sort_order,
            sum(a.sum) AS sum
           FROM ( SELECT t1.period,
                    t1.year,
                    t1.month,
                    t1.month_long,
                    t1.product_order,
                    t1.product,
                    t2.source,
                    t2.sort_order,
                        CASE
                            WHEN (t1.source = t2.source) THEN t1.sum
                            ELSE NULL::numeric
                        END AS sum
                   FROM (( SELECT period.period,
                            period.fiscal_year AS year,
                            period.fiscal_month AS month,
                            period.month_long,
                                CASE
                                    WHEN ((commodity.product)::text = 'Oil (bbl)'::text) THEN 1
                                    WHEN ((commodity.product)::text = 'Gas (mcf)'::text) THEN 2
                                    WHEN ((commodity.product)::text = 'Coal (tons)'::text) THEN 3
                                    ELSE 0
                                END AS product_order,
                            commodity.product,
                            (location.land_type)::text AS source,
                                CASE
                                    WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
                                    WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
                                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
                                    ELSE 0
                                END AS sort_order,
                            sum(production.volume) AS sum
                           FROM (((public.production
                             JOIN public.period USING (period_id))
                             JOIN public.location USING (location_id))
                             JOIN public.commodity USING (commodity_id))
                          WHERE (((period.period)::text = 'Monthly'::text) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
                                   FROM (public.production production_1
                                     JOIN public.period period_1 USING (period_id))
                                  WHERE (period_1.fiscal_month = 1))) AND (period.fiscal_year > ( SELECT (max(period_1.fiscal_year) - 11)
                                   FROM (public.production production_1
                                     JOIN public.period period_1 USING (period_id))
                                  WHERE (period_1.fiscal_month = 12))) AND ((commodity.product)::text = ANY (ARRAY[('Oil (bbl)'::character varying)::text, ('Gas (mcf)'::character varying)::text, ('Coal (tons)'::character varying)::text])))
                          GROUP BY period.period, period.fiscal_year, period.fiscal_month, period.month_long, location.land_type, location.land_category, location.land_class, commodity.product,
                                CASE
                                    WHEN ((commodity.product)::text = 'Oil (bbl)'::text) THEN 1
                                    WHEN ((commodity.product)::text = 'Gas (mcf)'::text) THEN 2
                                    WHEN ((commodity.product)::text = 'Coal (tons)'::text) THEN 3
                                    ELSE 0
                                END,
                                CASE
                                    WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
                                    WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
                                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
                                    ELSE 0
                                END) t1
                     LEFT JOIN ( SELECT DISTINCT period.period,
                            period.fiscal_year AS year,
                            (location.land_type)::text AS source,
                                CASE
                                    WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
                                    WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
                                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
                                    ELSE 0
                                END AS sort_order,
                            0 AS sum
                           FROM (((public.production
                             JOIN public.period USING (period_id))
                             JOIN public.location USING (location_id))
                             JOIN public.commodity USING (commodity_id))
                          WHERE (((period.period)::text = 'Monthly'::text) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
                                   FROM (public.production production_1
                                     JOIN public.period period_1 USING (period_id))
                                  WHERE (period_1.fiscal_month = 1))) AND (period.fiscal_year > ( SELECT (max(period_1.fiscal_year) - 11)
                                   FROM (public.production production_1
                                     JOIN public.period period_1 USING (period_id))
                                  WHERE (period_1.fiscal_month = 12))) AND ((commodity.product)::text = ANY (ARRAY[('Oil (bbl)'::character varying)::text, ('Gas (mcf)'::character varying)::text, ('Coal (tons)'::character varying)::text])))) t2 USING (period, year))) a
          GROUP BY a.period, a.year, a.month, a.month_long, a.source, a.sort_order, a.product, a.product_order
          ORDER BY a.period, a.product_order, a.year, a.sort_order) b
  GROUP BY b.year, b.month, b.month_long, b.product_order, b.product, b.source, b.sort_order;


ALTER TABLE public.total_yearly_fiscal_production OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

