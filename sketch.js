let GLOBAL_COMMODITIES = [];
let GLOBAL_COCKTAILS = [];
let GLOBAL_CUSTOMERS = [];
let UNIT_OF_COCKTAIL_BASE = 5; // one unit is 5cl
let TEXT_SCALE = 2;
let SHOW_PROFIT = true;


// ------------ MODIFYABLE VARIABLES-------------
let min_gin_price = 3;
let start_gin_price = 5;
let max_gin_price = 8;
let gin_cost = 4;

let increase_perc = 0.04; // 0.01 = 1% increase per SINGLE ORDER
let required_orders = 1; // needed orders to increase
let decrease_perc = -0.01; // -0.01 = 1% decrease per MINUTE
let orders_per_hour = 30; //total orders in the bar per hour
let N_customers = 20;

let dt = 20; // seconds between every price update
let interval_time = 5 * 60; // seconds between every CANDLE update
let hours_to_simulate = 2;
// ------------------------------------------------

let sim;
let gin_commodity;
let vodka_commodity;
let cust1, cust2;

let drink1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CORNERS);
  textAlign(CENTER);
  frameRate(30);

  // create simulation
  sim = new Simulation(dt, interval_time); //time in seconds
  sim.global_time = 21 * 60 * 60; // opening hour in seconds

  // import coctails from list_of_cocktails.js
  importCocktails(cocktails);

  // import commodities (= alcohol bases) from list_of_commodities.js and add them to simulation
  importCommodities(commodities, sim);

  // create all customers and import them
  for (let i = 0; i < N_customers; i++) {
    //let fav_cocktail = Math.random()>0.5 ? "gintonic01" : "vodkalemon01";

    let fav_cocktail = sampleElement(GLOBAL_COCKTAILS.map(obj => obj.id));
    console.log(fav_cocktail)
    GLOBAL_CUSTOMERS.push(
      new Customer(orders_per_hour / N_customers, fav_cocktail, sim.dt)
    );
    sim.addCustomer(GLOBAL_CUSTOMERS[i]);
  }

  //sim.resetAndAddEverything();

  for(let c of GLOBAL_COMMODITIES){
    console.log(c)
  }

  
}



function draw() {
  //noLoop();
  background(220);

  for(let c of GLOBAL_COMMODITIES){
    c.price_process.drawFullGraph();
  }

  //GLOBAL_COMMODITIES[0].price_process.drawFullGraph();
  //GLOBAL_COMMODITIES[1].price_process.drawFullGraph();
  sim.evolve();

  //console.log(GLOBAL_COMMODITIES[0])
  //console.log(GLOBAL_COMMODITIES[1])
  if (frameCount == 180 + 0*hours_to_simulate* (60 / dt) * 60) {
    noLoop();
  }
}
