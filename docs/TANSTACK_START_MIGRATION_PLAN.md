# TanStack Start Migration Plan — Weekendly (Web-Only)

Migration from React Native + Expo to TanStack Start (full-stack web). This plan assumes **web-only** output—no native targets.

---

## 1. Current State Summary

| Layer | Current | Notes |
|-------|---------|-------|
| **Framework** | React Native + Expo 52 | Metro bundler, react-native-web |
| **Routing** | Expo Router (file-based) | `app/` directory, typed routes |
| **Styling** | NativeWind 4 (Tailwind for RN) | `web:` prefix for web-specific styles |
| **UI Primitives** | @rn-primitives + React Native | Pressable, View, ScrollView, etc. |
| **Auth** | @clerk/clerk-expo | SecureStore token cache |
| **Backend** | Supabase + Expo API routes | Cloudinary, RENIEC, profile APIs |
| **State** | Zustand | Stores: plans, profiles, invitations, search, comments |
| **Forms** | RHF + Zod | Already web-compatible |
| **Icons** | lucide-react-native | Need lucide-react |

---

## 2. Target Stack

| Layer | Target | Rationale |
|-------|--------|-----------|
| **Framework** | TanStack Start (Vite + React) | Full-stack, SSR/SSG, file-based routing |
| **Routing** | TanStack Router | File-based, type-safe, similar mental model |
| **Styling** | Tailwind CSS (standard) | Drop NativeWind, use standard Tailwind |
| **UI** | shadcn/ui | Web-native, matches your folder structure |
| **Auth** | @clerk/clerk-react | Web SDK, cookie/session-based |
| **Backend** | TanStack Start API routes | Server functions / route handlers |
| **State** | Zustand (keep) | No change |
| **Forms** | RHF + Zod (keep) | No change |

---

## 3. Migration Phases

### Phase 1: Project Bootstrap

1. **Create new TanStack Start app** (alongside or replace)
   - `npm create @tanstack/start@latest` or equivalent
   - Choose Vite, TypeScript, Tailwind

2. **Configure folder structure** (match your conventions)
   ```
   app/           → routes/ (TanStack Router file-based)
   components/
   config/
   context/
   features/
   hooks/
   lib/
   queries/
   services/
   stores/
   styles/
   types/
   ```

3. **Port environment variables**
   - `EXPO_PUBLIC_*` → `VITE_*` or `PUBLIC_*` (TanStack Start convention)
   - Clerk, Supabase, Cloudinary keys

---

### Phase 2: Core Infrastructure

| Task | From | To |
|------|------|-----|
| **Supabase client** | `lib/supabase.ts` | Same logic, drop `Platform.OS` checks; use `localStorage` for web session |
| **Clerk** | `@clerk/clerk-expo` + SecureStore | `@clerk/clerk-react` + standard web auth flow |
| **Token cache** | SecureStore | Cookies or `localStorage` (Clerk web handles this) |
| **API routes** | `app/api/*+api.ts` (Expo) | `routes/api/` or server functions in TanStack Start |

---

### Phase 3: Styling Migration

1. **Remove NativeWind**
   - Drop `nativewind` preset from `tailwind.config`
   - Remove `nativewind-env.d.ts`, `postinstall` script for NativeWind
   - Use standard Tailwind (no `web:` or `native:` prefixes)

2. **Port `global.css`**
   - Your CSS variables (`:root`, `.dark`) are already web-ready
   - Keep as-is, ensure Tailwind content paths include new route/components dirs

3. **Update Tailwind config**
   - Remove `hairlineWidth` and NativeWind-specific theme
   - Keep your color palette, radius, animations

---

### Phase 4: UI Component Migration

**Strategy:** Replace RN primitives with HTML + shadcn/ui. Do this incrementally per screen.

| RN / @rn-primitives | Web Replacement |
|--------------------|-----------------|
| `View` | `div` |
| `ScrollView` | `div` with `overflow-auto` or `overflow-y-auto` |
| `Pressable` / `TouchableOpacity` | `button` or `div` with `onClick` + `role="button"` |
| `Text` | `span` / `p` |
| `Image` (expo-image) | `img` or TanStack Start's image handling |
| `ActivityIndicator` | shadcn `Loader2` spinner or custom |
| `KeyboardAvoidingView` | CSS or remove (web handles differently) |
| `RefreshControl` | Custom pull-to-refresh or simple refetch button |
| `FlashList` | `@tanstack/react-virtual` or simple `map()` |
| `BottomSheet` (@gorhom) | Radix Dialog / Sheet (shadcn) |
| `BlurView` | `backdrop-filter: blur()` |
| `LinearGradient` | CSS `linear-gradient` |
| `PortalHost` | Radix Portal (shadcn uses it) |

**shadcn/ui components to add** (based on your current UI):
- `button`, `input`, `textarea`, `label`, `card`
- `dialog`, `sheet`, `accordion`, `tabs`, `select`, `switch`, `radio-group`
- `avatar`, `badge`, `progress`, `separator`, `tooltip`, `alert-dialog`

**Icons:** `lucide-react-native` → `lucide-react` (same API, different package)

---

### Phase 5: Route Mapping

| Expo Router | TanStack Router |
|-------------|-----------------|
| `app/(screens)/index.tsx` | `routes/index.tsx` |
| `app/(screens)/notifications.tsx` | `routes/notifications.tsx` |
| `app/(screens)/search.tsx` | `routes/search.tsx` |
| `app/(screens)/my-profile/index.tsx` | `routes/my-profile/index.tsx` |
| `app/(screens)/my-profile/edit.tsx` | `routes/my-profile/edit.tsx` |
| `app/(screens)/my-profile/my-plans.tsx` | `routes/my-profile/my-plans.tsx` |
| `app/(screens)/my-profile/matches.tsx` | `routes/my-profile/matches.tsx` |
| `app/(screens)/plans/index.tsx` | `routes/plans/index.tsx` |
| `app/(screens)/plans/create.tsx` | `routes/plans/create.tsx` |
| `app/(screens)/plans/plan/[id].tsx` | `routes/plans/plan/$id.tsx` |
| `app/(screens)/plans/profile/[id].tsx` | `routes/plans/profile/$id.tsx` |
| `app/(auth)/onboarding/step-1.tsx` | `routes/onboarding/step-1.tsx` |
| `app/(auth)/onboarding/step-2.tsx` | `routes/onboarding/step-2.tsx` |
| `app/(auth)/onboarding/step-3.tsx` | `routes/onboarding/step-3.tsx` |
| `app/(auth)/onboarding/auth/sign-in.tsx` | `routes/auth/sign-in.tsx` |
| `app/(auth)/onboarding/auth/sign-up.tsx` | `routes/auth/sign-up.tsx` |
| `app/(auth)/onboarding/auth/preferences-1.tsx` | `routes/auth/preferences-1.tsx` |
| `app/(auth)/onboarding/auth/preferences-2.tsx` | `routes/auth/preferences-2.tsx` |
| `app/+not-found.tsx` | `routes/__root.tsx` 404 or `routes/$.tsx` |

**Layouts:**
- `app/_layout.tsx` → `routes/__root.tsx` (root layout)
- `app/(screens)/_layout.tsx` → `routes/_layout.tsx` or layout route
- `app/(auth)/_layout.tsx` → Auth layout route
- `app/(screens)/my-profile/_layout.tsx` → `routes/my-profile/_layout.tsx`
- `app/(screens)/plans/_layout.tsx` → `routes/plans/_layout.tsx`

---

### Phase 6: API Routes Migration

| Expo API | TanStack Start |
|----------|----------------|
| `app/api/cloudinary+api.ts` | Server function or `routes/api/cloudinary.ts` |
| `app/api/feedback+api.ts` | Same pattern |
| `app/api/profile/[id]+api.ts` | `routes/api/profile/$id.ts` |
| `app/api/reniec/[dni]+api.ts` | `routes/api/reniec/$dni.ts` |

TanStack Start uses Vinxi/Vite server. API routes are typically:
- Server functions (callable from client)
- Or HTTP route handlers in `routes/api/`

---

### Phase 7: Native-Only Features → Web Alternatives

| Feature | Current | Web Replacement |
|---------|---------|-----------------|
| **expo-image-picker** | Native picker | `<input type="file" accept="image/*">` |
| **expo-secure-store** | SecureStore | `localStorage` or Clerk cookies |
| **expo-av** (sound) | Audio.Sound | Web Audio API or `<audio>` |
| **Vibration** | `Vibration.vibrate()` | Remove or no-op on web |
| **Share** (native) | `Share.share()` | `navigator.share()` or clipboard |
| **expo-location** | Native GPS | `navigator.geolocation` |
| **expo-blur** | BlurView | `backdrop-filter: blur()` |
| **expo-linear-gradient** | LinearGradient | CSS `linear-gradient` |
| **NetInfo** | Network status | `navigator.onLine` |
| **DateTimePicker** (native) | Modal picker | `react-datepicker` (already used on web) |
| **@rnmapbox/maps** | In plugins, not used in code | Remove; add `mapbox-gl` (web) later if needed |

---

### Phase 8: Auth & Protected Routes

1. **Clerk web setup**
   - Wrap app with `ClerkProvider` from `@clerk/clerk-react`
   - Use `SignedIn` / `SignedOut` / `RedirectToSignIn` for route guards

2. **Route protection**
   - Expo: `useSegments` + `router.push` in `useEffect`
   - TanStack: Route-level `beforeLoad` or layout check
   - Example: redirect unauthenticated users from `/plans/*` to `/auth/sign-in`

3. **Supabase + Clerk**
   - Keep `createClerkSupabaseClient` pattern
   - Ensure `getToken` works with Clerk web (same JWT template)

---

### Phase 9: Stores & Data Fetching

- **Zustand stores:** Copy as-is; they're framework-agnostic
- **Supabase calls:** Same; ensure client uses web-compatible storage
- **Optional:** Migrate to TanStack Query for server state (plans, profiles, etc.)—can be done incrementally

---

### Phase 10: Removed Dependencies (No Longer Needed)

```
@animatereactnative/marquee
@gorhom/bottom-sheet
@react-native-async-storage/async-storage  → use localStorage or similar
@react-native-community/datetimepicker
@react-native-community/netinfo
@react-navigation/native
@rn-primitives/* (all)
@rnmapbox/maps
@shopify/flash-list
expo-*
lucide-react-native
react-native-*
nativewind
sonner-native → sonner (web)
```

---

## 4. Suggested Order of Work

1. **Bootstrap** — New TanStack Start project, folder structure, env
2. **Infrastructure** — Supabase, Clerk, API routes
3. **Root layout** — Theme, fonts, ClerkProvider, Toaster
4. **shadcn/ui** — Install and port `components/ui/` one-by-one
5. **Auth routes** — sign-in, sign-up, onboarding (simplest screens first)
6. **Main screens** — index, search, notifications
7. **Plans flow** — list, detail, create, profile
8. **My profile** — index, edit, my-plans, matches
9. **Bottom sheets** → Dialogs/Sheets
10. **Polish** — Animations (framer-motion if needed), responsive, dark mode

---

## 5. Risk Areas

| Risk | Mitigation |
|------|------------|
| **Clerk Supabase JWT** | Verify template works with web SDK; test RLS |
| **Image upload** | Cloudinary API is standard; ensure CORS and env vars |
| **RENIEC API** | Server-side only; port to TanStack server route |
| **Complex animations** | react-native-reanimated → framer-motion or CSS |
| **Bottom sheets UX** | Radix Sheet is different; may need custom styling |

---

## 6. Quick Reference: Component Swap Cheat Sheet

```tsx
// Before (RN)
<View className="flex-1">
  <Pressable onPress={fn}>
    <Text>Click</Text>
  </Pressable>
</View>

// After (Web)
<div className="flex-1">
  <button onClick={fn}>
    <span>Click</span>
  </button>
</div>
```

```tsx
// Before
<ScrollView refreshControl={<RefreshControl ... />}>

// After
<div className="overflow-y-auto">
  {/* Use TanStack Query refetch or manual state */}
</div>
```

```tsx
// Before
router.push("/(screens)/plans/create")

// After
navigate({ to: "/plans/create" })
// or
<Link to="/plans/create">
```

---

## 7. Estimated Scope

- **High impact:** All `components/`, all `app/` routes, `lib/supabase.ts`, root layout
- **Medium impact:** API routes, auth flow, stores (if switching to TanStack Query)
- **Low impact:** Types, schemas, utils, hooks (most are portable)

---

*Document generated for Weekendly migration to TanStack Start (web-only).*
