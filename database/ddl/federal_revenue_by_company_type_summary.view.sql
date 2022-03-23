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
-- Name: federal_revenue_by_company_type_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.federal_revenue_by_company_type_summary AS
 SELECT top_company.calendar_year,
    top_company.corporate_name,
    company_detail.commodity,
    company_detail.revenue_type,
    ((top_company.total / total_yearly.total_yearly_revenue) * (100)::numeric) AS percent_of_revenue,
    top_company.total,
    company_detail.revenue,
    top_company.company_rank,
    company_detail.type_order
   FROM ( SELECT federal_revenue_by_company.calendar_year,
            sum(federal_revenue_by_company.revenue) AS total_yearly_revenue
           FROM public.federal_revenue_by_company
          GROUP BY federal_revenue_by_company.calendar_year) total_yearly,
    ( SELECT federal_revenue_by_company.corporate_name,
            federal_revenue_by_company.calendar_year,
            sum(federal_revenue_by_company.revenue) AS total,
            rank() OVER (PARTITION BY federal_revenue_by_company.calendar_year ORDER BY (sum(federal_revenue_by_company.revenue)) DESC) AS company_rank
           FROM public.federal_revenue_by_company
          GROUP BY federal_revenue_by_company.calendar_year, federal_revenue_by_company.corporate_name
          ORDER BY federal_revenue_by_company.calendar_year, (rank() OVER (PARTITION BY federal_revenue_by_company.calendar_year ORDER BY (sum(federal_revenue_by_company.revenue)) DESC))) top_company,
    ( SELECT federal_revenue_by_company.calendar_year,
            federal_revenue_by_company.corporate_name,
            federal_revenue_by_company.commodity,
            federal_revenue_by_company.revenue_type,
                CASE
                    WHEN ((federal_revenue_by_company.revenue_type)::text = 'Royalties'::text) THEN 1
                    WHEN ((federal_revenue_by_company.revenue_type)::text = 'Bonus'::text) THEN 2
                    WHEN ((federal_revenue_by_company.revenue_type)::text = 'Rents'::text) THEN 3
                    WHEN ((federal_revenue_by_company.revenue_type)::text = 'Inspection Fees'::text) THEN 4
                    WHEN ((federal_revenue_by_company.revenue_type)::text = 'Civil Penalties'::text) THEN 5
                    WHEN ((federal_revenue_by_company.revenue_type)::text = 'Other Revenues'::text) THEN 6
                    ELSE 7
                END AS type_order,
            sum(federal_revenue_by_company.revenue) AS revenue
           FROM public.federal_revenue_by_company
          GROUP BY federal_revenue_by_company.calendar_year, federal_revenue_by_company.corporate_name, federal_revenue_by_company.commodity, federal_revenue_by_company.revenue_type) company_detail
  WHERE ((total_yearly.calendar_year = top_company.calendar_year) AND (top_company.calendar_year = company_detail.calendar_year) AND ((top_company.corporate_name)::text = (company_detail.corporate_name)::text))
  ORDER BY top_company.calendar_year DESC, top_company.company_rank, company_detail.type_order;


ALTER TABLE public.federal_revenue_by_company_type_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

