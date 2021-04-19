// Initializations
let firstPokeSelect = document.querySelector(".first .all-pokemon");
let secondPokeSelect = document.querySelector(".second .all-pokemon");
let typesArray1 = [];
let typesArray2 = [];

// Functions
const getAllPokemon = () => {
let prom = fetch("https://pokeapi.co/api/v2/generation/1");
let data = prom.then(function(res) {
    return res.json();
});

data.then(function(json) {
    let pokeSelects = document.getElementsByClassName("all-pokemon");
    for (let i = 0; i < pokeSelects.length; i++) {
    let allPoke = json.pokemon_species;
    allPoke.forEach(function(poke) {
        let pokeName = poke.name;
        let option = document.createElement("option");
        option.innerText = pokeName;
        pokeSelects[i].appendChild(option);
    });
    }
});
}

const pokeDisplay = (selector, value) => {
let API = "https://pokeapi.co/api/v2/pokemon/" + value;

let prom = fetch(API);
let data = prom.then(function(res) {
    return res.json();
});

data.then(function(json) {

    // Get and display sprite
    let pokeImgURL = json.sprites.front_default;
    let pokeImgs = document.querySelector(`${selector} .poke-img`);
    pokeImgs.src = pokeImgURL;

    // get and display typing
    if (selector === ".first") {
    typesArray1 = [];
    } else {
    typesArray2 = [];
    }

    let pokeTypes = json.types;
    document.querySelector(`${selector} .types`).innerHTML = "";
    pokeTypes.forEach(function(types) {
      let type = types.type.name;
      if (selector === ".first") {
        typesArray1.push(type);
      } else {
        typesArray2.push(type);
      }

      let li = document.createElement("li");
      li.innerText = type;
      li.className = `type ${type}`;
      document.querySelector(`${selector} .types`).appendChild(li);
    });
  });
}

const compareTypes = () => {
  setTimeout(function(){
    let effectivenessScore = 0;

    for (let i = 0; i < typesArray1.length; i++) {
      let type1 = "https://pokeapi.co/api/v2/type/" + typesArray1[i];

      let prom = fetch(type1);
      let data = prom.then(function(res) {
        return res.json();
      });

      data.then(function(json) {
        let damageRelations = json.damage_relations;

        console.log(damageRelations);
        // Double damage from
        let doubleDamageFrom = damageRelations.double_damage_from;
        for (let j = 0; j < doubleDamageFrom.length; j++) {
          for (let k = 0; k < typesArray2.length; k++) {
            if (doubleDamageFrom[j].name === typesArray2[k] ) {
              effectivenessScore-=4;
            }
          }
        }

        // Double damage to
        let doubleDamageTo = damageRelations.double_damage_to;
        for (let j = 0; j < doubleDamageTo.length; j++) {
          for (let k = 0; k < typesArray2.length; k++) {
            if (doubleDamageTo[j].name === typesArray2[k] ) {
              effectivenessScore+=4;
            }
          }
        }

        // Half damage from
        let halfDamageFrom = damageRelations.half_damage_from;
        for (let j = 0; j < halfDamageFrom.length; j++) {
          for (let k = 0; k < typesArray2.length; k++) {
            if (halfDamageFrom[j].name === typesArray2[k] ) {
              effectivenessScore+=2;
            }
          }
        }

        // Half damage to
        let halfDamageTo = damageRelations.half_damage_to;
        for (let j = 0; j < halfDamageTo.length; j++) {
          for (let k = 0; k < typesArray2.length; k++) {
            if (halfDamageTo[j].name === typesArray2[k] ) {
              effectivenessScore-=2;
            }
          }
        }

        // No damage from
        let noDamageFrom = damageRelations.no_damage_from;
        for (let j = 0; j < noDamageFrom.length; j++) {
          for (let k = 0; k < typesArray2.length; k++) {
            if (noDamageFrom[j].name === typesArray2[k] ) {
              effectivenessScore+=6;
            }
          }
        }

        // No damage to
        let noDamageTo = damageRelations.no_damage_to;
        for (let j = 0; j < noDamageTo.length; j++) {
          for (let k = 0; k < typesArray2.length; k++) {
            if (noDamageTo[j].name === typesArray2[k] ) {
              effectivenessScore-=6;
            }
          }
        }

        let score = document.querySelector(".score");
        let message = document.querySelector(".message")
        score.innerHTML = effectivenessScore;

        if (effectivenessScore === 0) {
        let text = `<strong>${firstPokeSelect.value}</strong> is 
                    evenly matched against <strong>${secondPokeSelect.value}</strong>.`;
    message.innerHTML = text;
        } else if (effectivenessScore < 0 && effectivenessScore >= -5) {
        let text = `<strong>${firstPokeSelect.value}</strong> is 
                    weak against <strong>${secondPokeSelect.value}</strong>.`;
        message.innerHTML = text;
        } else if (effectivenessScore < -5) {
        let text = `<strong>${firstPokeSelect.value}</strong> is 
                    SUPER weak against <strong>${secondPokeSelect.value}</strong>.`;
        message.innerHTML = text;
        } else if (effectivenessScore > 0 && effectivenessScore <= 5) {
        let text = `<strong>${firstPokeSelect.value}</strong> is 
                    effective against <strong>${secondPokeSelect.value}</strong>.`;
        message.innerHTML = text;
        } else if (effectivenessScore > 5) {
        let text = `<strong>${firstPokeSelect.value}</strong> is 
        SUPER effective against <strong>${secondPokeSelect.value}</strong>.`;
        message.innerHTML = text;
        }
    });
    }
    
}, 1000);
}

// Usage
getAllPokemon();
pokeDisplay(".first", "bulbasaur");
pokeDisplay(".second", "bulbasaur");
compareTypes();

firstPokeSelect.addEventListener("change", function() {
pokeDisplay(".first", this.value);
compareTypes();
});

secondPokeSelect.addEventListener("change", function() {
pokeDisplay(".second", this.value);
compareTypes();
});

// Future improvements
  // Take into account type cancellation to avoid weird results and more accurate comparisons
