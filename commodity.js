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
    this.price_unit = unit;
    this.cost = cost;
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
      vol: [],
      price: [],
    };
    this.current_order = {
      timestamp: 0,
      vol: 0,
      price: start_price,
    };
  }

  getPrice(delta_t) {
    // delta_t = how far back to go in seconds
    let idx = floor(delta_t/this.dt)
    return this.current_order.price;
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

  updateDt(delta){
    this.dt = delta;
    this.price_process.dt = delta;
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
}
