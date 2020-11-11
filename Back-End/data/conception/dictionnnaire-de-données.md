# Liste des entités:

## Nav.

### User
- userName
- email
- password
- role (admin, user)
- created at
- updated at
- detailsAllGameUser(id)

### DetailsAllGameUser
- Avatar
- DisplayName
- gameWin
- gameOver
- gamePlay

## Game.

## Character
- name
- class (perso jouable guerrier, mage, archer)(ou pnj goblin, lich etc) (ou equipement)
- hp
- atk
- def

## Histoire
- name
- description
- difficulty
- created at
- updated at

## Type
- name

## Scene
- name 
- description
- type(id)
- opponent(id) (character(id))
- item(id)

## Item
- name
- hp
- atk
- def

## Categories
- name

## Text_in_game
- description

## Party
- user(id)
- character(id)
- history(id)