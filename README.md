# Artix — архитектура

## 🎯 Идея

Artix — фриланс-биржа для художников в стиле космической галереи. Художники показывают работы, продают услуги, получают заказы. Заказчики ищут таланты.

## 🏗 Стек

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4** + **shadcn/ui**
- **Framer Motion** — анимации
- **Supabase** — БД + Auth + Storage + Realtime
- **Matter.js** — физика лоадера
- **Lenis** — плавный скролл
- **react-easy-crop** — кроп
- **Vercel** — хостинг

## 🎨 Дизайн

- Тёмный фон `#0a0a0f`, карточки `#16161f`
- Акценты: `#6C63FF` (фиолет), `#B794F6` (светло-фиолет), `#4FD1C5` (бирюза)
- Шрифты: Space Grotesk, Unbounded (заголовки), Inter (текст)
- Классы: `glass`, `gradient-text`, `display-title`

## 🚀 Страницы

### Главная `/`
- `Loader` (Matter.js) → `HeroGalaxy`
- Луна, ARTIX, летающие карточки, печатающийся текст
- Кнопки «Смотреть галактику» / «Присоединиться»

### Ленты
- `/feed` — работы (masonry)
- `/services` — услуги
- `/orders` — заказы (только `status = 'open'`)

### Детали
- `/artwork/[id]`, `/service/[id]`, `/order/[id]`
- `/artist/[username]` — профиль с табами
- `/artists` — список художников
- `/about`, `/gallery`, `/upload`

### Auth
- `/auth/login`, `/auth/sign-up`, `/auth/sign-up-success`
- `/auth/callback`, `/auth/confirm` — OTP
- `/auth/forgot-password`, `/auth/update-password`
- `/auth/auth-code-error`, `/auth/error`

### Приватные
- `/settings/profile`
- `/messages`, `/chat/[id]`
- `/deals`, `/deals/[id]`

## 🗄 БД (Supabase)

### Основные таблицы

**`profiles`**
- `id` (uuid, FK `auth.users`), `username` (unique), `display_name`
- `avatar_url`, `cover_url`, `bio`, `role` (`artist|client|both`), `price_range`
- `is_sponsor` (синхронизируется триггером из `sponsorships`)
- `last_seen_at` (для онлайн-индикатора)
- Соцсети: `telegram_url`, `instagram_url`, `tiktok_url`, `vk_url`, `discord_url`, `boosty_url`, `behance_url`, `artstation_url`, `website_url`

**`artworks`**
- `artist_id`, `title`, `description`, `image_url`
- `category`, `price`, `tags` (`text[]`)
- `likes_count` (триггер от `likes`), `views_count` (RPC)

**`services`**
- `artist_id`, `title`, `description`, `image_url`
- `category`, `price`, `price_type` (`from|exact|range`), `price_to`
- `delivery_days`, `tags`, `is_active`, `views_count`

**`orders`**
- `client_id`, `title`, `description`, `image_url`
- `category`, `budget`, `budget_type`, `budget_to`, `deadline_days`
- `tags`, `status` (`open|in_progress|done|cancelled`)
- `responses_count` (триггер от `responses`), `views_count`

**`likes`**
- `user_id`, `artwork_id`, `created_at`
- UNIQUE `(user_id, artwork_id)`

**`chats`**
- `user1_id`, `user2_id` (CHECK `user1_id < user2_id`, UNIQUE `(user1_id, user2_id)`)
- `last_message`, `last_message_at`, `user1_unread`, `user2_unread`

**`messages`**
- `chat_id`, `sender_id`, `text`, `image_url`, `message_type` (`text|image`)
- `is_read` (обновляется RPC `mark_chat_messages_read`)

**`responses`**
- `order_id`, `artist_id`, `message`, `price`, `delivery_days`, `status`
- UNIQUE `(order_id, artist_id)`

**`reviews`**
- `author_id`, `target_id`, `deal_id`, `rating`, `comment`
- UNIQUE `(author_id, target_id, deal_id)`

**`deals`** (эскроу-имитация)
- `client_id`, `artist_id`, `service_id`, `order_id`
- `title`, `description`, `amount`, `commission_percent`, `commission_amount`, `artist_amount`
- `status` (`pending|paid|in_progress|completed|disputed|cancelled`)
- `client_paid`, `artist_completed`, `client_confirmed`
- `paid_at`, `completed_at`

**`transactions`**
- `deal_id`, `user_id`, `type`, `amount`, `status`, `description`

**`sponsorships`**
- `user_id`, `amount`, `months`, `source` (`boosty`), `is_active`, `expires_at`, `external_id`

### Storage buckets

- **`artworks`** (PUBLIC, 10MB, image/*)
- **`avatars`** (PUBLIC, 5MB, image/*)
- **`chat-images`** (PRIVATE, 5MB, image/*) — через signed URLs

### Триггеры

- `handle_new_user` — создаёт профиль при регистрации, разрешает коллизии username (`user`, `user1`, `user2`)
- `on_like_change` → `update_artwork_likes_count`
- `on_message_insert` → `update_chat_last_message` (картинки → «📷 Фото»)
- `on_response_change` → `update_order_responses_count`
- `on_sponsorship_change` → `sync_sponsor_status`

### RPC

- `increment_artwork_views(id)`, `increment_order_views(id)`, `increment_service_views(id)`
- `mark_chat_messages_read(chat_id)` — помечает `is_read` и сбрасывает unread
- `recalc_all_sponsors()` — ручной пересчёт `is_sponsor`

### RLS

- `profiles` — SELECT всем, UPDATE только владельцу
- `artworks`, `services`, `orders`, `likes`, `responses` — SELECT всем, CRUD только владельцу
- `chats`, `messages` — только участники
- `deals`, `transactions` — только `client_id`/`artist_id`
- `sponsorships` — SELECT всем, INSERT только `service_role`

## 📦 Переменные окружения

## 🧩 Ключевые компоненты

- `HomeContent` — лоадер + hero
- `HeroGalaxy` — луна, карточки, ARTIX
- `Loader` — Matter.js, прогресс 0→100
- `AuthProvider` — контекст, `requireAuth`, `pendingAction` после логина
- `ChatWindow` — realtime, типинг, signed URLs, `mark_chat_messages_read`
- `DealModal`, `DealPageContent` — эскроу-имитация
- `Gallery3D` — 3D-галерея, режимы «СФЕРА» / «СПИРАЛЬ»
- `UploadForm` — публикация работы/услуги/заказа
- `ProfileEditForm` — аватар, обложка, био, роль, соцсети

## 🛠 Утилиты

- `lib/constants.ts` — категории, форматы, статусы
- `lib/use-body-scroll-lock.ts` — реф-счётчик для `overflow: hidden`
- `lib/utils.ts` — `cn()` для Tailwind
- `lib/supabase/{client,server,proxy}.ts`

## 📝 Заметки

- `deals` / `transactions` — **имитация** эскроу. Реальной оплаты нет.
- `SponsorModal` — прямой перевод на карту, не эквайринг.
- `artworks.price` — nullable, но через UI не задаётся. Оставлен для старых данных.
- `chat-images` — PRIVATE, доступ через signed URL (7 дней).