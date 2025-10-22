# A3 HTML5 Game App
PG29 Term1 Intro to HTML5 assignment 3-> minesweeper

## Minesweeper

This is a classic Minesweeper game implemented with HTML, CSS and JavaScript.

## Rules
Minesweeper is a game where mines are hidden in a grid of squares. Safe squares have numbers telling you how many mines touch the square. You can use the number clues to solve the game by opening all of the safe squares. If you click on a mine you lose the game.

You open squares with the left mouse button and put flags on mines with the right mouse button. Pressing the right mouse button again changes your flag into a questionmark. When you open a square that does not touch any mines, it will be empty and the adjacent squares will automatically open in all directions until reaching squares that contain numbers. A common strategy for starting games is to randomly click until you get a big opening with lots of numbers.

If you flag all of the mines touching a number, chording on the number opens the remaining squares. Chording is when you press both mouse buttons at the same time. This can save you a lot of work! However, if you place the correct number of flags on the wrong squares, chording will explode the mines.

## Functions of the application

1 - Fully playable Minesweeper with:

- Random mine placement;
- Mine proximity counter;
- Timer;
- Mine counter;
- Working difficulty selector;
- Working settings for rows, columns and mines;
- Working restart button;

### Files

This project contains the following files:

- index.html
- css folder -> style.css file
- scripts folder -> main.js file


### Things not yet implemented

For this project, it wasn't possible to implement the Stats counters, with Wins and Games played. To be implemented in the future.

### GitHub repo

(https://github.com/PG29Vinicius/A3-HTML5-Game-App)

