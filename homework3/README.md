# Problem 1 – Monster Mash
You are tasked with creating a Monster Battle Simulator called Monster Bash using HTML, CSS, and JavaScript. You may use external libraries or frameworks (for example, React, Vue, or jQuery).

Your simulator will model a battle between one hero and a sequence of Halloween monsters (zombie, ghost, vampire, pumpkin monster, etc.). Each monster has a certain amount of health, and your hero can choose between several attacks, each with a different energy cost and damage value.

Your challenge is to determine, using Dynamic Programming, the optimal sequence of attacks to defeat all monsters while meeting one of two player goals.

 

Requirements

Display a simple user interface showing:

The hero and monsters (you may use emojis, icons, or images)

Randomize the sequence of monsters and health values for each playthrough.
Display all monsters in a row or column to represent the battle sequence.
A health indicator for each character

The hero’s health and energy carry over between fights.

The hero’s health does not regenerate after defeating a monster.

Plan your attacks strategically to survive through all monsters.

Below or beside each monster:

Show Health (e.g., “HP: 10/20”)

Show Status (“Alive” / “Defeated”).

A list of available attacks showing energy cost and damage.

Attacks may be reused any number of times.
A battle area that visually or textually shows the fight’s progress.

Implement a dynamic programming algorithm that determines the optimal sequence of attacks to defeat all monsters.

You have two goals that the user may choose from

Minimize the total energy used to defeat all the monsters, or

Maximize total damage dealt within a fixed energy limit (e.g., 100 energy).

You should display or describe your DP table/decision process somewhere on the page (as text or a small table).

The DP algorithm should run before the battle animation to determine the best plan.
You may display the plan as “The hero chose Attack 1, Attack 3, Attack 1…”
Animate or visually update the battle as attacks occur.

Display the final result, such as:

“You defeated all the monsters with 10 energy left!”

“You were defeated!”