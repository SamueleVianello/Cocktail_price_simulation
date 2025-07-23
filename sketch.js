let GLOBAL_COMMODITIES = [];
let GLOBAL_COCKTAILS = [];
let GLOBAL_CUSTOMERS = [];
let TEXT_SCALE = 2;
let SHOW_PROFIT = true;

let bg_color = "#e1e1e1";


// ------------ MODIFYABLE VARIABLES-------------
let orders_per_hour = 150; //total orders in the bar per hour
let N_customers = 60;

let dt = 10; // seconds between every price update
let interval_time = 5 * 60; // seconds between every CANDLE update
let hours_to_simulate = 5;
// ------------------------------------------------

let sim;
let gin_commodity;
let vodka_commodity;
let cust1, cust2;

let drink1;

let entry_test;
let register_test;
let eng; 

function setup() {
  createCanvas(windowWidth, windowHeight);

  rectMode(CORNERS);
  textAlign(CENTER);
  frameRate(30);

  // ----------------------------- ENGINE -----------------------------
  let start_time = 21 * 60 * 60;
  eng = new Engine(start_time, dt);
  eng.importCommodities(commodities)
  //eng.logCommodityList();
  eng.importCocktails(cocktails)
  //eng.logCocktails();
  //eng.evolve()
  eng.createEvent("crash",start_time+60*20)
  eng.createEvent("fomo",start_time+60*60)

  // ----------------------------- REGISTER ------------------------------
  register_test = new Register(0, 0.*windowHeight, windowWidth*0.19, windowHeight, eng);
  register_test.create();

  // ----------------------------- SIMULATION -----------------------------
  // create simulation
  sim = new Simulation(dt, interval_time); //time in seconds
  sim.global_time = eng.global_time; // opening hour in seconds
  eng.addSimulation(sim);

  // create all customers and import them
  for (let i = 0; i < N_customers; i++) {
    let fav_cocktail_id = sampleElement(eng.cocktail_list.map(obj => obj.id));
    //console.log(fav_cocktail_id)
    sim.addCustomer(
      new Customer(orders_per_hour / N_customers, fav_cocktail_id, sim.dt),
      eng.cocktail_list
    );
  }
  //------------------------------------------------
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Update register position and size
  if (register_test) {
    register_test.container.position(0, 0);
    register_test.container.size(windowWidth*0.19, windowHeight);
  }
  // also update the graphs box size
}

function draw() {
  if (frameCount >=600){
    //let requests = ['gintonic01', 'vodkalemon01'];
    //let prices = eng.handlePriceRequests(requests);
    //console.log(prices);
    eng.logOrderStatistics();
    noLoop();
  } 
  background(220);
  eng.evolve()
  eng.showMenu(0.75*width, 0, width, 0.8*height)

  if (frameCount ==  hours_to_simulate* (60 / dt) * 60) {
    noLoop();
  }
}
