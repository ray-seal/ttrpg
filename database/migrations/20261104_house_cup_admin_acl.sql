-- These season lifecycle functions must never be callable from browser roles.
REVOKE ALL ON FUNCTION public.start_house_cup(text,timestamptz,timestamptz)
 FROM PUBLIC, authenticated, anonymous;
REVOKE ALL ON FUNCTION public.activate_house_cup(uuid)
 FROM PUBLIC, authenticated, anonymous;
REVOKE ALL ON FUNCTION public.finalize_house_cup(uuid)
 FROM PUBLIC, authenticated, anonymous;
