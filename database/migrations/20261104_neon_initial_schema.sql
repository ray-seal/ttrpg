-- Hogwarts RPG initial Neon schema
-- Apply to the dedicated Neon project/branch before switching the app.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  name text NOT NULL,
  house text CHECK (house IS NULL OR house IN ('Gryffindor','Hufflepuff','Ravenclaw','Slytherin')),
  experience integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  magic integer NOT NULL DEFAULT 0,
  knowledge integer NOT NULL DEFAULT 0,
  courage integer NOT NULL DEFAULT 0,
  agility integer NOT NULL DEFAULT 0,
  charisma integer NOT NULL DEFAULT 0,
  hit_points integer NOT NULL DEFAULT 10,
  scene_id text DEFAULT 'wakeup',
  "currentSceneId" text,
  wizarding_money integer NOT NULL DEFAULT 0,
  letter_read boolean NOT NULL DEFAULT false,
  "completedLessons" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "unlockedSpells" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "equippedSpells" jsonb NOT NULL DEFAULT '[]'::jsonb,
  flags jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS characters_house_idx ON public.characters(house);

CREATE TABLE IF NOT EXISTS public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price integer NOT NULL DEFAULT 0,
  category text,
  image_url text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
INSERT INTO public.items(id,name,description,price,category) VALUES
 ('9c1c1a36-8f3f-4c0e-b9b1-222222222222','Basic Wand','A first-year wand from Ollivanders.',15,'wand'),
 ('37e9c6fb-3f81-4d7d-9c3c-444444444444','School Robes','Plain black Hogwarts school robes from Madam Malkin.',10,'clothing'),
 ('b7a8e1a9-bd62-4d50-8e2a-111111111111','Year One Timetable','Your first-year Hogwarts class timetable.',0,'school')
ON CONFLICT (id) DO UPDATE SET
 name=EXCLUDED.name, description=EXCLUDED.description,
 price=EXCLUDED.price, category=EXCLUDED.category;

CREATE TABLE IF NOT EXISTS public.character_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.items(id),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(character_id,item_id)
);
CREATE INDEX IF NOT EXISTS character_items_character_idx ON public.character_items(character_id);

CREATE TABLE IF NOT EXISTS public.character_spells (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  spell text NOT NULL,
  learned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(character_id,spell)
);

CREATE TABLE IF NOT EXISTS public.house_points (
  house text PRIMARY KEY CHECK (house IN ('Gryffindor','Hufflepuff','Ravenclaw','Slytherin')),
  points integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.house_points(house,points) VALUES
 ('Gryffindor',0),('Hufflepuff',0),('Ravenclaw',0),('Slytherin',0)
ON CONFLICT (house) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.house_point_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house text NOT NULL CHECK (house IN ('Gryffindor','Hufflepuff','Ravenclaw','Slytherin')),
  delta integer NOT NULL CHECK (delta <> 0),
  reason text NOT NULL,
  character_id uuid REFERENCES public.characters(id) ON DELETE SET NULL,
  actor_user_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS house_point_ledger_house_created_idx
 ON public.house_point_ledger(house,created_at DESC);

CREATE TABLE IF NOT EXISTS public.house_cup_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  winner_house text CHECK (winner_house IS NULL OR winner_house IN ('Gryffindor','Hufflepuff','Ravenclaw','Slytherin')),
  final_scores jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('scheduled','active','completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);
CREATE UNIQUE INDEX IF NOT EXISTS house_cup_one_active_idx
 ON public.house_cup_seasons(status) WHERE status='active';

CREATE TABLE IF NOT EXISTS public.achievements (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  threshold integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.achievements(id,name,description,category,threshold) VALUES
 ('house-cup-winner-1','House Cup Champion','Win the Hogwarts House Cup once.','house-cup',1),
 ('house-cup-winner-5','Five-Time House Cup Champion','Win the Hogwarts House Cup five times.','house-cup',5),
 ('house-cup-winner-10','Ten-Time House Cup Champion','Win the Hogwarts House Cup ten times.','house-cup',10)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.player_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  achievement_id text NOT NULL REFERENCES public.achievements(id),
  progress integer NOT NULL DEFAULT 0,
  unlocked_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(user_id,achievement_id)
);
CREATE INDEX IF NOT EXISTS player_achievements_user_idx ON public.player_achievements(user_id);

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audience text NOT NULL DEFAULT 'all'
    CHECK (audience IN ('all','Gryffindor','Hufflepuff','Ravenclaw','Slytherin')),
  title text NOT NULL,
  body text NOT NULL,
  kind text NOT NULL DEFAULT 'notice',
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);
CREATE INDEX IF NOT EXISTS announcements_created_idx ON public.announcements(created_at DESC);

-- Atomic score update plus immutable audit entry. Called by trusted server code,
-- never exposed to the browser as an unrestricted RPC.
CREATE OR REPLACE FUNCTION public.apply_house_points(
  p_house text, p_delta integer, p_reason text,
  p_character_id uuid DEFAULT NULL, p_actor_user_id text DEFAULT NULL
) RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_total integer;
BEGIN
  IF p_house NOT IN ('Gryffindor','Hufflepuff','Ravenclaw','Slytherin') THEN
    RAISE EXCEPTION 'Invalid Hogwarts house';
  END IF;
  IF p_delta = 0 OR abs(p_delta) > 1000 THEN
    RAISE EXCEPTION 'Point adjustment outside allowed range';
  END IF;
  IF length(trim(coalesce(p_reason,''))) = 0 THEN
    RAISE EXCEPTION 'A reason is required';
  END IF;
  UPDATE public.house_points
     SET points = points + p_delta, updated_at = now()
   WHERE house = p_house
   RETURNING points INTO new_total;
  IF new_total IS NULL THEN RAISE EXCEPTION 'House score not initialized'; END IF;
  INSERT INTO public.house_point_ledger(house,delta,reason,character_id,actor_user_id)
  VALUES (p_house,p_delta,p_reason,p_character_id,p_actor_user_id);
  RETURN new_total;
END;
$$;
REVOKE ALL ON FUNCTION public.apply_house_points(text,integer,text,uuid,text) FROM PUBLIC;

-- Only authenticated users can read the game data. Character-owned data is
-- isolated by the JWT subject supplied by Neon Auth.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.items, public.house_points, public.house_point_ledger,
 public.house_cup_seasons, public.achievements, public.announcements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.characters TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_items, public.character_spells TO authenticated;
GRANT SELECT ON public.player_achievements TO authenticated;

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_point_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_cup_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY characters_select_own ON public.characters
 FOR SELECT TO authenticated USING (user_id = auth.user_id()::text);
CREATE POLICY characters_insert_own ON public.characters
 FOR INSERT TO authenticated WITH CHECK (user_id = auth.user_id()::text);
CREATE POLICY characters_update_own ON public.characters
 FOR UPDATE TO authenticated USING (user_id = auth.user_id()::text)
 WITH CHECK (user_id = auth.user_id()::text);
CREATE POLICY items_read_authenticated ON public.items
 FOR SELECT TO authenticated USING (true);
CREATE POLICY character_items_select_own ON public.character_items
 FOR SELECT TO authenticated USING (EXISTS (
  SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.user_id()::text
 ));
CREATE POLICY character_items_insert_own ON public.character_items
 FOR INSERT TO authenticated WITH CHECK (EXISTS (
  SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.user_id()::text
 ));
CREATE POLICY character_items_update_own ON public.character_items
 FOR UPDATE TO authenticated USING (EXISTS (
  SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.user_id()::text
 )) WITH CHECK (EXISTS (
  SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.user_id()::text
 ));
CREATE POLICY character_items_delete_own ON public.character_items
 FOR DELETE TO authenticated USING (EXISTS (
  SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.user_id()::text
 ));
CREATE POLICY character_spells_select_own ON public.character_spells
 FOR SELECT TO authenticated USING (EXISTS (
  SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.user_id()::text
 ));
CREATE POLICY character_spells_insert_own ON public.character_spells
 FOR INSERT TO authenticated WITH CHECK (EXISTS (
  SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.user_id()::text
 ));
CREATE POLICY house_points_read_all ON public.house_points
 FOR SELECT TO authenticated USING (true);
CREATE POLICY house_point_ledger_read_all ON public.house_point_ledger
 FOR SELECT TO authenticated USING (true);
CREATE POLICY house_cup_read_all ON public.house_cup_seasons
 FOR SELECT TO authenticated USING (true);
CREATE POLICY achievements_read_all ON public.achievements
 FOR SELECT TO authenticated USING (true);
CREATE POLICY player_achievements_read_own ON public.player_achievements
 FOR SELECT TO authenticated USING (user_id = auth.user_id()::text);
CREATE POLICY announcements_read_all ON public.announcements
 FOR SELECT TO authenticated USING (
  audience = 'all' OR audience = (
   SELECT house FROM public.characters WHERE user_id = auth.user_id()::text LIMIT 1
  )
 );
