let GLOBAL_COMMODITIES = [];
let GLOBAL_COCKTAILS = [];
let GLOBAL_CUSTOMERS = [];
let TEXT_SCALE = 2;
let SHOW_PROFIT = true;


// ------------ MODIFYABLE VARIABLES-------------
let min_gin_price = 3;
let start_gin_price = 5;
let max_gin_price = 8;
let gin_cost = 4;

let increase_perc = 0.04; // 0.01 = 1% increase per SINGLE ORDER
let required_orders = 1; // needed orders to increase
let decrease_perc = -0.005; // -0.01 = 1% decrease per MINUTE
let orders_per_hour = 30; //total orders in the bar per hour
let N_customers = 20;

let dt = 20; // seconds between every price update
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

function setup() {
  createCanvas(windowWidth, windowHeight);

  rectMode(CORNERS);
  textAlign(CENTER);
  frameRate(30);

  // create simulation
  sim = new Simulation(dt, interval_time); //time in seconds
  sim.global_time = 21 * 60 * 60; // opening hour in seconds

  // import commodities (= alcohol bases) from list_of_commodities.js and add them to simulation
  importCommodities(commodities, sim);

  // import coctails from list_of_cocktails.js
  importCocktails(cocktails);

  

  // create all customers and import them
  for (let i = 0; i < N_customers; i++) {
    let fav_cocktail = sampleElement(GLOBAL_COCKTAILS.map(obj => obj.id));
    //console.log(fav_cocktail)
    GLOBAL_CUSTOMERS.push(
      new Customer(orders_per_hour / N_customers, fav_cocktail, sim.dt)
    );
    sim.addCustomer(GLOBAL_CUSTOMERS[i]);
  }

  //sim.resetAndAddEverything();
  for(let c of GLOBAL_COMMODITIES){
    console.log(c)
  }

  //GLOBAL_COCKTAILS[2].importBases()
  //console.log(GLOBAL_COCKTAILS[2])
  //GLOBAL_COCKTAILS[2].getPrice()

  showMenu(0.8*width, 0, width, 0.8*height)


  register_test = new Register(0, 0.*windowHeight, windowWidth*0.19, windowHeight);
  register_test.create();

  let eng = new Engine(sim.global_time);
  eng.importCommodities(commodities)
  //eng.logCommodityList();
  eng.importCocktails(cocktails)
  //eng.logCocktails();

  eng.evolve()

}



function draw() {
  noLoop();
  background(220);
  
  for(let c of GLOBAL_COMMODITIES){
    c.price_process.drawFullGraph();
  }
  
  

  //GLOBAL_COMMODITIES[0].price_process.drawFullGraph();
  //GLOBAL_COMMODITIES[1].price_process.drawFullGraph();
  sim.evolve();
  showMenu(0.75*width, 0, width, 0.8*height)


  //console.log(GLOBAL_COMMODITIES[0])
  //console.log(GLOBAL_COMMODITIES[1])
  if (frameCount ==  hours_to_simulate* (60 / dt) * 60) {
    noLoop();
  }

}
