// Predefined price and cash-in-drawer (cid) values
let price = 19.5;
let cid = [
  ['PENNY', 0.5],
  ['NICKEL', 0],
  ['DIME', 0],
  ['QUARTER', 0],
  ['ONE', 0],
  ['FIVE', 0],
  ['TEN', 0],
  ['TWENTY', 0],
  ['ONE HUNDRED', 0]
];

// Event listener for the purchase button
document.getElementById("purchase-btn").addEventListener("click", function() {
  // Get the cash input from the user
  let cash = parseFloat(document.getElementById("cash").value);

  // Check if cash input is valid
  if (isNaN(cash) || cash <= 0) {
    alert("Please enter a valid amount of cash.");
    return;
  }

  // Calculate the change due
  let change = cash - price;

  // Handle different cases: less cash, exact cash, or more cash
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item.");
  } else if (cash === price) {
    document.getElementById("change-due").textContent = "No change due - customer paid with exact cash.";
  } else {
    // Calculate and display the change
    let result = getChange(Math.round(change * 100), cid.map(item => [item[0], Math.round(item[1] * 100)]));
    document.getElementById("change-due").textContent = result;
  }
});

// Function to calculate the change based on the cash in drawer (cid)
function getChange(change, cid) {
  // Define the currency units and their values in cents
  let currencyUnits = [
    ["PENNY", 1],
    ["NICKEL", 5],
    ["DIME", 10],
    ["QUARTER", 25],
    ["ONE", 100],
    ["FIVE", 500],
    ["TEN", 1000],
    ["TWENTY", 2000],
    ["ONE HUNDRED", 10000]
  ];

  // Calculate total cash in the drawer (in cents)
  let totalInDrawer = cid.reduce((acc, curr) => acc + curr[1], 0);

  // If the total in drawer is less than change, return insufficient funds
  if (totalInDrawer < change) {
    return "Status: INSUFFICIENT_FUNDS";
  }

  // If the total in drawer is exactly equal to the change, return CLOSED with the breakdown of change
  if (totalInDrawer === change) {
    let exactChange = getExactChange(change, cid, currencyUnits);
    return "Status: CLOSED " + exactChange;
  }

  // Otherwise, calculate the change to give back
  let changeArr = [];
  for (let i = currencyUnits.length - 1; i >= 0; i--) {
    let currencyName = currencyUnits[i][0];
    let currencyValue = currencyUnits[i][1];
    let availableAmount = cid[i][1];
    let currencyCount = 0;

    // While we can give this currency as change, reduce the change amount
    while (change >= currencyValue && availableAmount >= currencyValue) {
      change -= currencyValue;
      availableAmount -= currencyValue;
      currencyCount += currencyValue;
    }

    if (currencyCount > 0) {
      changeArr.push(`${currencyName}: $${(currencyCount / 100).toFixed(2)}`);
    }
  }

  // If there's still some change left and we can't provide exact change, return insufficient funds
  if (change > 0) {
    return "Status: INSUFFICIENT_FUNDS";
  }

  // Otherwise, return the change in highest to lowest currency order
  return "Status: OPEN " + changeArr.join(" ");
}

// Helper function to get exact change breakdown (working in cents)
function getExactChange(change, cid, currencyUnits) {
  let exactChangeArr = [];
  for (let i = currencyUnits.length - 1; i >= 0; i--) {
    let currencyName = currencyUnits[i][0];
    let currencyValue = currencyUnits[i][1];
    let availableAmount = cid[i][1];
    let currencyCount = 0;

    // While we can give this currency as part of the exact change, reduce the change amount
    while (change >= currencyValue && availableAmount >= currencyValue) {
      change -= currencyValue;
      availableAmount -= currencyValue;
      currencyCount += currencyValue;
    }

    if (currencyCount > 0) {
      exactChangeArr.push(`${currencyName}: $${(currencyCount / 100).toFixed(2)}`);
    }
  }
  return exactChangeArr.join(" ");
}