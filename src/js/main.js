const babel = require("@babel/core");
babel.transform("main.js", {
  filename: "main.js",
});

import "core-js/features/promise";
import "regenerator-runtime/runtime.js";
const search = document.getElementById("search");
const searchValue = search.value;
const searchForm = document.getElementById("search-form");
const submitBtn = document.getElementById("submit-btn");
const searchIcon = document.getElementById("search-icon");
const rollingLoader = document.getElementById("rolling-loader");
let totalFatText = document.getElementsByClassName("nutrient-value")[0];
let CarbsText = document.getElementsByClassName("nutrient-value")[1];
let totalProteinText = document.getElementsByClassName("nutrient-value")[2];
let totalSatFatText = document.getElementsByClassName("nutrient-value")[3];
let totalFiberText = document.getElementsByClassName("nutrient-value")[4];
let totalSodiumText = document.getElementsByClassName("nutrient-value")[5];
let totalCalciumText = document.getElementsByClassName("nutrient-value")[7];
let totalPotassiumText = document.getElementsByClassName("nutrient-value")[8];
let totalCholesterolText = document.getElementsByClassName("nutrient-value")[9];
let totalVitaminAText = document.getElementsByClassName("nutrient-value")[10];
let totalVitaminCText = document.getElementsByClassName("nutrient-value")[11];
let totalVitaminDText = document.getElementsByClassName("nutrient-value")[12];
let checkbox = document.getElementById("theme-switch");
let hiddenElements = document.getElementsByTagName("div");

if (checkbox) {
  initTheme();
  checkbox.addEventListener("change", function (event) {
    resetTheme();
  });
}

function initTheme() {
  let themeDescription = document.getElementsByClassName("theme-mode")[0];
  let lightThemeSelected =
    localStorage.getItem("themeSwitch") !== null &&
    localStorage.getItem("themeSwitch") === "light-mode";
  checkbox.checked = lightThemeSelected;

  if (lightThemeSelected) {
    document.documentElement.setAttribute("data-theme", "light-mode");
    themeDescription.textContent = "Light Mode";
    Chart.defaults.global.defaultFontColor = "#555";
    Chart.defaults.global.legend.labels.fontColor = "#555";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeDescription.textContent = "Dark Mode";
    Chart.defaults.global.defaultFontColor = "#ffffff";
    Chart.defaults.global.legend.labels.fontColor = "#ffffff";
  }
}

function resetTheme() {
  let themeDescription = document.getElementsByClassName("theme-mode")[0];
  if (checkbox.checked) {
    transition();
    document.documentElement.setAttribute("data-theme", "light-mode");
    localStorage.setItem("themeSwitch", "light-mode");
    themeDescription.textContent = "Light Mode";
    Chart.defaults.global.defaultFontColor = "#111";
    Chart.defaults.global.title.fontColor = "#111";
  } else {
    transition();
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("themeSwitch");
    themeDescription.textContent = "Dark Mode";
    Chart.defaults.global.defaultFontColor = "#ffffff";
    Chart.defaults.global.legend.fontColor = "#ffffff";
  }
}

function displayLoader() {
  searchIcon.classList.replace("visible-icon", "hidden-icon");
  rollingLoader.classList.replace("hidden-icon", "visible-icon");
}

const displaySearchIcon = () => {
  rollingLoader.classList.replace("visible-icon", "hidden-icon");
  searchIcon.classList.replace("hidden-icon", "visible-icon");
};

const stringToArray = (string) => {
  return string.trim().split(" ").join("%20");
};

const transition = () => {
  document.documentElement.classList.add("transition");
  window.setTimeout(() => {
    document.documentElement.classList.remove("transition");
  }, 1000);
};

async function getNutritionalData() {
  displayLoader();
  try {
    const res = await fetch(
      `https://edamam-edamam-nutrition-analysis.p.rapidapi.com/api/nutrition-data?nutrition-type=logging&ingr=${stringToArray(
        search.value
      )}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "edamam-edamam-nutrition-analysis.p.rapidapi.com",
          "x-rapidapi-key":
            "14c27a0fdfmsh8d07d5fe4e0ad0fp14ecd7jsn68e1c239df59",
        },
      }
    );

    const nutritionalData = await res.json();

    for (let i = 0; i < hiddenElements.length; i++) {
      hiddenElements[i].classList.remove("hidden-elements");
    }
    displaySearchIcon();
    const { calories, totalWeight } = nutritionalData;
    const fat = nutritionalData.totalDaily.FAT.quantity;
    const carbs = nutritionalData.totalDaily.CHOCDF.quantity;
    const protein = nutritionalData.totalDaily.PROCNT.quantity;
    const satFat = nutritionalData.totalDaily.FASAT.quantity;
    const fiber = nutritionalData.totalDaily.FIBTG.quantity;
    const sodium = nutritionalData.totalDaily.NA.quantity;
    const calcium = nutritionalData.totalDaily.CA.quantity;
    const potassium = nutritionalData.totalDaily.K.quantity;
    const cholesterol = nutritionalData.totalDaily.CHOLE.quantity;
    const vitA = nutritionalData.totalDaily.VITA_RAE.quantity;
    const vitC = nutritionalData.totalDaily.VITC.quantity;
    const vitD = nutritionalData.totalDaily.VITD.quantity;
    const sugar = nutritionalData.totalNutrients.SUGAR.quantity;

    let macroNutrientsGroup = [
      Math.round(nutritionalData.totalNutrients.CHOCDF.quantity),
      Math.round(nutritionalData.totalNutrients.PROCNT.quantity),
      Math.round(nutritionalData.totalNutrients.FAT.quantity),
    ];

    let microNutrientsGroup = [
      Math.round(nutritionalData.totalNutrients.FE.quantity),
      Math.round(nutritionalData.totalNutrients.MG.quantity),
      Math.round(nutritionalData.totalNutrients.NA.quantity),
      Math.round(nutritionalData.totalNutrients.CA.quantity),
      Math.round(nutritionalData.totalNutrients.K.quantity),
      Math.round(nutritionalData.totalNutrients.CHOLE.quantity),
      Math.round(nutritionalData.totalNutrients.VITB6A.quantity),
      Math.round(nutritionalData.totalNutrients.VITC.quantity),
      Math.round(nutritionalData.totalNutrients.ZN.quantity),
    ];

    /* code below for charts */
    /* Chart.defaults.global.defaultFontColor = "#999"; */
    let macroNutrientChart = document
      .getElementById("macro-nutrient-chart")
      .getContext("2d");

    let macroNutrientPieChart = new Chart(macroNutrientChart, {
      type: "pie",
      data: {
        datasets: [
          {
            label: "Macro Nutrient % Percentage",
            data: macroNutrientsGroup,
            backgroundColor: ["#4fcdd0", "#65f55b", "#924fd0"],
          },
        ],
        labels: ["Carbs", "Protein", "Fat"],
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      },
    });

    let microNutrientChart = document
      .getElementById("micro-bar-chart")
      .getContext("2d");

    let microNutrientBarChart = new Chart(microNutrientChart, {
      type: "bar",
      data: {
        labels: [
          "Iron",
          "Magnesium",
          "Sodium",
          "Calcium",
          "Potassium",
          "Cholesterol",
          "Vitamin B6",
          "Vitamin C",
          "Zinc",
        ],
        datasets: [
          {
            label: "microNutrients By Milligram",
            data: microNutrientsGroup,
            backgroundColor: "#ffe607",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {},
      },
    });

    const totalCarbsQuantity = Math.round(
      nutritionalData.totalNutrients.CHOCDF.quantity
    );
    const totalProteinQuantity = Math.round(
      nutritionalData.totalNutrients.PROCNT.quantity
    );
    const totalFatQuantity = Math.round(
      nutritionalData.totalNutrients.FAT.quantity
    );

    const threeMacrosSum =
      totalCarbsQuantity + totalProteinQuantity + totalFatQuantity;

    displayCaloriesFromCarbs(totalCarbsQuantity, threeMacrosSum, calories);
    displayCaloriesFromProtein(totalProteinQuantity, threeMacrosSum, calories);
    displayCaloriesFromFat(totalFatQuantity, threeMacrosSum, calories);

    displayNutrientDailyValues(fat, totalFatText);
    displayNutrientDailyValues(carbs, CarbsText);
    displayNutrientDailyValues(protein, totalProteinText);
    displayNutrientDailyValues(satFat, totalSatFatText);
    displayNutrientDailyValues(fiber, totalFiberText);
    displayNutrientDailyValues(sodium, totalSodiumText);
    displayNutrientDailyValues(calcium, totalCalciumText);
    displaySugarValue(sugar);
    displayNutrientDailyValues(potassium, totalPotassiumText);
    displayNutrientDailyValues(cholesterol, totalCholesterolText);
    displayNutrientDailyValues(vitA, totalVitaminAText);
    displayNutrientDailyValues(vitC, totalVitaminCText);
    displayNutrientDailyValues(vitD, totalVitaminDText);

    changeFoodHeading();

    displayCaloriesAmount(calories);
    displayMeasurementAmount(Math.round(totalWeight));
  } catch (e) {
    alert(
      "We're sorry we couldn't find that in our database. Either check your internet connection or try another search for a food with a measurement ex. 250g sweet potato"
    );
    search.style.border = "1px solid red";
    console.log(e);
  }
}
search.addEventListener("keyup", (e) => {
  e.preventDefault();
  if ((e.keyCode === 13 && search.value === "") || search.value === null) {
    return false;
  } else if (e.keyCode === 13) {
    search.style.border = "none";
    getNutritionalData();
  }
});
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (search.value === "" || search.value === null) {
    search.style.border = "1px solid red";
    return false;
  } else {
    search.style.border = "none";
    getNutritionalData();
  }
});

const displaySugarValue = (sugarValue) => {
  if (sugarValue === undefined) {
    document.getElementsByClassName("nutrient-value")[6].textContent = "0%";
  } else
    document.getElementsByClassName(
      "nutrient-value"
    )[6].textContent = `${getPercentage(sugarValue, 50)}%`;
};

const changeFoodHeading = () => {
  let foodItemHeading = document.getElementsByClassName("food-item-heading")[0];
  foodItemHeading.textContent = search.value;
};

const displayCaloriesAmount = (calorieData) => {
  const calorieAmount = document.getElementsByClassName("calorie-amount")[0];
  calorieAmount.textContent = calorieData;
};

const displayMeasurementAmount = (weightData) => {
  const measurementAmount = document.getElementsByClassName(
    "measurement-amount"
  )[0];
  measurementAmount.textContent = `${weightData} g`;
};

const displayCaloriesFromCarbs = (
  carbsValue,
  totalMacrosValue,
  totalCalories
) => {
  let caloriesFromCarbsNumber = document.getElementById(
    "calories-from-carbs-number"
  );
  let carbsPercentage = carbsValue / totalMacrosValue;
  caloriesFromCarbsNumber.textContent = Math.round(
    carbsPercentage * totalCalories
  );
};

const displayCaloriesFromProtein = (
  proteinValue,
  totalMacrosValue,
  totalCalories
) => {
  let caloriesFromProteinNumber = document.getElementById(
    "calories-from-protein-number"
  );
  let proteinPercentage = proteinValue / totalMacrosValue;
  caloriesFromProteinNumber.textContent = Math.round(
    proteinPercentage * totalCalories
  );
};

const displayCaloriesFromFat = (fatValue, totalMacrosValue, totalCalories) => {
  let caloriesFromFatNumber = document.getElementById(
    "calories-from-fat-number"
  );
  let fatPercentage = fatValue / totalMacrosValue;
  caloriesFromFatNumber.textContent = Math.round(fatPercentage * totalCalories);
};

/* display daily percentage values */

const displayNutrientDailyValues = (nutrientValue, nutrientText) => {
  if (nutrientValue === undefined) return;
  nutrientText.textContent = `${Math.round(nutrientValue)}%`;
};

/* get value to display daily sugar value */

const getPercentage = (smallNumber, largerNumber) => {
  let percentage = smallNumber / largerNumber;
  percentage = percentage * 100;
  return Math.round(percentage);
};
