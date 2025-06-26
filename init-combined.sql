    --
    -- PostgreSQL database dump
    --

    -- Dumped from database version 17.2
    -- Dumped by pg_dump version 17.2

    -- Started on 2025-03-17 11:38:57

    SET statement_timeout = 0;
    SET lock_timeout = 0;
    SET idle_in_transaction_session_timeout = 0;
    SET transaction_timeout = 0;
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
    -- TOC entry 220 (class 1259 OID 40973)
    -- Name: documents; Type: TABLE; Schema: public; Owner: postgres
    --

    CREATE TABLE public.documents (
        id integer NOT NULL,
        name character varying(100),
        type character varying(100),
        file jsonb
    );


    ALTER TABLE public.documents OWNER TO postgres;

    --
    -- TOC entry 219 (class 1259 OID 40972)
    -- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.documents_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;


    ALTER SEQUENCE public.documents_id_seq OWNER TO postgres;

    --
    -- TOC entry 4955 (class 0 OID 0)
    -- Dependencies: 219
    -- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


    --
    -- TOC entry 228 (class 1259 OID 57486)
    -- Name: record; Type: TABLE; Schema: public; Owner: postgres
    --

    CREATE TABLE public.record (
        id integer NOT NULL,
        date date,
        ver integer NOT NULL,
        student character varying(50),
        original boolean NOT NULL,
        photocopy boolean NOT NULL,
        count integer NOT NULL,
        name character varying(100) NOT NULL
        
    );


    ALTER TABLE public.record OWNER TO postgres;

    --
    -- TOC entry 227 (class 1259 OID 57485)
    -- Name: record_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.record_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;


    ALTER SEQUENCE public.record_id_seq OWNER TO postgres;

    --
    -- TOC entry 4956 (class 0 OID 0)
    -- Dependencies: 227
    -- Name: record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.record_id_seq OWNED BY public.record.id;


    --
    -- TOC entry 230 (class 1259 OID 74126)
    -- Name: remarks; Type: TABLE; Schema: public; Owner: postgres
    --

    CREATE TABLE public.remarks (
        id integer NOT NULL,
        student character varying(100) NOT NULL,
        username character varying(200) NOT NULL,
        remark character varying(500)
    );


    ALTER TABLE public.remarks OWNER TO postgres;

    --
    -- TOC entry 229 (class 1259 OID 74125)
    -- Name: remarks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.remarks_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;


    ALTER SEQUENCE public.remarks_id_seq OWNER TO postgres;

    --
    -- TOC entry 4957 (class 0 OID 0)
    -- Dependencies: 229
    -- Name: remarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.remarks_id_seq OWNED BY public.remarks.id;


    --
    -- TOC entry 222 (class 1259 OID 40982)
    -- Name: student; Type: TABLE; Schema: public; Owner: postgres
    --

    CREATE TABLE public.student (
        id integer NOT NULL,
        admission_no character varying(30) NOT NULL,
        version_count integer NOT NULL,
        lock boolean NOT NULL
    );


    ALTER TABLE public.student OWNER TO postgres;

    --
    -- TOC entry 221 (class 1259 OID 40981)
    -- Name: student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.student_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;


    ALTER SEQUENCE public.student_id_seq OWNER TO postgres;

    --
    -- TOC entry 4958 (class 0 OID 0)
    -- Dependencies: 221
    -- Name: student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.student_id_seq OWNED BY public.student.id;


    --
    -- TOC entry 226 (class 1259 OID 57471)
    -- Name: student_info; Type: TABLE; Schema: public; Owner: postgres
    --

    CREATE TABLE public.student_info (
        id integer NOT NULL,
        name character varying(100) NOT NULL,
        student character varying(50),
        email character varying(100) NOT NULL,
        department character varying(50) NOT NULL,
        student_no bigint,
        parent_no bigint,
        quota character varying(50),
        version integer DEFAULT 0,
        studies character varying(100) NOT NULL,
        parent_name character varying(100) NOT NULL,
        username character varying(100) NOT NULL,
        date date
    );


    ALTER TABLE public.student_info OWNER TO postgres;

    --
    -- TOC entry 225 (class 1259 OID 57470)
    -- Name: student_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.student_info_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;


    ALTER SEQUENCE public.student_info_id_seq OWNER TO postgres;

    --
    -- TOC entry 4959 (class 0 OID 0)
    -- Dependencies: 225
    -- Name: student_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.student_info_id_seq OWNED BY public.student_info.id;


    --
    -- TOC entry 218 (class 1259 OID 40966)
    -- Name: users; Type: TABLE; Schema: public; Owner: postgres
    --

    CREATE TABLE public.users (
        id integer NOT NULL,
        username character varying(100) NOT NULL,
        userId integer NOT NULL,
        password character varying(100) NOT NULL
    );


    ALTER TABLE public.users OWNER TO postgres;

    --
    -- TOC entry 217 (class 1259 OID 40965)
    -- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.users_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;


    ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

    --
    -- TOC entry 4960 (class 0 OID 0)
    -- Dependencies: 217
    -- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


    --
    -- TOC entry 224 (class 1259 OID 57451)
    -- Name: versions; Type: TABLE; Schema: public; Owner: postgres
    --

    CREATE TABLE public.versions (
        id integer NOT NULL,
        student character varying(100) NOT NULL,
        version_count integer DEFAULT 0 NOT NULL,
        doc_version integer DEFAULT 0 NOT NULL,
        student_version integer DEFAULT 0 NOT NULL,
        date date,
        username character varying(100) NOT NULL
    );


    ALTER TABLE public.versions OWNER TO postgres;
    
    --
    -- TOC entry 223 (class 1259 OID 57450)
    -- Name: versions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.versions_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;


    ALTER SEQUENCE public.versions_id_seq OWNER TO postgres;

    --
    -- TOC entry 4961 (class 0 OID 0)
    -- Dependencies: 223
    -- Name: versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.versions_id_seq OWNED BY public.versions.id;


    --
    -- TOC entry 4773 (class 2604 OID 40976)
    -- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


    --
    -- TOC entry 4781 (class 2604 OID 57489)
    -- Name: record id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.record ALTER COLUMN id SET DEFAULT nextval('public.record_id_seq'::regclass);


    --
    -- TOC entry 4782 (class 2604 OID 74129)
    -- Name: remarks id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.remarks ALTER COLUMN id SET DEFAULT nextval('public.remarks_id_seq'::regclass);


    --
    -- TOC entry 4774 (class 2604 OID 40985)
    -- Name: student id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.student ALTER COLUMN id SET DEFAULT nextval('public.student_id_seq'::regclass);


    --
    -- TOC entry 4779 (class 2604 OID 57474)
    -- Name: student_info id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.student_info ALTER COLUMN id SET DEFAULT nextval('public.student_info_id_seq'::regclass);


    --
    -- TOC entry 4772 (class 2604 OID 40969)
    -- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


    --
    -- TOC entry 4775 (class 2604 OID 57454)
    -- Name: versions id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.versions ALTER COLUMN id SET DEFAULT nextval('public.versions_id_seq'::regclass);


    --
    -- TOC entry 4786 (class 2606 OID 40980)
    -- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.documents
        ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


    --
    -- TOC entry 4798 (class 2606 OID 57491)
    -- Name: record record_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.record
        ADD CONSTRAINT record_pkey PRIMARY KEY (id);


    --
    -- TOC entry 4800 (class 2606 OID 74133)
    -- Name: remarks remarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.remarks
        ADD CONSTRAINT remarks_pkey PRIMARY KEY (id);


    --
    -- TOC entry 4788 (class 2606 OID 40989)
    -- Name: student student_admission_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.student
        ADD CONSTRAINT student_admission_no_key UNIQUE (admission_no);


    --
    -- TOC entry 4794 (class 2606 OID 57479)
    -- Name: student_info student_info_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    -- ALTER TABLE ONLY public.student_info
    --     ADD CONSTRAINT student_info_email_key UNIQUE (email);


    --
    -- TOC entry 4796 (class 2606 OID 57477)
    -- Name: student_info student_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.student_info
        ADD CONSTRAINT student_info_pkey PRIMARY KEY (id);


    --
    -- TOC entry 4790 (class 2606 OID 40987)
    -- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.student
        ADD CONSTRAINT student_pkey PRIMARY KEY (id);


    --
    -- TOC entry 4784 (class 2606 OID 40971)
    -- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.users
        ADD CONSTRAINT users_pkey PRIMARY KEY (id);


    --
    -- TOC entry 4792 (class 2606 OID 57459)
    -- Name: versions versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.versions
        ADD CONSTRAINT versions_pkey PRIMARY KEY (id);


    --
    -- TOC entry 4803 (class 2606 OID 57492)
    -- Name: record record_student_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.record
        ADD CONSTRAINT record_student_fkey FOREIGN KEY (student) REFERENCES public.student(admission_no) ON DELETE CASCADE;


    --
    -- TOC entry 4804 (class 2606 OID 74134)
    -- Name: remarks remarks_student_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.remarks
        ADD CONSTRAINT remarks_student_fkey FOREIGN KEY (student) REFERENCES public.student(admission_no);


    --
    -- TOC entry 4802 (class 2606 OID 57480)
    -- Name: student_info student_info_student_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.student_info
        ADD CONSTRAINT student_info_student_fkey FOREIGN KEY (student) REFERENCES public.student(admission_no) ON DELETE CASCADE;


    --
    -- TOC entry 4801 (class 2606 OID 57460)
    -- Name: versions versions_student_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.versions
        ADD CONSTRAINT versions_student_fkey FOREIGN KEY (student) REFERENCES public.student(admission_no) ON DELETE CASCADE;


    -- Completed on 2025-03-17 11:38:57

    --
    -- PostgreSQL database dump complete
    --


-- Add these corrected INSERT statements to the end of your init-combined.sql file
-- Replace your existing INSERT statements with these:

INSERT INTO public.users (username, userId, password) VALUES
('Manikandan', 900413,'900413@2025'),
('Sujith Kumar', 900911,'900911@2025'),
('Vanisri',902250,'902250@2025'),
('Leema Angelina',902551,'902551@2025'),
('Raja Bharathi',902710, '902710@2025'),
('Amirtham', 904452, '904452@2025'),
('Bakkiyalakshmi',904697,'904697@2025'),
('Admin', 101010, '101010@2025');

INSERT INTO public.documents (name, type, file) VALUES
('UG and government quota document', 'UG+GQ', '["Admission Application Form", "Allotment Order", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate"]'::jsonb),
('UG and government quota and first graduation document', 'UG+GQ&FG', '["Admission Application Form", "Allotment Order", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate", "First Graduation", "Joint Declaration Form", "Parent Declaration Form (17+ Years Siblings)"]'::jsonb),
('UG and management quota document', 'UG+MQ', '["Admission Application Form", "Consortium Applied or Not (Rs.500)", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate"]'::jsonb),
('LATERAL and government quota document', 'LATERAL+GQ', '["Admission Application Form", "Allotment Order", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate", "Sem - 1st Marksheet", "Sem - 2nd Marksheet", "Sem - 3rd Marksheet (Original / Attested Result Copy)", "Sem - 4th Marksheet (Original / Attested Result Copy)", "Sem - 5th Marksheet (Original / Attested Result Copy)", "Sem - 6th Marksheet (Original / Attested Result Copy)", "Course Completion Certificate", "Consolidation Marksheet", "Provisional Certificate", "Degree Certificate"]'::jsonb),
('LATERAL and government quota and first graduation document', 'LATERAL+GQ&FG', '["Admission Application Form", "Allotment Order", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate", "First Graduation", "Joint Declaration Form", "Parent Declaration Form (17+ Years Siblings)", "Sem - 1st Marksheet", "Sem - 2nd Marksheet", "Sem - 3rd Marksheet (Original / Attested Result Copy)", "Sem - 4th Marksheet (Original / Attested Result Copy)", "Sem - 5th Marksheet (Original / Attested Result Copy)", "Sem - 6th Marksheet (Original / Attested Result Copy)", "Course Completion Certificate", "Consolidation Marksheet", "Provisional Certificate", "Degree Certificate"]'::jsonb),
('LATERAL and management quota document', 'LATERAL+MQ', '["Admission Application Form", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate", "Sem - 1st Marksheet", "Sem - 2nd Marksheet", "Sem - 3rd Marksheet (Original / Attested Result Copy)", "Sem - 4th Marksheet (Original / Attested Result Copy)", "Sem - 5th Marksheet (Original / Attested Result Copy)", "Sem - 6th Marksheet (Original / Attested Result Copy)", "Course Completion Certificate", "Consolidation Marksheet", "Provisional Certificate", "Degree Certificate"]'::jsonb),
('PG-MBA and government quota document', 'PG_MBA+GQ', '["Admission Application Form", "Allotment Order", "TANCET SCORE Card", "TANCET Hall Ticket", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate", "Sem - 1st Marksheet", "Sem - 2nd Marksheet", "Sem - 3rd Marksheet", "Sem - 4th Marksheet", "Sem - 5th Marksheet", "Sem - 6th Marksheet", "Sem - 7th Marksheet (If 4 Years Course Duration)", "Sem - 8th Marksheet (If 4 Years Course Duration)", "Course Completion Certificate", "Consolidation Marksheet", "Provisional Certificate"]'::jsonb),
('PG-MBA and management quota document', 'PG_MBA+MQ', '["Admission Application Form", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate", "Sem - 1st Marksheet", "Sem - 2nd Marksheet", "Sem - 3rd Marksheet", "Sem - 4th Marksheet", "Sem - 5th Marksheet", "Sem - 6th Marksheet", "Sem - 7th Marksheet (If 4 Years Course Duration)", "Sem - 8th Marksheet (If 4 Years Course Duration)", "Course Completion Certificate", "Consolidation Marksheet", "Provisional Certificate"]'::jsonb),
('PG-ME and government quota document', 'PG_ME+GQ!D', '["Admission Application Form", "Allotment Order", "TANCET SCORE Card", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate", "UG - Sem - 1st Marksheet", "UG - Sem - 2nd Marksheet", "UG - Sem - 3rd Marksheet", "UG - Sem - 4th Marksheet", "UG - Sem - 5th Marksheet", "UG - Sem - 6th Marksheet", "UG - Sem - 7th Marksheet", "UG - Sem - 8th Marksheet", "UG - Course Completion Certificate", "UG - Consolidation Marksheet", "UG - Provisional Certificate", "UG - Degree Certificate"]'::jsonb),
('PG-ME and management quota document', 'PG_ME+MQ!D', '["Admission Application Form", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate", "UG - Sem  - 1st Marksheet", "UG - Sem  - 2nd Marksheet", "UG - Sem  - 3rd Marksheet", "UG - Sem  - 4th Marksheet", "UG - Sem  - 5th Marksheet", "UG - Sem  - 6th Marksheet", "UG - Sem  - 7th Marksheet", "UG - Sem  - 8th Marksheet", "UG - Course Completion Certificate", "UG - Consolidation Marksheet", "UG - Provisional Certificate", "UG - Degree Certificate"]'::jsonb),
('PG-ME and government quota with diploma document','PG_ME+GQ&D','["Admission Application Form", "Allotment Order", "TANCET SCORE Card", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate", "Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate", "UG - Sem  - 1st Marksheet", "UG - Sem  - 2nd Marksheet", "UG - Sem  - 3rd Marksheet", "UG - Sem  - 4th Marksheet", "UG - Sem  - 5th Marksheet", "UG - Sem  - 6th Marksheet", "UG - Sem  - 7th Marksheet", "UG - Sem  - 8th Marksheet", "UG - Course Completion Certificate", "UG - Consolidation Marksheet", "UG - Provisional Certificate", "UG - Degree Certificate"]'::jsonb),
('PG-ME and management quota with diploma document','PG_ME+MQ&D','["Admission Application Form", "Allotment Order", "AADHAR Copy", "SSLC Certificate", "HSC - 11th Certificate", "HSC - 12th Certificate", "Community Certificate", "Transfer Certificate","Income Certificate", "Parent Photo Copy (Each One)", "Student Photo Copy (8 No.s)", "Nativity / Migration Certificate", "UG - Sem  - 1st Marksheet", "UG - Sem  - 2nd Marksheet", "UG - Sem  - 3rd Marksheet", "UG - Sem  - 4th Marksheet", "UG - Sem  - 5th Marksheet", "UG - Sem  - 6th Marksheet", "UG - Sem  - 7th Marksheet", "UG - Sem  - 8th Marksheet", "UG - Course Completion Certificate", "UG - Consolidation Marksheet", "UG - Provisional Certificate", "UG - Degree Certificate"]'::jsonb);