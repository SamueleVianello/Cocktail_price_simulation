function toHHMMSS(s) {
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
    this.assets = [];
    this.drinks = [];
    this.prices = [];
  }

  /* // CAPIRE PERCHE' NON VA
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

  addAsset(asset) {
    asset.current_order.timestamp = this.global_time;
    this.assets.push(asset);
    // TODO: vedere se serve aggiornare altro dell'asset
  }

  addPriceProcess(prc) {
    prc.current_price.timestamp = this.global_time;
    this.prices.push(prc);

    // TODO: vedere se serve aggiornare altro del price
  }

  logPrices() {
    for (let p of this.prices) {
      p.logCurrentPrice();
      //console.log(p.current.value);
    }
  }

  evolve() {
    this.global_time += this.dt;

    // UPDATE ALL CUSTOMERS
    for (let c of this.customers) {
      c.checkOrders();

      // add order to relevant commodity when needed
      if (c.add_drink) {
        for (let a of this.assets) {
          if (a.id == c.drink_id) {
            a.addOrder(c.add_drink);
          }
        }
      }
      //console.log(c.poisson.current.value);
    }

    // UPDATE ALL PRICES
    for (let c of this.assets) {
      //c.addOrder(floor(random(0, 2)));
      c.updatePrice();
      c.saveHistory(this.global_time);
      c.getProfit();
      //console.log("PROFIT:", c.getProfit());
    }

    // check if we need to create a new section&candle
    let current_interval = floor(this.global_time / this.interval_time);
    let prev_interval = floor(
      (this.global_time - this.dt) / this.interval_time
    );
    if (current_interval > prev_interval) {
      // UPDATE ALL PRICES HISTORY
      for (let c of this.assets) {
        c.price_process.savePrice(this.global_time);
      }
    }

    let time_str = toHHMMSS(this.global_time);
    push();
    textSize(height * 0.08);
    text(time_str, width * 0.5, 0.9 * height);
    pop();
  }
}
