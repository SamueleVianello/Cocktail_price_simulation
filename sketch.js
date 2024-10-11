let sim;
let gin_price;
let gin_commodity;
let cust1, cust2;

let drink1;

let GLOBAL_SPIRITS = [];
let GLOBAL_COCKTAILS = [];

let all_customers = [];
let N_customers = 1000;

// ------------ MODIFYABLE VARIABLES-------------
let min_gin_price = 8;
let start_gin_price = 10;
let max_gin_price = 15;
let gin_cost = 7;

let increase_perc = 0.04; // 0.01 = 1% increase per SINGLE ORDER
let required_orders = 1; // needed orders to increase
let decrease_perc = -0.01; // -0.01 = 1% decrease per MINUTE
let orders_per_hour = 1000;

let dt = 60; // seconds between every price update
let interval_time = 5 * 60; // seconds between every CANDLE update
// ------------------------------------------------

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
  sim.addAsset(gin_commodity);
  GLOBAL_SPIRITS.push(gin_commodity);
  // gintonic01
  cust1 = new Customer(orders_per_hour * 0.5, "gin", sim.dt);
  //sim.addCustomer(cust1);

  cust2 = new Customer(orders_per_hour * 0.5, "gin", sim.dt);
  //sim.addCustomer(cust2);

  // create all customers and import them
  for (let i = 0; i < N_customers; i++) {
    all_customers.push(
      new Customer(orders_per_hour / N_customers, "gin", sim.dt)
    );
    sim.addCustomer(all_customers[i]);
  }

  let temp = cocktails[0];
  drink1 = new Cocktail(temp.id, temp.name, temp.bases, temp.other);
  drink1.importBases();

  gin_commodity.price_process.setBox(0, 0, width * 0.8, height * 0.8);

  importCocktails(cocktails);

  cust1.importCocktail();
  console.log(cust1);
}

function draw() {
  //noLoop();
  background(220);

  gin_commodity.price_process.drawFullGraph();
  sim.evolve();

  if (frameCount == (60 / dt) * 60) {
    noLoop();
  }
}
