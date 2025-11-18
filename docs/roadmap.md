# Roadmap: Stage 2D, 3, 4

**Проект:** Product Showcase
**Текущий статус:** Stage 2C Complete
**Дата:** Ноябрь 2025

---

## Stage 2D: Error Handling & Guards (Remaining)

**Цель:** завершить обработку ошибок и edge cases

### Задачи

**1. not-found.tsx для продуктов**

- app/products/[id]/not-found.tsx
- Валидация ID (числовой формат для API-продуктов, отрицательный для локальных)
- Обработка несуществующих ID
- UI для 404 состояния

**2. Global ErrorBoundary**

- app/layout.tsx - обёртка ErrorBoundary
- Обработка фатальных ошибок
- Fallback UI с кнопкой "Reset app"
- Логирование ошибок (опционально)

**3. Edge Cases Guards**

- Валидация при гидрации localStorage
- Обработка некорректных данных
- Graceful degradation при ошибках persist

**DoD:**

- 404 страница работает для невалидных ID
- ErrorBoundary ловит фатальные ошибки
- Приложение не крашится при некорректных данных
- Все edge cases покрыты тестами

---

## Stage 3: UI Polish & UX

**Цель:** визуальное оформление и улучшение UX

### 3.1 Визуальное оформление

**Tailwind тема:**

- Цветовая палитра
- Типографика
- Spacing система
- Консистентные стили

**Адаптивность:**

- Mobile-first подход
- Breakpoints: sm, md, lg, xl
- Адаптивный грид продуктов
- Мобильная навигация

**Иконки:**

- Библиотека иконок (heroicons / lucide-react)
- Консистентное использование
- Accessibility (aria-labels)

### 3.2 Состояния UI

**Loading States:**

- Улучшенные Skeleton компоненты
- Shimmer эффекты
- Progressive loading

**Error States:**

- Визуальные компоненты ошибок
- Иллюстрации для пустых состояний
- Дружественные сообщения

**Empty States:**

- Разные сообщения для разных контекстов
- Call-to-action кнопки
- Иллюстрации

### 3.3 UX компоненты

**Tooltip:**

- Подсказки для кнопок
- Информация о фильтрах
- Библиотека: Radix UI / Headless UI

**Toast:**

- Уведомления об успехе/ошибке
- При создании/удалении продукта
- Автозакрытие через 3-5 сек

**Modal improvements:**

- Анимации открытия/закрытия
- Backdrop blur
- Focus trap
- ESC для закрытия

### 3.4 Анимации (опционально)

**Framer Motion:**

- Transitions между страницами
- Hover эффекты на карточках
- Skeleton fade-in
- List animations (stagger)

### 3.5 Light/Dark Mode (опционально)

**Theme Toggle:**

- Переключатель темы
- Persist в localStorage
- CSS variables для цветов
- Tailwind dark: mode

### 3.6 Accessibility

**A11y improvements:**

- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader testing

**DoD Stage 3:**

- Адаптивный дизайн на всех breakpoints
- Анимации плавные и не отвлекают
- Toast/Tooltip работают
- Accessibility score > 90
- Lighthouse Performance > 80

---

## Stage 4: Tests & SEO / Finalization

**Цель:** production-ready состояние

### 4.1 Unit & Integration Tests

**Coverage targets:**

- Features: 80%+
- Widgets: 70%+
- Entities: 80%+

**Приоритеты:**

- Фильтры (все комбинации)
- Пагинация (edge cases)
- LocalProducts (create/edit/delete)
- Favorites (toggle, cleanup)

### 4.2 E2E Tests (Playwright)

**Основные потоки:**

1. Просмотр списка → детали → назад
2. Поиск → фильтрация → пагинация
3. Создание продукта → редактирование → удаление
4. Добавление в избранное → фильтр "только избранное"
5. Reset local data → проверка очистки

**Edge cases E2E:**

- Некорректный ID продукта → 404
- API недоступен (mock fallback)
- Быстрая навигация (race conditions)

### 4.3 SEO метаданные

**Next.js Metadata API:**

- Динамические title/description для продуктов
- Open Graph tags
- Twitter cards
- Canonical URLs

**Пример:**

```typescript
// app/products/[id]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)
  return {
    title: product.title,
    description: product.description,
    openGraph: { images: [product.image] },
  }
}
```

### 4.4 404/500 страницы (визуальные)

**app/not-found.tsx:**

- Стильная 404 страница
- Навигация на главную
- Поиск (опционально)

**app/error.tsx:**

- 500 error page
- Reset app кнопка
- Support contact (опционально)

### 4.5 Performance Optimization

**Lighthouse / Core Web Vitals:**

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Performance score > 90

**Оптимизации:**

- Code splitting (dynamic imports)
- next/image для всех изображений
- Bundle analysis (webpack-bundle-analyzer)
- React.lazy для тяжёлых компонентов
- Prefetch для критичных роутов

**Bundle size:**

- Анализ зависимостей
- Tree-shaking проверка
- Удаление неиспользуемого кода

### 4.6 Финальная документация

**README.md:**

- Feature overview
- Quick start
- Development guide
- Deployment

**Architecture docs:**

- Обновление всех документов
- Диаграммы (опционально)
- Decision records

**CHANGELOG.md:**

- Все релизы
- Breaking changes
- Migration guides

### 4.7 Production Deployment

**Vercel / GitHub Pages:**

- CI/CD настройка
- Environment variables
- Preview deployments
- Analytics (опционально)

**DoD Stage 4:**

- E2E тесты покрывают основные флоу
- Lighthouse score > 90
- SEO метаданные для всех страниц
- 404/500 визуально оформлены
- README актуален
- Production deployment работает

---

## Опциональные улучшения (Stage 5+)

**Если останется время:**

### Mock Fallback Strategy

- Network → Cache → Mocks flow
- Offline support
- Service Worker (опционально)

### Advanced Features

- Сортировки (цена, рейтинг, дата)
- Сохранённые поиски
- История просмотров
- Сравнение продуктов

### Developer Experience

- Storybook для UI-кита
- Visual regression testing
- Commit conventions (conventional commits)
- Auto-changelog generation

### Monitoring & Analytics

- Error tracking (Sentry)
- Analytics (Google Analytics / Plausible)
- Performance monitoring

---

## Приоритеты

**Must Have (MVP):**

- Stage 2D (error handling)
- Stage 3.1-3.3 (UI polish, базовый UX)
- Stage 4.1-4.3 (основные тесты, SEO)

**Should Have:**

- Stage 3.4 (анимации)
- Stage 4.4-4.5 (визуальные ошибки, performance)
- Stage 4.6-4.7 (документация, deployment)

**Nice to Have:**

- Stage 3.5 (dark mode)
- Stage 5+ (опциональные улучшения)

---

## Оценка времени (ориентировочно)

- **Stage 2D:** 1-2 рабочих дня
- **Stage 3:** 3-5 рабочих дней
- **Stage 4:** 3-5 рабочих дней

**Total MVP:** ~1-2 недели работы

---

**Документ создан:** Ноябрь 2025
**Следующий шаг:** Stage 2D - Error Handling
