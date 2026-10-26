# NAYA Motors

Vitrine automobile premium pour une marque conceptuelle ivoirienne. React, Vite et animations GSAP avec ScrollTrigger.

## Développement

```sh
npm ci
npm run dev
```

Le serveur écoute sur toutes les interfaces, sur le port 5173 par défaut.

## Production

```sh
npm run build
npm run preview
```

Le dossier `dist/` peut être déployé sur un hébergement statique. Aucun service backend ou secret n’est nécessaire.

## Déploiement sur Vercel

Depuis la racine du projet, avec un compte Vercel autorisé :

```sh
npx vercel login
npx vercel --prod
```

Au premier déploiement, choisissez le compte ou l’équipe et associez le dossier au projet Vercel souhaité. Le fichier `vercel.json` configure l’installation avec `npm ci`, la compilation Vite avec `npm run build` et la publication du dossier `dist/`. Aucune variable d’environnement applicative n’est nécessaire. Les informations d’association locales dans `.vercel/` sont ignorées par Git.

## Expérience

- Carrousel de trois véhicules, avec fiches détaillées.
- Animations d’entrée, révélations au défilement et parallaxe, respectant la préférence de réduction des mouvements.
- Navigation mobile et fenêtres accessibles au clavier.
- Formulaire de demande d’essai avec validation native et confirmation locale.
- FAQ interactive, mentions légales et confidentialité.
- Images et polices hébergées localement ; licences des polices incluses dans `public/fonts/`.

NAYA est une marque fictive. Les visuels sont des illustrations générées, les caractéristiques et prix sont indicatifs. Le formulaire est une démonstration : aucune donnée n’est envoyée ou enregistrée et aucun essai réel n’est réservé. Une intégration backend sera nécessaire pour traiter de véritables demandes.
