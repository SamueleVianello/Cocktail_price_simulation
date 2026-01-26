const my_red = "#dd0000";
const my_green = "#00bb00";

// Configuration parameters (in milliseconds)
const SAVE_INTERVAL = 0.5* 60 * 1000;  // 5 minutes
const MAX_SNAPSHOT_AGE = 12 * 60 * 60 * 1000;  // 12 hours

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
    let new_price = clamp(this.current_price.close * (1+f), this.min_price, this.max_price);
    //console.log(`- Final price after clamping: ${new_price}`);
    
    this.current_price.close = new_price;
    if (new_price > this.current_price.maximum)
      this.current_price.maximum = new_price;
    if (new_price < this.current_price.minimum)
      this.current_price.minimum = new_price;
    this.current_price
  }

  updatePrice(order_vol = 0, multiplier =1, dt = this.dt) {
    // PRICE IS UPDATED at the END of each -dt- interval

    // ************************************************
    // PRICE UPDATE FORMULA

    let new_price;
    let increase_factor = Math.pow(
      1 + this.increase_perc * multiplier,
      order_vol
    );

    let decrease_factor = Math.pow(1 + this.decrease_perc * multiplier, dt / 60);

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

    // ************************ managing snapshots ************************
    // Save snapshot to localStorage
  saveSnapshot() {
    // Find which snapshot is older (or doesn't exist)
    let targetPointer = 0;
    
    const timestamp0 = localStorage.getItem(`price_history_${this.asset_id}_snapshot_0_timestamp`);
    const timestamp1 = localStorage.getItem(`price_history_${this.asset_id}_snapshot_1_timestamp`);
    
    if (timestamp0 && timestamp1) {
      // Both exist, overwrite the older one
      targetPointer = timestamp0 < timestamp1 ? 0 : 1;
    } else if (timestamp1) {
      // Only 1 exists, use 0
      targetPointer = 0;
    } else {
      // Neither or only 0 exists, use 1
      targetPointer = timestamp0 ? 1 : 0;
    }
    
    // Save to target slot
    const timestamp = generateTimestamp();
    localStorage.setItem(`price_history_${this.asset_id}_snapshot_${targetPointer}`, JSON.stringify(this.history));
    localStorage.setItem(`price_history_${this.asset_id}_snapshot_${targetPointer}_timestamp`, timestamp);
    
    console.log(`Snapshot ${targetPointer} saved at ${timestamp}`);
  }

  // Load most recent valid snapshot (< 12 hours old)
  loadSnapshot(maxAge = MAX_SNAPSHOT_AGE) {
    const now = new Date();
    let validSnapshots = [];
    
    // Check both snapshots
    for (let i = 0; i < 2; i++) {
      const dataKey = `price_history_${this.asset_id}_snapshot_${i}`;
      const timestampKey = `price_history_${this.asset_id}_snapshot_${i}_timestamp`;
      
      const data = localStorage.getItem(dataKey);
      const timestampStr = localStorage.getItem(timestampKey);
      
      if (data && timestampStr) {
        const snapshotTime = parseTimestamp(timestampStr);
        const age = now - snapshotTime;
        
        if (age < maxAge) {
          validSnapshots.push({
            index: i,
            data: data,
            timestamp: timestampStr,
            age: age
          });
          console.log(`Snapshot ${i} found: ${timestampStr} (age: ${Math.round(age / 1000 / 60)} minutes)`);
        } else {
          console.log(`Snapshot ${i} too old: ${timestampStr} (age: ${Math.round(age / 1000 / 60)} minutes)`);
        }
      }
    }
    
    // Load the most recent valid snapshot
    if (validSnapshots.length > 0) {
      // Sort by age (smallest = most recent)
      validSnapshots.sort((a, b) => a.age - b.age);
      const mostRecent = validSnapshots[0];
      
      this.history = JSON.parse(mostRecent.data);
      
      // Restore current_price from last values in history
      if (this.history.close.length > 0) {
        const lastIndex = this.history.close.length - 1;
        this.current_price = {
          timestamp: this.history.timestamp[lastIndex],
          open: this.history.close[lastIndex],
          close: this.history.close[lastIndex],
          maximum: this.history.close[lastIndex],
          minimum: this.history.close[lastIndex],
          vol: 0
        };
        console.log(`Current price restored: ${this.current_price.close}`);
      }
      
      console.log(`Success! Loaded snapshot ${mostRecent.index} from ${mostRecent.timestamp}`);
      return true;
    } else {
      console.log('No valid snapshots found. Starting fresh.');
      return false;
    }
  }

  startAutoSave(interval = SAVE_INTERVAL) {
    // Save immediately on start
    this.saveSnapshot();
    
    // Then save every interval
    setInterval(() => {
      this.saveSnapshot();
    }, interval);
    
    console.log(`Auto-save started: every ${interval / 1000 / 60} minutes`);
  }
}


////////////////////////////////////////////////////////////

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





//// ####################################################




// Helper function to generate timestamp string "yyyymmdd_hhmmss"
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

// Helper function to parse timestamp string back to Date object
function parseTimestamp(timestampStr) {
  const year = parseInt(timestampStr.substr(0, 4));
  const month = parseInt(timestampStr.substr(4, 2)) - 1;
  const day = parseInt(timestampStr.substr(6, 2));
  const hours = parseInt(timestampStr.substr(9, 2));
  const minutes = parseInt(timestampStr.substr(11, 2));
  const seconds = parseInt(timestampStr.substr(13, 2));
  
  return new Date(year, month, day, hours, minutes, seconds);
}
