-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.attendance (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    created_at timestamp
    with
        time zone NOT NULL DEFAULT now (),
        name text,
        roll numeric,
        subject text,
        semester text,
        course text,
        CONSTRAINT attendance_pkey PRIMARY KEY (id)
);

CREATE TABLE public.students (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    created_at timestamp
    with
        time zone NOT NULL DEFAULT now (),
        username text,
        password text,
        course text,
        sem numeric,
        roll numeric,
        CONSTRAINT students_pkey PRIMARY KEY (id)
);

CREATE TABLE public.subjects (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    created_at timestamp
    with
        time zone NOT NULL DEFAULT now (),
        name text,
        code text,
        is_active boolean,
        CONSTRAINT subjects_pkey PRIMARY KEY (id)
);

CREATE TABLE public.teachers (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    created_at timestamp
    with
        time zone NOT NULL DEFAULT now (),
        username text,
        password text,
        course text,
        semester numeric,
        CONSTRAINT teachers_pkey PRIMARY KEY (id)
);