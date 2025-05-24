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

  importBases(base_list) {
    // look into all spirits and push them into this.base
    for (let i = 0; i < this.bases.length; i++) {
      for (let sp of base_list) {
        if (this.bases[i].id == sp.id) {
          this.bases[i].commodity = sp;
        }
      }
    }
    
  }

  addOrder(qty){
    for (let b of this.bases){
      b.commodity.addOrder(b.quantity * qty);
    }
  }

  getPrice(dt = 0) {
    // dt is time in SECONDS
    if (dt <= 0) {
        // compute total price of other ingredients
      let other_price = this.other.reduce(
        (partialSum, a) => partialSum + a.price,
        0
      );

      
      // compute total price of alcohol base ingredients
      let base_price = this.bases.reduce(
        (partialSum, b) => partialSum + b.commodity.getPrice(dt) * b.quantity/b.commodity.price_unit,
        0
      );
      
      //console.log("base price:",base_price)
      //console.log("other price:",other_price)
      if (base_price<0) {return 0}

      return base_price+other_price;
    }
    else{
      console.log("ERROR: can't predict future price!");
    }
  }

  logDetails(){
    console.log('-------- COCKTAIL LOG -----------')
    console.log("Cocktail: ", this.id, this.name);
    console.log("Bases: ", this.bases);
    console.log("Other ingredients: ", this.other);
    console.log('---------------------------------')
  }


}


