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
-- Name: fiscal_disbursement_recipient_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.fiscal_disbursement_recipient_summary AS
 SELECT t1.year,
    t1.recipient,
    t1.recipient_order,
    sum(t1.sum) AS total
   FROM ( SELECT period.fiscal_year AS year,
            fund.fund_class AS recipient,
                CASE
                    WHEN ((fund.fund_class)::text = 'U.S. Treasury'::text) THEN 1
                    WHEN ((fund.fund_class)::text = 'State and local governments'::text) THEN 2
                    WHEN ((fund.fund_class)::text = 'Reclamation Fund'::text) THEN 3
                    WHEN ((fund.fund_class)::text = 'Native American tribes and individuals'::text) THEN 4
                    WHEN ((fund.fund_class)::text = 'Land and Water Conservation Fund'::text) THEN 5
                    WHEN ((fund.fund_class)::text = 'Historic Preservation Fund'::text) THEN 7
                    ELSE 8
                END AS recipient_order,
            sum(disbursement.disbursement) AS sum
           FROM (((public.disbursement
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.fund USING (fund_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((fund.fund_class)::text <> ''::text))
          GROUP BY fund.fund_class, period.fiscal_year, period.calendar_year
          ORDER BY period.fiscal_year) t1
  GROUP BY t1.year, t1.recipient, t1.recipient_order
  ORDER BY t1.year DESC, t1.recipient_order;


ALTER TABLE public.fiscal_disbursement_recipient_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

