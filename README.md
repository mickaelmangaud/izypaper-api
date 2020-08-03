# IZYPAPER-API

Pour installer les devDependencies sur heroku:
- heroku config:set NPM_CONFIG_PRODUCTION=false YARN_PRODUCTION=false

TODO: 
- Gérer l'erreur à la connexion en cas d'utilisateur avec email non vérifié
- gérer les champs de l'utilisateur à enregistrer dans la stratégie passport google
- creer un model "utilisateur base" pour héritage googleuser
- voir pourquoi passport ça marche pas sur le pc de cécile en mode incognito
- update le resolver pour register comme la route express pour register
- refactor applyMiddleware