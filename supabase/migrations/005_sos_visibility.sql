-- Позволяем всем авторизованным пользователям видеть все сигналы SOS (для уведомлений на карте)
-- Ранее было auth.uid() = user_id, что ограничивало видимость только автором.

DROP POLICY IF EXISTS "Users can view own SOS alerts" ON public.sos_alerts;

CREATE POLICY "Authenticated users can view SOS alerts" 
  ON public.sos_alerts FOR SELECT 
  USING (auth.uid() IS NOT NULL);
