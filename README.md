# ⚔️ Team Maker

Application web locale pour générer des équipes équilibrées lors de soirées gaming entre amis. Fonctionne entièrement dans le navigateur, sans serveur ni installation.

---

## 📁 Structure du projet

```
Team Maker/
│
├── index.html                  # Page d'accueil — choix du jeu
│
├── TeamLol.html                # App League of Legends
├── TeamValo.html               # App Valorant
│
├── icon_champion/              # Icônes des champions LoL
│   ├── Aatrox_0.jpg
│   ├── Ahri_0.jpg
│   └── ...                     # 172 fichiers au format NomChampion_0.jpg
│
├── icon_agent/                 # Portraits des agents Valorant
│   ├── Jett.png
│   ├── Sage.png
│   └── ...                     # 29 fichiers au format NomAgent.png
│
├── roles_lol/                  # Icônes des rôles LoL
│   ├── 120px-Top_icon.webp
│   ├── 120px-Jungle_icon.webp
│   ├── 120px-Middle_icon.webp
│   ├── 120px-Bottom_icon.webp
│   └── 120px-Support_icon.webp
│
├── roles_valo/                 # Icônes des rôles Valorant
│   ├── ClasseDuelliste.webp
│   ├── ClasseInitiateur.webp
│   ├── ClasseController.webp
│   └── ClasseSentinelle.webp
│
└── img/                        # Images de chargement des maps Valorant
    ├── Abyss_chargement.png
    ├── Ascent_chargement.png
    └── ...                     # 12 maps
```

---

## 🚀 Lancement

Aucune installation requise. Il suffit d'ouvrir `index.html` dans un navigateur moderne (Chrome, Firefox, Edge).

> **Note :** Pour que les images locales se chargent correctement, il est recommandé de servir les fichiers via un serveur local plutôt que d'ouvrir directement le fichier. La solution la plus simple :
> ```bash
> # Python (inclus sur macOS/Linux)
> python3 -m http.server 8000
> # Puis ouvrir http://localhost:8000
> ```

---

## ⚔️ League of Legends — TeamLol.html

### Modes

| Mode | Description |
|------|-------------|
| **Custom** | 2 à 10 joueurs, répartis en 2 équipes équilibrées |
| **Flex** | 1 à 5 joueurs, une seule équipe (tu joues contre des inconnus) |

### Fonctionnalités

**Rangs disponibles**
Débutant → Iron → Bronze → Silver → Gold → Platine → Émeraude → Diamant → Master → Grandmaster → Challenger

**Rôles aléatoires** *(optionnel)*
Assigne aléatoirement Top, Jungle, Mid, ADC, Supp à chaque joueur.
- En Custom : nécessite exactement 10 joueurs
- En Flex : nécessite exactement 5 joueurs

**Champions aléatoires** *(optionnel)*
Tire un champion unique par joueur, sans doublon dans toute la partie.
- Si les rôles sont activés : chaque champion est tiré dans le pool de son rôle (ex. un Jungle reçoit un champion de jungle)
- Si les rôles sont désactivés : tirage libre parmi les 172 champions

**Algorithme d'équilibrage**
Explore toutes les combinaisons possibles pour trouver la répartition minimisant la différence de score entre les deux équipes. Affiche le nombre de combinaisons équitables trouvées.

**Boutons de relance** *(après génération)*
- **Rôles** — redistribue les rôles sans changer les équipes
- **Champions** — retire de nouveaux champions sans changer les équipes ni les rôles
- **Regénérer** — refait tout (équipes + rôles + champions)

**Joueurs enregistrés** *(sidebar droite)*
Sauvegarde des joueurs avec leur rang en localStorage. Ajout rapide dans la liste de la partie. Modification et suppression possible. Les joueurs peuvent être épinglés depuis la liste de la partie (icône 🔖) et désépinglés d'un second clic.

---

## 🎯 Valorant — TeamValo.html

### Modes

| Mode | Description |
|------|-------------|
| **Custom** | 2 à 10 joueurs, répartis en 2 équipes équilibrées |
| **Five Stack** | 1 à 5 joueurs, une seule équipe (tu joues contre des inconnus) |

### Fonctionnalités

**Rangs disponibles**
Débutant → Iron → Bronze → Silver → Gold → Platine → Diamant → Ascendant → Immortal → Radiant

**Rôles aléatoires** *(optionnel)*
Assigne aléatoirement Duelist (×2), Initiator, Controller, Sentinel.
- En Custom : nécessite exactement 10 joueurs
- En Five Stack : nécessite exactement 5 joueurs

**Agents aléatoires** *(optionnel)*
Tire un agent unique par joueur, **en respectant strictement le rôle de chaque agent** — il est impossible d'assigner Jett à un Controller ou Sage à un Duelist.
- Activer les agents **décoche automatiquement** le toggle Rôles (les rôles sont quand même affichés, déduits de l'agent)
- Cocher les Rôles quand les Agents sont actifs désactive les Agents

**Mapping agents → rôles (fixe)**
| Rôle | Agents |
|------|--------|
| Duelist | Jett, Neon, Phoenix, Raze, Reyna, Iso, Waylay, Yoru |
| Initiator | Breach, Fade, Gekko, KayO, Skye, Sova, Tejo |
| Controller | Astra, Brimstone, Clove, Harbor, Omen, Viper, Veto |
| Sentinel | Chamber, Cypher, Deadlock, Killjoy, Sage, Vyse, Miks |

**Roulette de map** *(mode Custom uniquement)*
Slot machine animé qui tire une map au hasard parmi les 12 maps disponibles. Cliquer sur le carrousel ou sur "Lancer" pour démarrer. La map reste affichée après le spin. Le carrousel est masqué en mode Five Stack.

**Boutons de relance** *(après génération)*
- **Rôles** — redistribue les rôles (et resynchronise les agents si actifs)
- **Agents** — retire de nouveaux agents compatibles avec les rôles actuels
- **Regénérer** — refait tout

**Joueurs enregistrés** *(sidebar droite)*
Identique à LoL — sauvegarde locale, ajout rapide, épinglage depuis la liste.

---

## 💾 Données locales

Les joueurs enregistrés sont sauvegardés dans le `localStorage` du navigateur :
- LoL : clé `lol_teammaker_saved_v1`
- Valorant : clé `val_teammaker_saved_v1`

Les données persistent entre les sessions et ne sont jamais envoyées à un serveur.

---

## 🛠️ Technologies

- HTML / CSS / JavaScript vanilla — aucune dépendance de build
- [Tabler Icons](https://tabler-icons.io/) via CDN (icônes UI)
- `localStorage` pour la persistance des données
- Algorithme de partition exacte (force brute optimisée, ≤ 10 joueurs)

---

## 🎮 Captures d'écran

| Page | Description |
|------|-------------|
| `index.html` | Landing page avec choix du jeu |
| `TeamLol.html` Custom | Deux équipes avec champions et rôles |
| `TeamLol.html` Flex | Cartes verticales avec portrait champion |
| `TeamValo.html` Custom | Deux équipes avec agents et rôles |
| `TeamValo.html` Five Stack | Cartes verticales avec portrait agent et roulette masquée |

---

## 📝 Notes de développement

- L'algorithme d'équilibrage explore 2^N combinaisons (max 2^10 = 1024), ce qui reste instantané
- En cas de plusieurs combinaisons équitables, une est choisie aléatoirement (différente de la précédente)
- Les agents Valorant ont des rôles **biologiquement fixes** — aucun agent ne peut être assigné hors de son rôle
- Les champions LoL sont répartis par rôle principal selon le méta (pool de 40+ champions par rôle)