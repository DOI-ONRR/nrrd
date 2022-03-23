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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: federal_revenue_by_company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.federal_revenue_by_company (
    calendar_year integer NOT NULL,
    corporate_name character varying(255) NOT NULL,
    revenue_agency_type character varying(255) NOT NULL,
    revenue_agency character varying(255),
    revenue_type character varying(255),
    commodity character varying(255) NOT NULL,
    commodity_order character varying(5),
    raw_revenue character varying(255) NOT NULL,
    revenue numeric
);


ALTER TABLE public.federal_revenue_by_company OWNER TO postgres;

--
-- Name: federal_revenue_by_company federal_revenue_by_company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.federal_revenue_by_company
    ADD CONSTRAINT federal_revenue_by_company_pkey PRIMARY KEY (calendar_year, corporate_name, revenue_agency_type, commodity);


--
-- PostgreSQL database dump complete
--

