function dot(v, w) {
  return v.reduce((l, r, i) => l + r * w[i], 0);
}

class Commodity {
  constructor(id, name, min_price, max_price, start_price, dt, cost = 0) {
    this.id = id;
    this.name = name;
    this.min_price = min_price;
    this.max_price = max_price;
    this.start_price = start_price;
    this.dt = dt;
    this.cost = cost;
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

  getPrice() {
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
      textSize(this.price_process.box.h * 0.03);
      text(
        "Profit: " + net.toFixed(2),
        this.price_process.box.x1 + this.price_process.box.w * 0.5,
        this.price_process.box.y1 + 0.21 * this.price_process.box.h
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
