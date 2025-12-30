# LISTE DE TOUS LES FEATURES QUE JE VEUX IMPLÉMENTER DANS MON TEMPLATE: 
- un systeme de:
    - modal pret à l'emploi
    - dark mode pret à l'emploi
    - plusieurs providers (global, admin, ..)
    - un systeme de suspense(loading) pret, avec composant spinLoader, et désactivation de toute intéraction user (wheel,touchn,keyboard nav, ...)
    - connexion /login/signup pret à l'emploi (clerk avec provider), (dans le projet de l'école j'ai: "Authentification robuste avec fallback JWT pour Clerk")
        - systeme de role avec un hook pour le rendu conditionné par le role
    - un fil d'ariane prêt à l'emploi
    - fichiers utilitaire pour la connexion bdd: dbConnect(mongodb), prisma.js, autre...(bdd browser, ou firebase)
    - créer des hooks(useRole,....), et des composant jsx-bem(Carousel,Confetti,Card, ....), génériques
    - un blog mdx pret à l'emploi
    - une interface d'administration, permettant déjà de faire des opérations CRUD sur les schema présents par défaut
    - un header, un footer, et plusieurs types de page d'accueil par défaut
    - un dossier contenants différents script utilisants des pkg npm pour altérer des fichiers ou générer du contenu (convertor to webp, AI recognition to text/json)
    - un fichier json pour le seo basique (titre description keyword sns etc) éditable en admin

- points à améliorer:
    - localStorage: il faut une var d'env pour définir la clé générique de l'application dans le localStorage, si la var d'env n'existe pas, cette clé générique sera défini à partir du nom de l'application dans le fichier package.json
        - dans l'app de l'école, observer /home/nihongo/Bureau/schoolManagment___PROJECT/stores/ai_adminContext.js et /home/nihongo/Bureau/schoolManagment___PROJECT/stores/useUserRole.js, mais privilégier en 1er lieu l'utilisation de /home/nihongo/Bureau/schoolManagment___PROJECT/utils/favorisManager.js
    - améliorer les fichiers de configuration tel que jsconfig.json, middleware.js, et next.config.mjs(celui-ci doit pouvoir bien utiliser scss... découvrir pourquoi ce fichier dans l'app de l'école est différent de ce meme fichier dans lpd, découvre la différence et décide ensuite de le modifier pour xa)

