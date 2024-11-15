class Cocktail {
  constructor(id, name, bases, other) {
    this.id = id;
    this.name = name;
    //this.base_id = base_id; // base can be an array of commodity (spirits)
    this.bases = bases;
    this.other = other;
    //this.fixed_costs;
    this.importBases();
  }

  importBases() {
    // look into all spirits and push them into this.base
    for (let i = 0; i < this.bases.length; i++) {
      for (let sp of GLOBAL_COMMODITIES) {
        if (this.bases[i].id == sp.id) {
          this.bases[i].commodity = sp;
        }
      }
    }
  }

  getPrice() {
    // sum of the other ingredients price
    let tot_price = this.other.reduce(
      (partialSum, a) => partialSum + a.price,
      0
    );

    /*
    // add bases price --> MULTIPLY BY QUANTITY
    tot_price += this.base.reduce(
      (partialSum, b) => partialSum + b.getPrice(),
      0
    );
    */

    return tot_price;
  }
}


