-- Миграция: добавление новых мероприятий на Kyz Hub (Ночь музеев, Study in Malaysia)

-- 1. Ночь музеев
INSERT INTO public.events (
  id,
  title,
  description,
  date,
  time,
  location,
  category,
  organizer_id,
  participants_count,
  spots_total,
  contact_url,
  is_online,
  image
) VALUES (
  'b8c4c3e0-6f0a-4b0a-8d1a-4c9f0b3e5a1b',
  'Ночь музеев',
  E'Юбилейная Ночь ждёт Вас! Мы очень рады сообщить, что ставшая уже традицией для города “Ночь музеев” состоится уже совсем скоро - 18 мая. Так что не планируйте ничего другого на этот день, обязательно берите детей и к нам!\nОрганизаторы Ночи творческая группа «OYOUM group» под патронажем Министерства культуры, информации и туризма Кыргызской Республики.',
  '2026-05-18',
  '18:00',
  'Бишкек (КНМИИ им. Г. Айтиева и другие)',
  'Искусство',
  NULL,
  0,
  500,
  'https://ticket.kg/event/noch-muzeev',
  FALSE,
  'https://images.unsplash.com/photo-1518998053401-878c730c5174?w=800&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Study in Malaysia - Алматы
INSERT INTO public.events (
  id,
  title,
  description,
  date,
  time,
  location,
  category,
  organizer_id,
  participants_count,
  spots_total,
  contact_url,
  is_online,
  image
) VALUES (
  'e5d9f1a0-7b0c-4e0d-9f2b-5d0a1b2c3d4e',
  'Study in Malaysia - Алматы',
  E'Вы планируете учиться в Малайзии?\n\nТеперь вы можете встретиться с представителями лучших университетов в городе, где вы живете. На выставке Study in Malaysia вы получите прямую информацию о зачислении, стипендии, стоимости контрактов и студенческой жизни.\n\nУчастие абсолютно бесплатное. Сохраните видео и отметьте дату. Увидимся на выставке.😎',
  '2026-04-25',
  '10:00',
  'Алматы, Rixos Almaty',
  'Образование',
  NULL,
  0,
  200,
  NULL,
  FALSE,
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Study in Malaysia - Астана
INSERT INTO public.events (
  id,
  title,
  description,
  date,
  time,
  location,
  category,
  organizer_id,
  participants_count,
  spots_total,
  contact_url,
  is_online,
  image
) VALUES (
  'f6a0b1c2-3d4e-5f6a-7b8c-9d0e1f2a3b4c',
  'Study in Malaysia - Астана',
  E'Вы планируете учиться в Малайзии?\n\nТеперь вы можете встретиться с представителями лучших университетов в городе, где вы живете. На выставке Study in Malaysia вы получите прямую информацию о зачислении, стипендии, стоимости контрактов и студенческой жизни.\n\nУчастие абсолютно бесплатное. Сохраните видео и отметьте дату. Увидимся на выставке.😎',
  '2026-04-26',
  '10:00',
  'Астана, Rixos President Астана',
  'Образование',
  NULL,
  0,
  200,
  NULL,
  FALSE,
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Study in Malaysia - Бишкек
INSERT INTO public.events (
  id,
  title,
  description,
  date,
  time,
  location,
  category,
  organizer_id,
  participants_count,
  spots_total,
  contact_url,
  is_online,
  image
) VALUES (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Study in Malaysia - Бишкек',
  E'Вы планируете учиться в Малайзии?\n\nТеперь вы можете встретиться с представителями лучших университетов в городе, где вы живете. На выставке Study in Malaysia вы получите прямую информацию о зачислении, стипендии, стоимости контрактов и студенческой жизни.\n\nУчастие абсолютно бесплатное. Сохраните видео и отметьте дату. Увидимся на выставке.😎',
  '2026-04-29',
  '10:00',
  'Бишкек, Технопарк Бишкек',
  'Образование',
  NULL,
  0,
  200,
  NULL,
  FALSE,
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'
)
ON CONFLICT (id) DO NOTHING;
