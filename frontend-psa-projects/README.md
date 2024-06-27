This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Development and testing 
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

## Production

To run for production and deployment

```bash
npm run build
# then
npm run start
```

## Notes for URLs

The proyect utilizes .envs files for production and development to differentiate from the deployed or local APIs versions. To correctly use the project you must define two .envs files

```.env
#.env.development
NEXT_PUBLIC_PROJECT_BACK_URL = "localhost with desired port"
```

```env
#.env.production
NEXT_PUBLIC_PROJECT_BACK_URL ="actual server domain and port"
```

## Deploy
Currently deployed on : [https://frontend-psa.vercel.app/proyectos](https://frontend-psa.vercel.app/)
