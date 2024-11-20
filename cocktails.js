class Cocktail {
  constructor(id, name, bases, other) {
    this.id = id;
    this.name = name;
    //this.base_id = base_id; // base can be an array of commodity (spirits)
    this.bases = bases;
    this.other = other;
    //this.fixed_costs;
    //this.importBases();
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

  getPrice(dt = 0) {
    if (dt <= 0) {
        // compute total price of other ingredients
      let other_price = this.other.reduce(
        (partialSum, a) => partialSum + a.price,
        0
      );

      
      // compute total price of alcohol base ingredients
      let base_price = this.bases.reduce(
        (partialSum, b) => partialSum +b.quantity * b.commodity.getPrice(dt)/b.commodity.price_unit,
        0
      );
      
      //console.log("base price:",base_price)
      //console.log("other price:",other_price)

      return base_price+other_price;
    }
    else{
      console.log("ERROR: can't predict future price!");
    }
  }
}


