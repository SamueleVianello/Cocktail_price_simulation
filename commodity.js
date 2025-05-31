function dot(v, w) {
  return v.reduce((l, r, i) => l + r * w[i], 0);
}

class Commodity {
  constructor(id, name, min_price, max_price, start_price, unit, cost = 0, dt=10 ) {
    this.id = id;
    this.name = name;
    this.min_price = min_price;
    this.max_price = max_price;
    this.start_price = start_price;
    this.price_unit = unit; //units used for the quoted price
    this.cost = cost; //
    this.dt = dt;

    this.price_process = new PriceProcess(
      id,
      name,
      min_price,
      max_price,
      start_price,
      dt
    );

    this.order_history = {
      timestamp: [],
      vol: [], //volume of orders
      price: [],
    };
    this.current_order = {
      timestamp: 0,
      vol: 0, //volume of order
      price: start_price,
    };
  }

  getPrice(delta_t) {
    // get the price in the past saved in the history
    // delta_t = how far back to go in SECONDS
    if (delta_t == 0) return this.current_order.price;
    else {
      let time = this.current_order.timestamp + delta_t;
      let price = -99;

      // look for timestamp in order history
      let found = false;
      let i =0;
      let len = this.order_history.timestamp.length;
      while(!found && i<len){
        i++;
        if (Math.abs(this.order_history.timestamp[len-i]-time) < this.dt){
          found = true;
          price = this.order_history.price[len-i];
        }
        
      }

      // -- DEBUGGING
      //console.log("timestamp",toHHMMSS(this.order_history.timestamp[len-i]))
      //console.log("price",this.order_history.price[len-i])
      //console.log("vol",this.order_history.vol[len-i])
      return price;
    }
    
  }

  getProfit(show = true) {
    let tot_orders =
      this.current_order.vol +
      this.order_history.vol.reduce((partialSum, a) => partialSum + a, 0);
    let tot_cost = tot_orders * this.cost;
    let tot_profit = this.current_order.vol * this.current_order.price;
    tot_profit += dot(this.order_history.vol, this.order_history.price);
    let net = tot_profit - tot_cost;

    if (show) {
      push();
      textSize(this.price_process.box.h * 0.03*TEXT_SCALE);
      text(
        "Profit: " + net.toFixed(2),
        this.price_process.box.x1 + this.price_process.box.w * 0.5,
        this.price_process.box.y1 + 0.21 * this.price_process.box.h*TEXT_SCALE
      );
      //text("Tot cost:" + tot_cost, width * 0.5, 0.25 * height);
      //text("Tot profit:" + tot_profit, width * 0.5, 0.28 * height);
      //text("Tot orders:" + tot_orders, width * 0.5, 0.31 * height);
      pop();
    }
    return net;
  }

  addOrder(qty) {
    this.current_order.vol += qty;
    //console.log("Added ", qty);
  }

  modifyPrice(factor){
    this.price_process.modifyPrice(factor);
  }

  updatePrice() {
    this.price_process.updatePrice(this.current_order.vol);
    this.current_order.price = this.price_process.current_price.close;
  }

  saveHistory(time) {
    this.order_history.timestamp.push(this.current_order.timestamp);
    this.order_history.vol.push(this.current_order.vol);
    this.order_history.price.push(this.current_order.price);

    this.current_order.timestamp = time;
    this.current_order.vol = 0;
  }

  updateDt(delta){
    this.dt = delta;
    this.price_process.dt = delta;
  }

  
  logDetails(){
    console.log('-------- COMMODITY LOG -----------')
    console.log("ID", this.id);
    console.log("Name", this.name);
    console.log("Min price", this.min_price);
    console.log("Max price", this.max_price);
    console.log("Start price", this.start_price);
    console.log("Price unit", this.price_unit);
    console.log("Cost", this.cost);
    console.log("dt", this.dt);
    console.log("Current price", this.current_order.price);
    //console.log("Order history", this.order_history);
  }
  
}
