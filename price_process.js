let my_red = "#dd0000";
let my_green = "#00bb00";

function clamp(x, m, M) {
  return min(max(x, m), M);
}

class PriceProcess {
  constructor(
    asset_id,
    asset_name,
    min_price,
    max_price,
    initial_price,
    increase_perc=0.04,
    decrease_perc=-0.005,
    dt = 10
  ) {
    this.asset_id = asset_id;
    this.asset_name = asset_name;
    this.min_price = min_price;
    this.max_price = max_price;
    this.increase_perc = increase_perc;
    this.decrease_perc = decrease_perc;
    this.dt = dt; // in seconds, used to compute the price update
    this.history = { //history of price candles data and volumes
      timestamp: [],
      open: [],
      close: [],
      maximum: [],
      minimum: [],
      vol: [],
      asset_id: []
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
      offset: 0.75
    };

    //console.log(this.box);
  }
  
  modifyPrice(f){
    let new_price = clamp(this.current_price.close * (1-f), this.min_price, this.max_price);
    //console.log(`- Final price after clamping: ${new_price}`);
    
    this.current_price.close = new_price;
    if (new_price > this.current_price.maximum)
      this.current_price.maximum = new_price;
    if (new_price < this.current_price.minimum)
      this.current_price.minimum = new_price;
    this.current_price
  }

  updatePrice(order_vol = 0, multiplier =1) {
    // PRICE IS UPDATED at the END of each -dt- interval

    // ************************************************
    // PRICE UPDATE FORMULA

    let new_price;
    let increase_factor = Math.pow(
      1 + this.increase_perc * multiplier,
      order_vol
    );

    let decrease_factor = Math.pow(1 + this.decrease_perc * multiplier, this.dt / 60);

    // console.log(`Price update for ${this.asset_id}:`)
    // console.log(`- Current price: ${this.current_price.close}`)
    // console.log(`- Order volume: ${order_vol}`)
    // console.log(`- Increase factor: ${increase_factor}`)
    // console.log(`- Decrease factor: ${decrease_factor}`)
    // console.log(`- increase_perc: ${increase_perc}`)
    // console.log(`- decrease_perc: ${decrease_perc}`)
    // console.log(`- required_orders: ${required_orders}`)

    if (order_vol > 0) {
      new_price = this.current_price.close * increase_factor;
      //console.log(`- Using increase: new price = ${new_price}`);
    } else {
      new_price = this.current_price.close * decrease_factor;
      //console.log(`- Using decrease: new price = ${new_price}`);
    }

    // update current price, max, min and vol
    new_price = clamp(new_price, this.min_price, this.max_price);
    //console.log(`- Final price after clamping: ${new_price}`);
    
    this.current_price.close = new_price;
    if (new_price > this.current_price.maximum)
      this.current_price.maximum = new_price;
    if (new_price < this.current_price.minimum)
      this.current_price.minimum = new_price;

    this.current_price.vol += order_vol;
  }

  setBox(x1, y1, w, h, dx = 0) {
    this.box.x1 = x1;
    this.box.y1 = y1;
    this.box.x2 = x1 + w;
    this.box.y2 = y1 + h;
    this.box.w = w;
    this.box.h = h;
    this.box.dx = dx == 0 ? w / 30 : dx;
    this.box.offset = 0.75; // where to start drawing the current candle
  }

  savePrice(timestamp) {
    this.history.timestamp.push(this.current_price.timestamp);
    this.history.open.push(this.current_price.open);
    this.history.close.push(this.current_price.close);
    this.history.maximum.push(this.current_price.maximum);
    this.history.minimum.push(this.current_price.minimum);
    this.history.vol.push(this.current_price.vol);
    this.history.asset_id.push(this.asset_id);

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
    push();
    rectMode(CORNER)
    fill(bg_color);
    stroke(0);
    rect(this.box.x1, this.box.y1, this.box.w, this.box.h);
    pop();
    this.drawHistory();
    this.drawCurrentPrice();
    
  }

  drawHistory() {
    let n_history = this.history.timestamp.length;
    for (let i = n_history - 1; i >= 0; i--) {
      if ((this.box.w * this.box.offset - this.box.dx * (n_history - i)) < 0) 
        {
          //console.log("breaking at ",i)
          break;
        }
      let center_x = this.box.w * this.box.offset - this.box.dx * (n_history - i - 1);

      drawCandle(
        this.history.open[i],
        this.history.close[i],
        this.history.minimum[i],
        this.history.maximum[i],
        this.min_price,
        this.max_price,
        //this.box.x1 + this.box.w * this.box.offset - this.box.dx * (n_history - i - 1),
        //this.box.dx / 2
        center_x,
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
      this.box.w * this.box.offset + this.box.dx, //center_x
      this.box
    );

    push();
    translate(this.box.x1, this.box.y1);

    textSize(TEXT_SCALE *this.box.h * 0.08);
    text(
      this.current_price.close.toFixed(2),
      this.box.w * 0.5,
      0.1 * this.box.h*TEXT_SCALE
    );

    textSize(TEXT_SCALE*this.box.h * 0.04);
    text(this.asset_name, this.box.w * 0.5, 0.15 * this.box.h*TEXT_SCALE);
    //textSize(height * 0.04);
    let tot_orders = this.history.vol.reduce(
      (partialSum, a) => partialSum + a,
      0
    );
    tot_orders += this.current_price.vol;
    textSize(TEXT_SCALE*this.box.h * 0.03);
    text("tot orders: " + tot_orders, this.box.w * 0.5, 0.18 * this.box.h*TEXT_SCALE);
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

  /*
  // DEBUG VALUES
  console.log("curr_max",curr_max);
  console.log("min_val",min_val);
  console.log("max_val",max_val);
  console.log("bound_bottom_y",bound_bottom_y);
  console.log("bound_top_y",bound_top_y);
  console.log("candle top y ", candle_top_y)
  */

  let c = (curr_close >= curr_open)? my_green: my_red;
  push();
  translate(box.x1, box.y1);
  stroke(c);
  strokeWeight((3 / 500) * box.w);
  line(center_x, candle_bottom_y, center_x, candle_top_y);
  fill(c);
  noStroke()
  rect(
    center_x - 0.5 * box.dx * 0.5,
    rect_bottom_y,
    center_x + 0.5 * box.dx * 0.5,
    rect_top_y
  );
  if(abs(rect_top_y-rect_bottom_y)<=1 ){
    stroke(c);
    line(
      center_x - 0.5 * box.dx * 0.5,
      rect_bottom_y,
      center_x + 0.5 * box.dx * 0.5,
      rect_top_y
    )
  }
  pop();
}
