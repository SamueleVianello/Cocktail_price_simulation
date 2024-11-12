let GLOBAL_SPIRITS = [];
let GLOBAL_COCKTAILS = [];
let GLOBAL_CUSTOMERS = [];
let UNIT_OF_COCKTAIL_BASE = 5; // one unit is 5cl
let TEXT_SCALE = 2;

let N_customers = 10;

// ------------ MODIFYABLE VARIABLES-------------
let min_gin_price = 3;
let start_gin_price = 5;
let max_gin_price = 8;
let gin_cost = 2;

let increase_perc = 0.04; // 0.01 = 1% increase per SINGLE ORDER
let required_orders = 1; // needed orders to increase
let decrease_perc = -0.01; // -0.01 = 1% decrease per MINUTE
let orders_per_hour = 20; //total orders in the bar per hour

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

  sim = new Simulation(dt, interval_time); //time in seconds
  sim.global_time = 21 * 60 * 60; // opening hour in seconds

  gin_commodity = new Commodity(
    "gin",
    "Gin Mare",
    start_gin_price,
    min_gin_price,
    max_gin_price,
    dt,
    gin_cost
  );
  gin_commodity.price_process.setBox(0, 0, width, height * 0.4);
  sim.addCommodity(gin_commodity);
  GLOBAL_SPIRITS.push(gin_commodity);

  vodka_commodity = new Commodity(
    "vodka",
    "Grey Goose Vodka",
    start_gin_price,
    min_gin_price,
    max_gin_price,
    dt,
    gin_cost
  );
  vodka_commodity.price_process.setBox(0, height * 0.4, width, height * 0.4);
  sim.addCommodity(vodka_commodity);
  GLOBAL_SPIRITS.push(vodka_commodity);

  importCocktails(cocktails);

  

  // create all customers and import them
  for (let i = 0; i < N_customers; i++) {
    let fav_cocktail = Math.random()>0.5 ? "gintonic01" : "vodkalemon01";
    console.log(fav_cocktail)
    GLOBAL_CUSTOMERS.push(
      new Customer(orders_per_hour / N_customers, fav_cocktail, sim.dt)
    );
    sim.addCustomer(GLOBAL_CUSTOMERS[i]);
  }

  let temp = cocktails[0];
  drink1 = new Cocktail(temp.id, temp.name, temp.bases, temp.other);
  drink1.importBases();

  

  
  // TESTS --------------
  // gintonic01
  cust1 = new Customer(orders_per_hour * 0.5, "gintonic01", sim.dt);
  //sim.addCustomer(cust1);

  cust2 = new Customer(orders_per_hour * 0.5, "gin", sim.dt);
  //sim.addCustomer(cust2);
  cust1.importCocktail();
  console.log(cust1);
  console.log(cust1.cocktail.bases[0].id);
}



function draw() {
  //noLoop();
  background(220);

  gin_commodity.price_process.drawFullGraph();
  vodka_commodity.price_process.drawFullGraph();
  sim.evolve();

  if (frameCount == hours_to_simulate* (60 / dt) * 60) {
    noLoop();
  }
}
