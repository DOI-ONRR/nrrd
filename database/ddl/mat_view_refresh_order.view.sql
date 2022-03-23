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
-- Name: mat_view_refresh_order; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.mat_view_refresh_order AS
 WITH b AS (
         SELECT DISTINCT ON (mat_view_dependencies.schemaname, mat_view_dependencies.relname) mat_view_dependencies.schemaname,
            mat_view_dependencies.relname,
            mat_view_dependencies.ownername,
            mat_view_dependencies.depth
           FROM public.mat_view_dependencies
          WHERE (mat_view_dependencies.relkind = 'm'::"char")
          ORDER BY mat_view_dependencies.schemaname, mat_view_dependencies.relname, mat_view_dependencies.depth DESC
        )
 SELECT b.schemaname,
    b.relname,
    b.ownername,
    b.depth AS refresh_order
   FROM b
  ORDER BY b.depth, b.schemaname, b.relname;


ALTER TABLE public.mat_view_refresh_order OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

