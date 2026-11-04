-- House Cup seasons, permanent winner history and lifetime achievements.
-- These administrative functions are intentionally not executable by browser users.
CREATE TABLE IF NOT EXISTS public.house_cup_wins (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 season_id uuid NOT NULL REFERENCES public.house_cup_seasons(id) ON DELETE CASCADE,
 user_id text NOT NULL,
 house text NOT NULL CHECK (house IN ('Gryffindor','Hufflepuff','Ravenclaw','Slytherin')),
 won_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(season_id,user_id)
);
CREATE INDEX IF NOT EXISTS house_cup_wins_user_idx ON public.house_cup_wins(user_id,won_at DESC);
GRANT SELECT ON public.house_cup_wins TO authenticated;
ALTER TABLE public.house_cup_wins ENABLE ROW LEVEL SECURITY;
CREATE POLICY house_cup_wins_read_own ON public.house_cup_wins
 FOR SELECT TO authenticated USING (user_id=auth.user_id()::text);

CREATE OR REPLACE FUNCTION public.start_house_cup(
 p_name text,p_starts_at timestamptz,p_ends_at timestamptz
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_id uuid;
BEGIN
 IF length(trim(coalesce(p_name,'')))=0 OR p_ends_at<=p_starts_at THEN
  RAISE EXCEPTION 'Invalid House Cup season details';
 END IF;
 IF EXISTS (SELECT 1 FROM public.house_cup_seasons WHERE status='active') THEN
  RAISE EXCEPTION 'A House Cup season is already active';
 END IF;
 INSERT INTO public.house_cup_seasons(name,starts_at,ends_at,status)
 VALUES(p_name,p_starts_at,p_ends_at,CASE WHEN p_starts_at<=now() THEN 'active' ELSE 'scheduled' END)
 RETURNING id INTO v_id;
 IF p_starts_at<=now() THEN
  UPDATE public.house_points SET points=0,updated_at=now();
 END IF;
 RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.activate_house_cup(p_season_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_start timestamptz; v_status text;
BEGIN
 SELECT starts_at,status INTO v_start,v_status FROM public.house_cup_seasons
  WHERE id=p_season_id FOR UPDATE;
 IF NOT FOUND OR v_status<>'scheduled' OR v_start>now() THEN
  RAISE EXCEPTION 'House Cup season is not ready to activate';
 END IF;
 IF EXISTS (SELECT 1 FROM public.house_cup_seasons WHERE status='active') THEN
  RAISE EXCEPTION 'Another House Cup season is already active';
 END IF;
 UPDATE public.house_points SET points=0,updated_at=now();
 UPDATE public.house_cup_seasons SET status='active' WHERE id=p_season_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.finalize_house_cup(p_season_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
 v_season public.house_cup_seasons%ROWTYPE;
 v_scores jsonb;
 v_top integer;
 v_winner text;
 v_winners integer;
BEGIN
 SELECT * INTO v_season FROM public.house_cup_seasons
  WHERE id=p_season_id FOR UPDATE;
 IF NOT FOUND OR v_season.status<>'active' OR v_season.ends_at>now() THEN
  RAISE EXCEPTION 'House Cup season is not ready to finalize';
 END IF;
 SELECT jsonb_object_agg(house,points),max(points),
  count(*) FILTER (WHERE points=(SELECT max(points) FROM public.house_points))
  INTO v_scores,v_top,v_winners FROM public.house_points;
 IF v_winners=1 THEN
  SELECT house INTO v_winner FROM public.house_points WHERE points=v_top LIMIT 1;
 END IF;
 UPDATE public.house_cup_seasons SET status='completed',winner_house=v_winner,
  final_scores=coalesce(v_scores,'{}'::jsonb) WHERE id=p_season_id;
 IF v_winner IS NOT NULL THEN
  INSERT INTO public.house_cup_wins(season_id,user_id,house)
  SELECT p_season_id,c.user_id,v_winner FROM public.characters c WHERE c.house=v_winner
  ON CONFLICT (season_id,user_id) DO NOTHING;

  INSERT INTO public.player_achievements(user_id,achievement_id,progress,unlocked_at,metadata)
  SELECT wins.user_id,a.id,wins.win_count,
    CASE WHEN wins.win_count>=a.threshold THEN now() ELSE NULL END,
    jsonb_build_object('house',v_winner)
  FROM (
    SELECT user_id,count(*)::integer AS win_count FROM public.house_cup_wins
     WHERE user_id IN (SELECT user_id FROM public.house_cup_wins WHERE season_id=p_season_id)
     GROUP BY user_id
  ) wins
  CROSS JOIN public.achievements a
  WHERE a.category='house-cup'
  ON CONFLICT (user_id,achievement_id) DO UPDATE SET
    progress=EXCLUDED.progress,
    unlocked_at=COALESCE(public.player_achievements.unlocked_at,EXCLUDED.unlocked_at),
    metadata=EXCLUDED.metadata;

  INSERT INTO public.announcements(audience,title,body,kind)
  VALUES('all','The House Cup has been awarded',
   v_winner || ' has won ' || v_season.name || '! Final scores: ' || v_scores::text,
   'house-cup');
 ELSE
  INSERT INTO public.announcements(audience,title,body,kind)
  VALUES('all','The House Cup is tied',
   'The season ended in a tie. Final scores: ' || coalesce(v_scores,'{}'::jsonb)::text,
   'house-cup');
 END IF;
 RETURN v_winner;
END;
$$;

REVOKE ALL ON FUNCTION public.start_house_cup(text,timestamptz,timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.activate_house_cup(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.finalize_house_cup(uuid) FROM PUBLIC;
