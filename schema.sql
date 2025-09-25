-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Blocked_User (
  block_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  blocked_user uuid DEFAULT auth.uid(),
  blocking_user uuid DEFAULT auth.uid(),
  CONSTRAINT Blocked_User_pkey PRIMARY KEY (block_id)
);
CREATE TABLE public.Danksagungen (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  vorname text,
  nachname text,
  writtenText text,
  userId uuid,
  profileImageUrl text,
  location text,
  authorId uuid,
  long double precision NOT NULL,
  lat double precision NOT NULL,
  CONSTRAINT Danksagungen_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Feedback (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid DEFAULT gen_random_uuid(),
  reason text,
  comment text,
  type text,
  CONSTRAINT Feedback_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Posts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  location text,
  nachname text,
  option text,
  postText text,
  profileImageUrl text,
  userId uuid,
  vorname text,
  category text,
  long numeric,
  lat numeric,
  userBio text,
  kategorien jsonb,
  CONSTRAINT Posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Reports (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reported_by_id uuid DEFAULT gen_random_uuid(),
  reason text,
  status boolean,
  CONSTRAINT Reports_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  location text,
  vorname text,
  nachname text,
  email text,
  profileImageUrl text,
  long numeric,
  lat numeric,
  bio text,
  straße text,
  hausnummer text,
  plz text,
  wohnort text,
  telefonnummer text,
  steuernummer text,
  onboarding_completed boolean DEFAULT false,
  kategorien jsonb,
  is_verified boolean DEFAULT false,
  stripe_session_id text,
  is_id_verified boolean,
  id_verified_name_match boolean,
  id_verified_name jsonb,
  id_verified_at timestamp with time zone,
  id_verification_method text,
  has_active_subscription boolean DEFAULT false,
  verification_canceled boolean,
  stripe_customer_id text,
  subscription_status text DEFAULT 'inactive'::text,
  subscription_cancel_at timestamp with time zone,
  current_plan text DEFAULT 'basic'::text,
  cancel_feedback_completed boolean DEFAULT false,
  CONSTRAINT Users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.channel_members (
  channel_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member'::text CHECK (role = ANY (ARRAY['member'::text, 'admin'::text, 'owner'::text])),
  muted boolean NOT NULL DEFAULT false,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  muted_at timestamp with time zone,
  notifications_enabled boolean NOT NULL DEFAULT true,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT channel_members_pkey PRIMARY KEY (channel_id, user_id),
  CONSTRAINT channel_members_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id),
  CONSTRAINT channel_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.channels (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_message_at timestamp with time zone,
  custom_type text,
  custom_category text,
  last_message_text text,
  last_sender_id uuid,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT channels_pkey PRIMARY KEY (id),
  CONSTRAINT channels_last_sender_id_fkey FOREIGN KEY (last_sender_id) REFERENCES auth.users(id)
);
CREATE TABLE public.feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_number text NOT NULL,
  original_text text NOT NULL CHECK (char_length(original_text) >= 10 AND char_length(original_text) <= 4000),
  optimized_text text,
  chosen text NOT NULL CHECK (chosen = ANY (ARRAY['original'::text, 'optimized'::text])),
  query text,
  mode text CHECK (mode = ANY (ARRAY['search'::text, 'offer'::text])),
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT feedback_pkey PRIMARY KEY (id)
);
CREATE TABLE public.message_reads (
  channel_id uuid NOT NULL,
  user_id uuid NOT NULL,
  last_read_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT message_reads_pkey PRIMARY KEY (user_id, channel_id),
  CONSTRAINT message_reads_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id),
  CONSTRAINT message_reads_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  body text NOT NULL,
  client_id uuid NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  edited_at timestamp with time zone,
  deleted_at timestamp with time zone,
  client_created_at timestamp with time zone,
  reply_to_message_id uuid,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_reply_to_message_id_fkey FOREIGN KEY (reply_to_message_id) REFERENCES public.messages(id),
  CONSTRAINT messages_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_requests (
  id integer NOT NULL DEFAULT nextval('user_requests_id_seq'::regclass),
  user_id uuid NOT NULL,
  request_time timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_requests_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);