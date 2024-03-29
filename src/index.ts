import './reset.css';
import './style.css';

interface CharacterSkills {
  name: string;
  "Health Points": number;
  "Attack Power": number;
  "Counter Attack": number;
}
interface MainCharacters {
    [key: string]: CharacterSkills
}

var mainCharacters: MainCharacters = {
  obiwan: {
    name: "Obi-Wan Kenobi",
    "Health Points": 150,
    "Attack Power": 8,
    "Counter Attack": 20,
  },

  grievous: {
    name: "General Grievous",
    "Health Points": 100,
    "Attack Power": 8,
    "Counter Attack": 6,
  },

  dooku: {
    name: "Count Dooku",
    "Health Points": 180,
    "Attack Power": 10,
    "Counter Attack": 22,
  },
  anakin: {
    name: "Anakin Skywalker",
    "Health Points": 120,
    "Attack Power": 8,
    "Counter Attack": 16,
  },
};

var playerCharacterData: CharacterSkills;
var defenderData: CharacterSkills;
var charactersList: JQuery<HTMLElement>[] = [];

// Function makes deep copy with events of character elements and
// stores copy in characterList
function cloneCharacters() {
  $("#characters")
    .children()
    .each(function () {
      charactersList.push($(this).clone(true));
    });
}

$("#attack-button").hide();
$("#restart-button").hide();
$("#attack-message").hide();
$("#enemies-area").hide();
$("#defender-area").hide();

//jQuery selector add click event to each character
$(".card-character").on("click", function () {
  // Fetch clicked element data-attribute to reference the key in
  // the object mainCharacters and store its value in a local variable
  var characterData = mainCharacters[$(this).data("character-name")];

  // If Player character section has any children elements and the Defender Section
  // has none, then append the click character to Defender section
  if (
    $("#my-character").children().length > 0 &&
    $("#defender").children().length == 0
  ) {
    $(this).appendTo("#defender");
    $("#attack-button").show();
    $("#defender-area").show();
    $("#enemies-area").hide();

    // Makes a deep copy of characterData and store it in a global variable
    defenderData = jQuery.extend(true, {}, characterData);
  }

  // If Player character section has no children elements,then append the
  // the click character to Player character section
  if ($("#my-character").children().length == 0) {
    $("#my-character-area > h3").text("Your Character");
    $(this).appendTo("#my-character");
    $(this).addClass("greenBorder");
    $("#enemies-area").show();
    $(this).off(); // Removes click event

    // Makes a deep copy of characterData and store it in a global variable
    playerCharacterData = jQuery.extend(true, {}, characterData);
  }

  // All children elements in the choose-character-section will be append it to
  // the enemies-available-section
  $("#characters").children().appendTo("#enemies");
  $("#enemies").children().addClass("redBorder");
});

cloneCharacters();

//jQuery selector add click event to Attack button
$("#attack-button").click(function () {
  $("#attack-message").show();

  //Attack message status for chosen player
  $("#player-message").text(
    "You attacked " +
      defenderData.name +
      " for " +
      playerCharacterData["Attack Power"] +
      " damage."
  );

  //Attack message status from defender
  $("#defender-message").text(
    defenderData.name +
      " attacked back for " +
      defenderData["Counter Attack"] +
      " damage."
  );

  // Defender character lose Health Points
  defenderData["Health Points"] -= playerCharacterData["Attack Power"];

  // Player character lose Health Points
  playerCharacterData["Health Points"] -= defenderData["Counter Attack"];

  // Player character increase Attack Power by adding original
  // Attack Power from character data
  playerCharacterData["Attack Power"] +=
    mainCharacters[$("#my-character > *").data("character-name")][
      "Attack Power"
    ];

  // Replace HP value on Player character element
  $("#my-character #hp").text(playerCharacterData["Health Points"]);

  // Replace HP value on Defender character
  $("#defender #hp").text(defenderData["Health Points"]);

  // If Defender character HP is less than zero, remove Defender character from DOM
  if (defenderData["Health Points"] < 1) {
    $("#defender-message").text("");
    $("#player-message").text("");
    $("#attack-message").hide();
    $("#attack-button").hide();
    $("#enemies-area").show();
    $("#defender").empty();
  }

  // If Player character HP is less than zero, player lose and
  // restart button becomes visible
  if (playerCharacterData["Health Points"] < 1) {
    $("#enemies").empty();
    $("#defender").empty();
    $("#enemies-area").hide();
    $("#defender-area").hide();
    $("#attack-button").hide();
    $("#attack-message").hide();
    $("#restart-button").show();
    $("#my-character-area > h3").text("You Lose");
  }

  // If enemies section has no children elements, player wins and
  // restart button becomes visible
  if (
    $("#enemies").children().length == 0 &&
    $("#defender").children().length == 0 &&
    playerCharacterData["Health Points"] > 0
  ) {
    $("#my-character-area > h3").text("Winner!!!");
    $("#restart-button").show();
    $("#defender-area").hide();
    $("#enemies-area").hide();
  }
});

//jQuery selector add click event to restart button
$("#restart-button").click(function () {
  $("#attack-button").hide();
  $("#restart-button").hide();
  $("#attack-message").hide();
  $("#enemies-area").hide();
  $("#defender-area").hide();
  $("#my-character").empty();
  $("#restart-button").hide();
  $("#my-character-area > h3").text("Choose a Character");

  // Appends original character elements to characters section
  charactersList.forEach(function (el) {
    el.appendTo("#characters");
  });

  // Clears character list to prevent shadow-copy elements from previous games
  charactersList = [];
  cloneCharacters();
});
