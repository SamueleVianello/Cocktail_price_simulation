class Customer {
  constructor(dph, drink_id, dt) {
    this.active = true;
    this.drink_id = drink_id;
    this.dph = dph; // drinks per hour
    this.total_drinks = 0;
    this.dt = dt; // dt is in seconds
    this.add_drink = 0;

    for (let i = 0; i < GLOBAL_COCKTAILS.length; i++) {
      //console.log(drink_id, i, GLOBAL_COCKTAILS[i].id);
      console.log(i);
      if (this.drink_id == GLOBAL_COCKTAILS[i].id) {
        this.cocktail = GLOBAL_COCKTAILS[i];
      }
    }

    this.poisson = new PoissonProcess(dph, dt / 3600);
  }

  checkOrders() {
    this.poisson.advance();
    // TODO: if this.poisson.current.inter_value =1 ---> add order to associated drink
    this.add_drink = this.poisson.current.inter_value;
    this.total_drinks = this.poisson.current.value;

    /*
    if (this.add_drink) {
      for (let a of GLOBAL_SPIRITS) {
        for (let b of this.cocktail.bases) {
          if (a.id == b.id) {
            a.addOrder(this.add_drink);
          }
        }
      }
    }
    */
  }

  importCocktail() {
    for (let i = 0; i < GLOBAL_COCKTAILS.length; i++) {
      if (this.drink_id == GLOBAL_COCKTAILS[i].id) {
        this.cocktail = GLOBAL_COCKTAILS[i];
      }
    }
  }
}
