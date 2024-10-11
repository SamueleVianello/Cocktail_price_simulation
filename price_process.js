let my_red = "#dd0000";
let my_green = "#00bb00";

function clamp(x, m, M) {
  return min(max(x, m), M);
}

class PriceProcess {
  constructor(
    asset_id,
    asset_name,
    initial_price,
    min_price,
    max_price,
    dt = 10
  ) {
    this.asset_id = asset_id;
    this.asset_name = asset_name;
    this.min_price = min_price;
    this.max_price = max_price;
    this.dt = dt;
    this.history = {
      timestamp: [],
      open: [],
      close: [],
      maximum: [],
      minimum: [],
      vol: [],
    };
    this.current_price = {
      timestamp: 0,
      open: initial_price,
      close: initial_price,
      maximum: initial_price,
      minimum: initial_price,
      vol: 0,
    };

    // box used to show graph
    this.box = {
      x1: 0,
      y1: 0,
      x2: width,
      y2: height,
      w: width,
      h: height,
      dx: width / 30,
    };

    console.log(this.box);
  }

  updatePrice(order_vol = 0) {
    // PRICE IS UPDATED at the END of each -dt- interval

    // ************************************************
    // PRICE UPDATE FORMULA

    let new_price;
    let increase_factor = Math.pow(
      1 + increase_perc,
      order_vol / required_orders
    );

    let decrease_factor = Math.pow(1 + decrease_perc, this.dt / 60);

    if (order_vol > 0) {
      new_price = this.current_price.close * increase_factor;
    } else new_price = this.current_price.close * decrease_factor;

    //console.log("ORDER:", order_vol);
    //console.log("new price:", new_price);
    // ************************************************

    let new_vol = order_vol;

    // update current price, max, min and vol
    new_price = clamp(new_price, this.min_price, this.max_price);
    this.current_price.close = new_price;
    if (new_price > this.current_price.maximum)
      this.current_price.maximum = new_price;
    if (new_price < this.current_price.minimum)
      this.current_price.minimum = new_price;

    this.current_price.vol += new_vol;
  }

  setBox(x1, y1, w, h, dx = 0) {
    this.box.x1 = x1;
    this.box.y1 = y1;
    this.box.x2 = x1 + w;
    this.box.y2 = y1 + h;
    this.box.w = w;
    this.box.h = h;
    this.box.dx = dx == 0 ? w / 30 : dx;
  }

  savePrice(timestamp) {
    this.history.timestamp.push(this.current_price.timestamp);
    this.history.open.push(this.current_price.open);
    this.history.close.push(this.current_price.close);
    this.history.maximum.push(this.current_price.maximum);
    this.history.minimum.push(this.current_price.minimum);
    this.history.vol.push(this.current_price.vol);

    this.current_price.timestamp = timestamp;
    this.current_price.open = this.current_price.close;
    //this.current_price.close = this.current_price.close;
    this.current_price.maximum = this.current_price.close;
    this.current_price.minimum = this.current_price.close;
    this.current_price.vol = 0;
  }

  logCurrentPrice() {
    console.log("------------", this.asset_id, "-------------");
    console.log("timestamp:", "\t", this.current_price.timestamp);
    console.log("open:", "\t", this.current_price.open);
    console.log("close:", "\t", this.current_price.close);
    console.log("max:", "\t", this.current_price.maximum);
    console.log("min:", "\t", this.current_price.minimum);
    console.log("vol:", "\t", this.current_price.vol);
    console.log("----------------");
  }

  drawFullGraph() {
    this.drawCurrentPrice();
    this.drawHistory();
  }

  drawHistory() {
    let n_history = this.history.timestamp.length;
    for (let i = n_history - 1; i >= 0; i--) {
      if (this.box.w * 0.5 - this.box.dx * (n_history - i) < this.box.x1) break;
      drawCandle(
        this.history.open[i],
        this.history.close[i],
        this.history.minimum[i],
        this.history.maximum[i],
        this.min_price,
        this.max_price,
        //this.box.x1 + this.box.w * 0.5 - this.box.dx * (n_history - i - 1),
        //this.box.dx / 2
        this.box.x1 + this.box.w * 0.5 - this.box.dx * (n_history - i - 1),
        this.box
      );
    }
  }

  drawCurrentPrice() {
    drawCandle(
      this.current_price.open,
      this.current_price.close,
      this.current_price.minimum,
      this.current_price.maximum,
      this.min_price,
      this.max_price,
      this.box.w * 0.5 + this.box.dx,
      this.box
    );

    push();
    noFill();
    stroke(0);
    rect(this.box.x1, this.box.y1, this.box.w, this.box.h);
    pop();

    push();
    textSize(this.box.h * 0.08);
    text(
      this.current_price.close.toFixed(2),
      this.box.w * 0.5,
      0.1 * this.box.h
    );

    textSize(this.box.h * 0.04);
    text(this.asset_name, this.box.w * 0.5, 0.15 * this.box.h);
    //textSize(height * 0.04);
    let tot_orders = this.history.vol.reduce(
      (partialSum, a) => partialSum + a,
      0
    );
    tot_orders += this.current_price.vol;
    textSize(this.box.h * 0.03);
    text("tot orders: " + tot_orders, this.box.w * 0.5, 0.18 * this.box.h);
    pop();
  }
}

function drawCandle(
  curr_open,
  curr_close,
  curr_min,
  curr_max,
  min_val,
  max_val,
  center_x,
  box
) {
  let bound_top_y = 0.1 * box.h;
  let bound_bottom_y = 0.9 * box.h;
  let candle_top_y = map(
    curr_max,
    min_val,
    max_val,
    bound_bottom_y,
    bound_top_y
  );

  let candle_bottom_y = map(
    curr_min,
    min_val,
    max_val,
    bound_bottom_y,
    bound_top_y
  );

  let rect_top_y = map(
    curr_open,
    min_val,
    max_val,
    bound_bottom_y,
    bound_top_y
  );
  let rect_bottom_y = map(
    curr_close,
    min_val,
    max_val,
    bound_bottom_y,
    bound_top_y
  );

  let c = my_green;
  if (curr_close < curr_open) c = my_red;
  push();
  stroke(c);
  strokeWeight((3 / 500) * box.w);
  line(center_x, candle_bottom_y, center_x, candle_top_y);
  fill(c);
  noStroke();
  rect(
    center_x - 0.5 * box.dx * 0.5,
    rect_bottom_y,
    center_x + 0.5 * box.dx * 0.5,
    rect_top_y
  );
  pop();
}