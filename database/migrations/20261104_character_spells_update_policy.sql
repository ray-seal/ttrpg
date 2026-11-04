-- Upserted learned spells must be updateable only for their owning character.
CREATE POLICY character_spells_update_own ON public.character_spells
 FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.characters c
   WHERE c.id=character_id AND c.user_id=auth.user_id()::text)
 ) WITH CHECK (
  EXISTS (SELECT 1 FROM public.characters c
   WHERE c.id=character_id AND c.user_id=auth.user_id()::text)
 );
