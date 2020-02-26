# Refactor Tractor - What's Cookin'?

## A refactoring project that utilises SASS, jQuery, Fetch API, & Mocha/Chai Testing.

This project contains contributions my Kyle Barnett, Cody Smith, and John Watterson as part of a project at Turing School of Software and Design.

## Installation

Clone down this repo to your local machine, and run `npm install`. 
To run this repo in your browser, run `npm run start` and you will be able to access this repo via webpack at `localhost:8080`

## Features

This project loads a random user out of a dataset of 50 users retrieved using Fetch API. 
Each user object contains a pantry of ingredients. 
The DOM loads and instantiates a number of recipes, each with their own unique set of ingredients.

The user can search through the recipes by searching ingredients, recipe name, or type of meal (antipasti, lunch, etc.)
The user can also select items in their pantry and see recipes they can make using those ingredients.
