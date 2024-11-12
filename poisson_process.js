function randomExp(lambda) {
  let u = random(0, 1);
  return -log(1 - u) / lambda;
}

class PoissonProcess {
  // used to simulate the time of arrival of customers' orders
  constructor(lambda, dt) {
    this.lambda = lambda;
    this.dt = dt; //simulation interval
    this.history = {
      timestamp: [],
      inter_arrival_time: [],
      total_arrival_time: [],
      inter_value: [], // array of 0 and 1 (1 when we have a jump)
      value: [], // value of the poisson process at timestamp ( same as cumsum of inter_values)
    };

    this.current = {
      timestamp: 0,
      inter_arrival_time: 0,
      total_arrival_time: 0,
      inter_value: 0,
      prev_value: 0,
      value: 0,
    };
  }

  advance(dt = this.dt) {
    this.saveHistory();

    let tau = randomExp(this.lambda);
    this.current.timestamp += dt;
    this.current.inter_arrival_time = tau;
    this.current.total_arrival_time += tau;
    this.current.prev_value = this.current.value;
    this.updatePoissonValue();
    this.current.inter_value = this.current.value - this.current.prev_value;

    //console.log(this.current);
  }

  updatePoissonValue() {
    let count = 0;
    let t = this.current.timestamp;
    for (let tau of this.history.total_arrival_time) {
      if (tau>0) {
        let adding = (t > tau) ? 1 : 0;
        //console.log(adding)
        count += adding;
      }
      if (tau > t) break;
    }
    count += (t > this.current.total_arrival_time) ? 1 : 0;
    this.current.value = count;
  }

  saveHistory() {
    this.history.timestamp.push(this.current.timestamp);
    this.history.inter_arrival_time.push(this.current.inter_arrival_time);
    this.history.total_arrival_time.push(this.current.total_arrival_time);
    this.history.inter_value.push(this.current.inter_value);
    this.history.value.push(this.current.value);
  }

  logProcess() {
    console.log("-------------------------");
    console.log("timestamp:", this.current.timestamp);
    console.log("inter_arrival:", this.current.inter_arrival_time);
    console.log("total_arrival:", this.current.total_arrival_time);
    console.log("inter_value:", this.current.inter_value);
    console.log("value:", this.current.value);
  }
}

// Function to generate a random number following a Poisson distribution
function poissonRandom(lambda) {
  let L = Math.exp(-lambda); // threshold for Poisson process
  let p = 1.0;
  let k = 0;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}
