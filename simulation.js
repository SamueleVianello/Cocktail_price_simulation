class Simulation{
  constructor(dt, interval_time) {
    this.global_time = 0; //global time in seconds
    this.dt = dt;
    this.interval_time = interval_time;
    this.customers = [];
    this.commodities = [];
    this.drinks = [];
    this.prices = [];
  }

  addCustomer(cust,cocktail_list) {
    cust.importCocktail(cocktail_list);
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

  evolve() {
    this.global_time += this.dt;

    let other_profit = 0;
    let base_profit = 0;

    // UPDATE ALL CUSTOMERS AND CREATE ORDER LIST
    let orders = [];
    let order_map = new Map(); // Track orders by cocktail ID

    // Check orders for all customers
    for (let cust of this.customers) {
      cust.checkOrders();

      // If customer wants to order, add to order map
      if (cust.add_drink) {
        let cocktail_id = cust.cocktail.id;
        if (order_map.has(cocktail_id)) {
          order_map.set(cocktail_id, order_map.get(cocktail_id) + cust.add_drink);
        } else {
          order_map.set(cocktail_id, cust.add_drink);
        }
      }

      other_profit += cust.total_drinks * cust.cocktail.other.reduce((acc, x) => acc + (x.price-x.cost), 0);
    }

    // Convert order map to array of order objects
    for (let [id, qty] of order_map) {
      orders.push({
        id: id,
        qty: qty
      });
    }

    // Send orders to engine for processing
    //console.log("Processing orders:", orders);
    return orders;
  }
}
