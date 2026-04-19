-- Migration: Populating Kyz Hub with 10 Premium English Courses
-- This migration adds detailed, high-quality course content across all categories.

INSERT INTO public.events (
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
) VALUES 
-- 1. IT/Coding - AI Course (Requested)
(
  'Technologies That Work for You: How to Organize Your Life Through Apps and AI',
  E'Modern technologies are powerful tools when used intentionally. This workshop helps you transform your devices from distraction sources into personal assistants.\n\nWhat we will cover:\n• Tools that actually help (planning, habit tracking, studying)\n• How to use AI for development, not just for cheating\n• Digital hygiene: how to stay focused, not just scroll\n• Balance: Online vs. Real life\n\nWorkshop practice:\n• Setting up 1–2 apps (planner or tracker)\n• Checklist "My useful digital habits"\n• Mini-case: how AI can help in studies and projects.',
  '2026-06-05',
  '18:00',
  NULL,
  'IT/Кодинг',
  NULL,
  0,
  NULL,
  NULL,
  TRUE,
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
),
-- 2. Craft - Time Management (Requested)
(
  'How Not to Burn Out in School and Social Media: Time Management Without Pressure',
  E'Feeling overwhelmed by school and social media? You are not alone. This course is about managing your energy and attention in a high-pressure world.\n\nWhat we will cover:\n• Why "there is not enough time" — analyzing the real reasons (overload and defocus)\n• How social media affects attention and self-esteem\n• Simple planning systems (flexible, not rigid)\n• How to distribute energy, not just time\n\nWorkshop practice:\n• Analyzing your typical day\n• Creating a mini-plan for the week (study + rest)\n• The "3 priorities instead of 10 tasks" exercise.',
  '2026-06-10',
  '15:00',
  NULL,
  'Творчество',
  NULL,
  0,
  NULL,
  NULL,
  TRUE,
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
),
-- 3. IT/Coding - Mobile App Design
(
  'Mobile App Design: From Idea to Interactive Prototype',
  E'Ever had an idea for an app? Learn how to bring it to life! We will explore the basics of UI/UX design tailored for students.\n\nKey topics:\n• Understanding user needs\n• Creating wireframes and user flows\n• Intro to Figma: Designing your first screen\n• Prototyping interactions\n\nFinal goal: You will have a clickable prototype of your own app idea.',
  '2026-06-12',
  '18:00',
  NULL,
  'IT/Кодинг',
  NULL,
  0,
  NULL,
  NULL,
  TRUE,
  'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80'
),
-- 4. Craft - Digital Art
(
  'Digital Art & Illustration: Finding Your Unique Style',
  E'Unleash your creativity in the digital world. Whether you use an iPad or a graphics tablet, this course will help you find your artistic voice.\n\nModules:\n• Tools of the trade (Procreate/Photoshop)\n• Color theory and composition in digital art\n• Character design fundamentals\n• Building an online portfolio as a young artist\n\nIncludes a speed-painting session and personalized feedback.',
  '2026-06-14',
  '12:00',
  NULL,
  'Творчество',
  NULL,
  0,
  NULL,
  NULL,
  TRUE,
  'https://images.unsplash.com/photo-1569144157591-c46755444ca1?w=800&q=80'
),
-- 5. Sport - Self-Defense
(
  'Self-Defense for Girls: Confidence and Awareness Training',
  E'Safety starts with confidence. This practical course combines physical techniques with mental preparedness.\n\nFocus areas:\n• Situational awareness: How to avoid danger professionally\n• Basic escape techniques and physical boundaries\n• Verbal self-defense and assertive communication\n• Building a "safety mindset" in the urban environment\n\nLed by certified instructors in a supportive environment.',
  '2026-06-16',
  '10:00',
  NULL,
  'Спорт',
  NULL,
  0,
  NULL,
  NULL,
  TRUE,
  'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80'
),
-- 6. Sport - Yoga
(
  'Yoga and Mindfulness for Academic Stress Relief',
  E'Feeling the pressure of exams and deadlines? Take a breath. This course helps you reconnect with your body and calm your mind.\n\nPractice includes:\n• Gentle vinyasa flow for physical tension release\n• Practical breathing techniques for focus\n• Guided meditation for stress reduction\n• Creating a sustainable "self-care" routine at home\n\nNo prior experience required.',
  '2026-06-18',
  '09:00',
  NULL,
  'Спорт',
  NULL,
  0,
  NULL,
  NULL,
  TRUE,
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'
),
-- 7. Volunteer - Social Impact
(
  'Social Impact 101: How to Launch Your Own Grassroots Project',
  E'Do you want to see change in your community? Learn how to make it happen. From identifying problems to implementing solutions.\n\nWhat we will cover:\n• Social entrepreneurship vs. volunteering\n• Grant writing basics for beginners\n• Recruiting and leading a volunteer team\n• Measuring your impact\n\nA practical guide to starting something that matters.',
  '2026-06-20',
  '14:00',
  NULL,
  'Волонтёрство',
  NULL,
  0,
  NULL,
  NULL,
  TRUE,
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'
),
-- 8. Volunteer - Public Speaking
(
  'Public Speaking for Future Leaders: Pitching Your Ideas',
  E'Become a powerful communicator. This workshop is designed to help you overcome stage fright and speak with confidence.\n\nKey skills:\n• Structuring a persuasive speech\n• Body language and vocal variety\n• Storytelling techniques for social causes\n• Handling Q&A with poise\n\nEvery participant will give a 2-minute "pitch" for a cause they believe in.',
  '2026-06-22',
  '16:00',
  NULL,
  'Волонтёрство',
  NULL,
  0,
  NULL,
  NULL,
  TRUE,
  'https://images.unsplash.com/photo-1505373633132-ba7d7303cebb?w=800&q=80'
),
-- 9. Cooking - Meal Prep
(
  'Healthy & Fast: Meal Prepping for a Busy School Week',
  E'Stop relying on snacks and learn how to fuel your brain! This course teaches you how to prep delicious, healthy meals in under 2 hours for the whole week.\n\nHighlights:\n• Smart grocery shopping on a student budget\n• 5 core recipes with multiple variations\n• Storage tips to keep food fresh\n• Nutrition basics for energy and skin health\n\nIncludes a downloadable PDF recipe book.',
  '2026-06-24',
  '11:00',
  NULL,
  'Кулинария',
  NULL,
  0,
  NULL,
  NULL,
  TRUE,
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80'
),
-- 10. Cooking - Baking Science
(
  'The Art of Pastry: Modern Desserts with Local Ingredients',
  E'Take your baking to the next level by understanding contemporary techniques and the chemistry of ingredients.\n\nTopics:\n• Texture analysis: From crispy to fluffy\n• Working with local fruits and berries in modern ways\n• Plate styling and presentation aesthetics\n• Building your brand as a young pastry chef\n\nGreat for aspiring entrepreneurs in the food industry.',
  '2026-06-26',
  '13:00',
  NULL,
  'Кулинария',
  NULL,
  0,
  NULL,
  NULL,
  TRUE,
  'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80'
)
ON CONFLICT DO NOTHING;
