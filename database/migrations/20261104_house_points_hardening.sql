-- Harden shared house-point awards.
-- One award per character per known quest; all score changes are atomic and
-- tied to the signed-in Neon Auth user and that user's Hogwarts house.

CREATE TABLE IF NOT EXISTS public.quest_catalog (
  id text PRIMARY KEY,
  house text NOT NULL CHECK (house IN ('Gryffindor','Hufflepuff','Ravenclaw','Slytherin')),
  title text NOT NULL,
  success_delta integer NOT NULL,
  fail_delta integer NOT NULL,
  active boolean NOT NULL DEFAULT true
);

INSERT INTO public.quest_catalog(id,house,title,success_delta,fail_delta)
VALUES ('fly-flag','Ravenclaw','Fly the House Flag',10,-5)
ON CONFLICT (id) DO UPDATE SET
 house=EXCLUDED.house,title=EXCLUDED.title,
 success_delta=EXCLUDED.success_delta,fail_delta=EXCLUDED.fail_delta,active=true;

ALTER TABLE public.house_point_ledger
 ADD COLUMN IF NOT EXISTS quest_id text REFERENCES public.quest_catalog(id);

CREATE UNIQUE INDEX IF NOT EXISTS house_point_ledger_character_quest_uq
 ON public.house_point_ledger(character_id,quest_id) WHERE quest_id IS NOT NULL;

GRANT SELECT ON public.quest_catalog TO authenticated;
ALTER TABLE public.quest_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY quest_catalog_read_all ON public.quest_catalog
 FOR SELECT TO authenticated USING (active=true);

DROP FUNCTION IF EXISTS public.apply_house_points(text,integer,text,uuid,text);
CREATE FUNCTION public.apply_house_points(
 p_house text,p_delta integer,p_reason text,p_character_id uuid,p_quest_id text
) RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
 v_user_id text;
 v_character_house text;
 v_success_delta integer;
 v_fail_delta integer;
 v_total integer;
BEGIN
 v_user_id := auth.user_id()::text;
 IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;

 SELECT house INTO v_character_house FROM public.characters
  WHERE id=p_character_id AND user_id=v_user_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Character not found for current user'; END IF;
 IF v_character_house IS DISTINCT FROM p_house THEN RAISE EXCEPTION 'House mismatch'; END IF;

 SELECT success_delta,fail_delta INTO v_success_delta,v_fail_delta
  FROM public.quest_catalog WHERE id=p_quest_id AND house=p_house AND active=true;
 IF NOT FOUND THEN RAISE EXCEPTION 'Quest is not eligible for house points'; END IF;
 IF p_delta NOT IN (v_success_delta,v_fail_delta) THEN
  RAISE EXCEPTION 'Invalid point adjustment for quest';
 END IF;
 IF length(trim(coalesce(p_reason,'')))=0 THEN RAISE EXCEPTION 'A reason is required'; END IF;

 IF EXISTS (SELECT 1 FROM public.house_point_ledger
            WHERE character_id=p_character_id AND quest_id=p_quest_id) THEN
  SELECT points INTO v_total FROM public.house_points WHERE house=p_house;
  RETURN v_total;
 END IF;

 UPDATE public.house_points SET points=points+p_delta,updated_at=now()
  WHERE house=p_house RETURNING points INTO v_total;
 IF v_total IS NULL THEN RAISE EXCEPTION 'House score not initialized'; END IF;

 INSERT INTO public.house_point_ledger(house,delta,reason,character_id,actor_user_id,quest_id)
 VALUES(p_house,p_delta,p_reason,p_character_id,v_user_id,p_quest_id);
 RETURN v_total;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_house_points(text,integer,text,uuid,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_house_points(text,integer,text,uuid,text) TO authenticated;
