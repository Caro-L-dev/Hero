# Mocodo

Obtenir, 0N User, 0N Score: table de liaison, user(id),score(id)
User: prenom, nom, email, mdp, role
Choisir, 11 User, 0N Personnage
Personnage: nom, classe, point de vie, attaque physique, defence physique, inteligence (attaque magique), resistance magique, vitesse
:

Score: score, histoire(id), personnage(id)
Peut jouer a, 0N User, 0N Histoire: table de liaison, user(id), histoire(id)
Histoire: nom, description
Avoir, 1N Histoire, 0N Scene: table de liaison, histoire(id), scéne(id)
Ennemie: nom, classe, point de vie, attaque physique, defence physique, inteligence (attaque magique), resistance magique, vitesse

:
Item: nom, effet
Possede2, 01 Scene, 0N Item
Scene: nom, ennemie(id), item(id)
Possede, 01 Scene, 0N Ennemie

# Mocodo 2

User: prenom, nom, email, mdp, role
Histoire: nom, description
Avoir, 1N Histoire, 0N Scene: table de liaison, histoire(id), scéne(id)
Item: nom, effet

Choisir, 11 User, 0N Personnage
Peut jouer a, 0N User, 0N Histoire, 0N Score: table de liaison, user(id), histoire(id), score(id)
Scene: nom, ennemie(id), item(id)
Possede2, 01 Scene, 0N Item

Personnage: nom, classe, point de vie, attaque physique, defence physique, inteligence (attaque magique), resistance magique, vitesse
Score: score, histoire(id), personnage(id)
Possede, 01 Scene, 0N Ennemie
Ennemie: nom, classe, point de vie, attaque physique, defence physique, inteligence (attaque magique), resistance magique, vitesse

# Mocodo 3

DF4, 11 Histoire, 0N Personnages: personnages jouable
Personnages: nom, classe, point de vie, attaque physique, defence physique, inteligence (attaque magique), resistance magique, vitesse
DF2, 01 Scene, 0N Personnages
equipement: nom, point de vie, attaque physique, defence physique, inteligence (attaque magique), resistance magique, vitesse
User: userName, email, mot de passe ,role (admin, user), created at, updated at, detailsAllGameUser(id)

Histoire: nom, description, persoJouable(id), difficulté, created at, updated at
History_has_scene, 1N Histoire, 0N Scene: history(id), scene(id), previous_scene(id)
Scene: nom, description, type (combat, discution, deplacement, debut, fin, cliquable, discution/combat), personnagePNJ(id)
DF3, 01 Scene, 0N equipement
DF, 11 User, 11 detailsAllGameUser

History_has_categories, 1N Histoire, 0N categories: history(id), categories(id)
categories: nom
scene_has_text, 1N Scene, 0N text_in_game: scene(id), text_in_game(id)
text_in_game: description
detailsAllGameUser: Avatar, DisplayName, Nombre de parti gagné, nombre de parti perdu, nombre de parti jouer

# Mocodo 4

detailsAllGameUser: Avatar, DisplayName, Nombre de parti gagné, nombre de parti perdu, nombre de parti jouer
categories: nom
History_has_categories, 1N Histoire, 0N categories: history(id), categories(id)
text_in_game: description
scene_has_text, 1N Scene, 0N text_in_game: scene(id), text_in_game(id)

DF, 11 User, 11 detailsAllGameUser
User: userName, email, mot de passe ,role (admin, user), created at, updated at, detailsAllGameUser(id)
Histoire: nom, description, persoJouable(id), difficulté, created at, updated at
History_has_scene, 1N Histoire, 0N Scene: history(id), scene(id), previous_scene(id)
Scene: nom, description, type (combat, discution, deplacement, debut, fin, cliquable, discution/combat), personnagePNJ(id), personnageEquipement(id)

::
DF4, 11 Histoire, 0N Personnages: personnages jouable
Personnages: nom, classe, point de vie, attaque physique, defence physique, inteligence (attaque magique), resistance magique, vitesse
DF2, 01 Scene, 0N Personnages

# Mocodo 5

Item: name, hp, atk, def
DF2, 01 Scene, 0N Character
Character: name, class, hp, atk, def
Party, 0N User, 0N History, 0N Character: Character(id), History(id), User(id)
User: userName, email, mdp, role(admin/user), created at, updated at

Scene_has_item, 0N Item, 0N Scene: Item(id), Scene(id)
Scene: nom, description
History_has_scene, 1N History, 0N Scene: History(id), Scene(id), Previous_scene(id)
History: name, description, difficulty, created at, updated at
DF, 11 User, 11 DetailsAllGameUser

:
Scene_has_text, 1N Scene, 0N Text_in_game: Scene(id), Text_in_game(id)
DF3, 11 Scene, 0N Type
History_has_categories, 1N History, 0N Categories: History(id), Categories(id)
DetailsAllGameUser: avatar, displayName, gameWin, gameOver, gamePlay

:
Text_in_game: description
Type: name
Categories: name
:

# Mocodo 6

Character_has_item, 0N Character, 0N Item: Character(id), Item(id)
Item: name, hp, atk, def
Scene_has_item, 0N Item, 0N Scene: Item(id), Scene(id)
Scene_has_clikable_element, 0N Scene, 0N Clickable_element: Scene(id), Clickable_element(id)
Clickable_element: contact_information

Character: name, playable, hp, atk, def
DF2, 01 Scene, 0N Character
Scene: nom, description
DF3, 11 Scene, 0N Type
Type: name

User: userName, email, mdp, role(admin/user), created at, updated at
Party, 0N User, 0N History, 0N Character: Character(id), History(id), User(id)
History_has_scene, 1N History, 0N Scene: History(id), Scene(id), Previous_scene(id)
Scene_has_text, 1N Scene, 0N Text_in_game: Scene(id), Text_in_game(id)
Text_in_game: description

DF, 11 User, 11 Game_Details
Game_Details: avatar, displayName, gameWin, gameOver, gamePlay
History: name, description, difficulty, created at, updated at
History_has_categories, 1N History, 0N Categories: History(id), Categories(id)
Categories: name