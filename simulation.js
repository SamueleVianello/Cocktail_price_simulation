function toHHMMSS(s) {
  // converts seconds into hh:mm:ss format string
  let neg_flag = s < 0;
  s = Math.abs(s);
  let h = Math.floor(s / 3600);
  let min = Math.floor((s - h * 3600) / 60);
  let sec = Math.floor(s - h * 3600 - min * 60);
  h = h % 24;
  let str_h = h < 1 ? "00:" : (h < 10 ? "0" : "") + h + ":";
  let str_min = (min < 10 ? "0" : "") + min + ":";
  let str_sec = (sec < 10 ? "0" : "") + sec;
  return (neg_flag ? "-" : "") + str_h + str_min + str_sec;
}

class Simulation {
  constructor(dt, interval_time) {
    this.global_time = 0; //global time in seconds
    this.dt = dt;
    this.interval_time = interval_time;
    this.customers = [];
    this.commodities = [];
    this.drinks = [];
    this.prices = [];
  }

  /* // CAPIRE PERCHE' NON VA --> serve una variabile globale per salvare il customer
  addCustomer() {
    //let new_customer = ;
    this.customers.push(new Customer(2, "gin", this.dt));
    // TODO: vedere se serve aggiornare altro del customer
  }
  */

  addCustomer(cust) {
    cust.importCocktail();
    this.customers.push(cust);
    // TODO: vedere se serve aggiornare altro del customer
  }

  addCommodity(commodity) {
    commodity.current_order.timestamp = this.global_time;
    commodity.updateDt(this.dt);
    this.commodities.push(commodity);
    // TODO: vedere se serve aggiornare altro della commodity
  }

  addPriceProcess(prc) {
    prc.current_price.timestamp = this.global_time;
    this.prices.push(prc);

    // TODO: vedere se serve aggiornare altro del price
  }

  /*
  resetAndAddEverything(){
    this.customers.length = 0;
    for(let c of GLOBAL_CUSTOMERS){
      this.customers.push(c);
    }

    this.commodities.length = 0;
    for(let c of GLOBAL_COMMODITIES){
      this.commodities.push(c);
    }

  }
    */

  logPrices() {
    for (let p of this.prices) {
      p.logCurrentPrice();
      //console.log(p.current.value);
    }
  }

  // TODO: creare funzione in sim per disegnare tutti i grafici
  drawGraphs(xmin=0, ymin=0, xmax=width, ymax=height){

  }

  evolve() {
    this.global_time += this.dt;

    let other_profit = 0;
    let base_profit = 0;

    // UPDATE ALL CUSTOMERS
    for (let cust of this.customers) {
      cust.checkOrders();

      // add order to relevant commodity when needed
      if (cust.add_drink) {
        // cycle through all possible alcoholic bases of the cocktail
        for(let b of cust.cocktail.bases){
          for (let c of this.commodities) {
            if (c.id == b.id) {
              c.addOrder(cust.add_drink * b.quantity / c.price_unit);
            }
          }
        }
        
      }
      other_profit += cust.total_drinks * cust.cocktail.other.reduce((acc, x) => acc + (x.price-x.cost), 0);
      //console.log(cust.poisson.current.value);
    }

    // UPDATE ALL PRICES
    for (let c of this.commodities) {
      //c.addOrder(floor(random(0, 2)));
      c.updatePrice();
      c.saveHistory(this.global_time);
      base_profit+=c.getProfit(SHOW_PROFIT);
      //console.log("PROFIT:", c.getProfit());
    }

    // check if we need to create a new section&candle
    let current_interval = floor(this.global_time / this.interval_time);
    let prev_interval = floor(
      (this.global_time - this.dt) / this.interval_time
    );
    if (current_interval > prev_interval) {
      // UPDATE ALL PRICES HISTORY
      for (let c of this.commodities) {
        c.price_process.savePrice(this.global_time);
      }
    }

    // show clock
    let time_str = toHHMMSS(this.global_time);
    push();
    textSize(height * 0.08);
    text(time_str, width * 0.5, 0.88 * height);
    pop();

    // get total profit (alc. bases + other);
    push();
    textSize(height * 0.04);
    text("Tot profit: " + (base_profit + other_profit).toFixed(2), width * 0.5, 0.94 * height);
    pop();
  }
}
