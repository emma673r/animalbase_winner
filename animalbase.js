"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let filteredList;

const catBtn = document.querySelector("[data-filter=cat]");
const dogBtn = document.querySelector("[data-filter=dog]");
const allBtn = document.querySelector(`[data-filter="*"]`);

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
  star: false,
  winner: false,
};

const settings = {
  filter: "*",
  sortBy: "name",
  sortDir: "asc",
  direction: 1,
};

// controller
function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons
  document.querySelectorAll("[data-action='filter']").forEach((button) => {
    button.addEventListener("click", selectFilter);
  });

  document.querySelectorAll(`[data-action="sort"]`).forEach((button) => {
    button.addEventListener("click", selectSorting);
    // button.innerHTML += "&#8595";
  });

  loadJSON();
}

// controller
async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();
  allBtn.classList.add("filter_chosen");
  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function selectFilter(elm) {
  console.log(`selectFilter`);

  allBtn.classList.remove("filter_chosen");
  catBtn.classList.remove("filter_chosen");
  dogBtn.classList.remove("filter_chosen");

  const filter = elm.target.dataset.filter;

  filterList(filter);
}

function selectSorting(elm) {
  const sortBy = elm.target.dataset.sort;
  const sortDir = elm.target.dataset.sortDirection;

  // toggle the direction
  if (sortDir === "asc") {
    elm.target.dataset.sortDirection = "desc";
  } else {
    elm.target.dataset.sortDirection = "asc";
  }

  // find old sortby elm
  const oldElm = document.querySelector(`[data-sort="${settings.sortBy}"]`);
  console.log(oldElm);
  oldElm.classList.remove("sortby");

  // indicate active sort
  elm.target.classList.add("sortby");
  settings.sortBy = sortBy;

  console.log(sortBy);
  sortList(sortBy, sortDir);
}

function filterList(animalType) {
  filteredList = allAnimals;

  if (animalType === "cat") {
    catBtn.classList.add("filter_chosen");
    //Create a filteredlist of only cats
    filteredList = allAnimals.filter(isCat);
  } else if (animalType === "dog") {
    dogBtn.classList.add("filter_chosen");
    //Create a filteredlist of only dogs
    filteredList = allAnimals.filter(isDog);
  } else {
    allBtn.classList.add("filter_chosen");
  }
  displayList(filteredList);
}

function sortList(sortBy, sortDir) {
  let sortedList = filteredList;
  let direction = -1;

  if (sortDir === "desc") {
    direction = 1;
  } else {
    direction = -1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(animalA, animalB) {
    console.log(`sort is ${sortBy}`);
    if (animalA[sortBy] < animalB[sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  displayList(sortedList);
}

function compareNamesAscending(a, b) {
  if (a.name < b.name) {
    return -1;
  } else {
    return 1;
  }
}

function compareNamesDescending(a, b) {
  if (a.name > b.name) {
    return -1;
  } else {
    return 1;
  }
}

function compareTypesAscending(a, b) {
  if (a.type < b.type) {
    return -1;
  } else {
    return 1;
  }
}

function compareTypesDescending(a, b) {
  if (a.type > b.type) {
    return -1;
  } else {
    return 1;
  }
}

function compareDescsAscending(a, b) {
  if (a.desc < b.desc) {
    return -1;
  } else {
    return 1;
  }
}
function compareDescsDescending(a, b) {
  if (a.desc > b.desc) {
    return -1;
  } else {
    return 1;
  }
}

function compareAgesAscending(a, b) {
  if (a.age < b.age) {
    return -1;
  } else {
    return 1;
  }
}

function compareAgesDescending(a, b) {
  if (a.age > b.age) {
    return -1;
  } else {
    return 1;
  }
}

function compareStarsAscending(a, b) {
  if (a.star < b.star) {
    return -1;
  } else {
    return 1;
  }
}

function compareStarsDescending(a, b) {
  if (a.star > b.star) {
    return -1;
  } else {
    return 1;
  }
}

function isCat(animal) {
  return animal.type === "cat";
}

function isDog(animal) {
  return animal.type === "dog";
}

function prepareObjects(jsonData) {
  console.log(`prepareObjects`);
  allAnimals = jsonData.map(prepAnimal);

  filterList(allAnimals);
}

function prepAnimal(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");

  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;
  animal.star = false;
  animal.winner = false;

  return animal;
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // display winner
    if (animal.winner) {
      clone.querySelector("[data-field=winner]").textContent = "🏆";
    } else {
      clone.querySelector("[data-field=winner]").style.filter = "grayscale(100%)";
    }

// display star + event listener

  // *** Lukas snippet ****** ABSOLUTE WINNER **********
  animal.star ? (clone.querySelector(`[data-field="star"]`).textContent = "⭐") : (clone.querySelector(`[data-field="star"]`).textContent = "☆");
  clone.querySelector(`[data-field="star"]`).addEventListener("click", (event) => {
    animal.star = !animal.star;
    if (animal.star) {
      event.target.textContent = "⭐";
    } else {
      event.target.textContent = "☆";
    }

    sortList(allAnimals);
  });

  // *** Lukas snippet end *******************************
  // winner thing display trophy and add event listener

  clone.querySelector("[data-field=winner]").dataset.winner = animal.winner;
  clone.querySelector("[data-field=winner]").addEventListener("click", clickWinner);

  function clickWinner() {
    if (animal.winner === true) {
      animal.winner = false;
    } else {
      tryToMakeaWinner(animal);
      // animal.winner = true;
    }
    displayList(filteredList);
  }


  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakeaWinner(selectedAnimal) {
  const winners = allAnimals.filter((animal) => animal.winner);

  const numberOfWinners = winners.length;
  const other = winners.filter((animal) => animal.type === selectedAnimal.type).shift();

  // if there is another of the same type
  if (other !== undefined) {
    console.log("There can be only one winner of each type!");
    removeOther(other);
  } else if (numberOfWinners >= 2) {
    console.log("There can only be two winners!");
    removeAorB(winners[0], winners[1]);
  } else {
    makeWinner(selectedAnimal);
  }

  function removeOther(other) {
    // ask the user to ignore, or remove "other"
    document.querySelector("#onlyonekind").classList.remove("dialog");
    document.querySelector("#onlyonekind .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#onlyonekind [data-action=remove1]").addEventListener("click", clickRemoveOther);

    // show names on buttons
    document.querySelector("#onlyonekind .animal1").textContent = other.name;

    // if ignore - do nothing ..
    function closeDialog() {
      document.querySelector("#onlyonekind").classList.add("dialog");
      document.querySelector("#onlyonekind .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#onlyonekind [data-action=remove1]").removeEventListener("click", clickRemoveOther);
    }

    // if remove other:
    function clickRemoveOther() {
      removeWinner(other);
      makeWinner(selectedAnimal);
      displayList(filteredList);
      closeDialog();
    }
  }

  function removeAorB(winnerA, winnerB) {
    // ask the user to ignnore, or remove A or B
    document.querySelector("#onlytwowinners").classList.remove("dialog");
    document.querySelector("#onlytwowinners .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#onlytwowinners [data-action=remove1]").addEventListener("click", clickRemoveA);
    document.querySelector("#onlytwowinners [data-action=remove2]").addEventListener("click", clickRemoveB);

    // show names on buttons
    document.querySelector("#onlytwowinners .animal1").textContent = winnerA.name;
    document.querySelector("#onlytwowinners .animal2").textContent = winnerB.name;

    // if ignore - do nothing ..
    function closeDialog() {
      document.querySelector("#onlytwowinners").classList.add("dialog");
      document.querySelector("#onlytwowinners .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#onlytwowinners [data-action=remove1]").removeEventListener("click", clickRemoveA);
      document.querySelector("#onlytwowinners [data-action=remove2]").removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      // if remove other:
      removeWinner(winnerA);
      makeWinner(selectedAnimal);
      displayList(filteredList);
      closeDialog();
    }

    function clickRemoveB() {
      // else - if removeB
      removeWinner(winnerB);
      makeWinner(selectedAnimal);
      displayList(filteredList);
      closeDialog();
    }
  }

  function removeWinner(winnerAnimal) {
    winnerAnimal.winner = false;
  }

  function makeWinner(animal) {
    animal.winner = true;
  }
}
