# Fonctionnalité d'échange de Pokémon

## Vue d'ensemble

Création d'une nouvelle fonctionnalité permettant aux utilisateurs d'échanger des Pokémon entre eux sur un serveur Discord.

## Fonctionnement général

1. Une personne initialise un échange via une commande
2. Demande de confirmation à l'autre utilisateur
3. Les deux parties choisissent le Pokémon à échanger
4. Visualisation mutuelle des choix
5. Validation de chaque côté
6. Finalisation de l'échange

---

## Commande d'initialisation

### Paramètres
- **Utilisateur cible** : L'autre utilisateur sur le serveur avec qui effectuer l'échange

### Actions après initialisation

#### Message à l'utilisateur source (MP)
- Envoi d'un embed `embedAsk` avec le message "Demande envoyée"

#### Message à l'utilisateur cible (MP)
- Envoi d'un embed `embedAsk` (même structure que celui de l'utilisateur source)
- Boutons disponibles :
  - ✅ **Approuver**
  - ❌ **Refuser**
  - 🚫 **Refuser pendant 1 semaine**

---

## Cas de refus

### Refus simple
- Modification des deux embeds `embedAsk` pour indiquer le refus

### Refus temporaire
- Option "Refuser pendant 1 semaine" : blocage des demandes pendant 7 jours

### Timeout
- Si aucune réponse n'est donnée dans le délai imparti, traitement comme un refus par timeout
- Modification des embeds pour indiquer le refus par timeout

---

## Cas d'acceptation

### Embed de sélection (`choicePokemonEmbed`)

Après acceptation, envoi d'un embed avec un menu de sélection (utiliser le système de menu existant dans `utils/menu`).

#### Structure du menu

1. **Génération**
   - Liste des générations disponibles en sous-menu
   - ⚠️ **Critère** : Afficher uniquement les générations où l'utilisateur possède au moins 1 Pokémon éligible
   - Format d'affichage : `"Gen 2"` (exemple)

2. **Type**
   - Liste des types disponibles en sous-menu
   - ⚠️ **Critère** : Afficher uniquement les types où l'utilisateur possède au moins 1 Pokémon éligible

3. **Pokémon**
   - Liste des Pokémon correspondant aux critères sélectionnés (génération et/ou type)

4. **Bouton de validation**
   - Utiliser le bouton de validation déjà disponible dans le système de menu (`utils/menu`)

### Critères d'acceptation d'un Pokémon

Un Pokémon est éligible à l'échange si :
- ✅ La rareté du Pokémon est approuvée
- ✅ L'utilisateur possède **au moins 2 exemplaires** du Pokémon (pour éviter d'avoir 0 après l'échange)

### Règles de rareté

- ⚠️ **Règle stricte** : Une rareté ne peut être échangée que contre la **même rareté**

### Gestion du timeout

- Toujours prévoir un cas de timeout pour chaque étape interactive

---

## Validation et confirmation

### Après validation du choix

1. Supprimer le message contenant le menu
2. Envoyer un message : `"Attente de la confirmation de l'autre"` (ou message similaire)

### Confirmation finale

Lorsque les deux parties ont validé leur choix :

1. **Envoi d'un embed récapitulatif** à chaque utilisateur contenant :
   - Ce qu'il va **recevoir**
   - Ce qu'il va **envoyer**

2. **Boutons disponibles** :
   - ✅ **Confirmer**
   - ❌ **Annuler**

Si echec ou annulé reprendre la l'envoi du menu avec la selection des poké

### Exécution de l'échange

Si les deux parties confirment :

1. **Vérification** : S'assurer que personne n'aura 0 Pokémon après l'échange
2. **Transaction** :
   - `-1` au compte du Pokémon choisi (celui qui est envoyé)
   - `+1` au compte du Pokémon reçu
3. **Annulation automatique** : Si le `-1` entraîne un compte à 0, annuler toute la transaction

---

## Limitations par rareté

### Délais entre échanges

Pour éviter les abus, limitation du nombre d'échanges selon la rareté :

| Rareté | Délai minimum |
|--------|---------------|
| **Légendaire** | 1 jour |
| **Fabuleux** | 1 semaine |
| **Ultra chimère** | 1 jour |

⚠️ Ces délais doivent être vérifiés avant d'autoriser un nouvel échange.

---

## Contenu de l'embed `embedAsk`

L'embed `embedAsk` doit contenir :

### Informations affichées

1. **Temps restant pour chaque rareté**
   - Afficher le temps restant avant de pouvoir échanger à nouveau chaque type de rareté

2. **Règles de l'échange**
   - Rareté : échange uniquement contre la même rareté
   - Possession minimale : au moins 2 exemplaires du Pokémon à échanger
   - Délais entre échanges selon la rareté

---

## Résumé des règles importantes

### Critères d'éligibilité
- ✅ Posséder au moins 2 exemplaires du Pokémon à échanger
- ✅ Échanger uniquement contre la même rareté
- ✅ Respecter les délais entre échanges selon la rareté

### Sécurité
- ⚠️ Vérifier qu'aucun utilisateur n'aura 0 Pokémon après l'échange
- ⚠️ Annuler la transaction si cette condition n'est pas respectée

### Gestion des timeouts
- ⚠️ Prévoir des timeouts à chaque étape interactive
- ⚠️ Gérer les cas où l'utilisateur ne répond pas

tu peux utilisé le cache pour tout ce qui est data tempraire.


pour prévenir des Timeout mettre le minuteur dans l'embed
tous les mlinuteur, temps restant utilise la syntax de discord "<t:1769003123:R>" (le timestamp a la palce des chiffres)