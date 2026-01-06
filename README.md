This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

To enable the contact form via Formspree, set the following variable in `env.local`:

```env
NEXT_PUBLIC_FORMSPREE_CODE=your_formspree_form_id
```

If this variable is missing, the contact form will display a fallback message and submission will be disabled.

## Supabase (Editable Texts + Images)

This project uses Supabase for:

- **Editable texts** stored in table `pageTexts` via `POST /api/texts`
- **Editable images** stored in table `pageImages` + Supabase Storage via `POST /api/images`

### Required env vars

On the server (not exposed to the browser):

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Optional (defaults to `page-images`):

```env
NEXT_PUBLIC_SUPABASE_IMAGES_BUCKET=page-images
```

### Supabase Storage bucket

Create a **public** bucket named `page-images` (or set `NEXT_PUBLIC_SUPABASE_IMAGES_BUCKET`).

### Supabase table for images

Create a table named `pageImages` with a unique key per image slot:

```sql
create table if not exists public."pageImages" (
	image_key text primary key,
	url text not null,
	published boolean not null default true,
	updated_at timestamptz not null default now()
);
```

Example key used by the hero background:

- `hero_background`
