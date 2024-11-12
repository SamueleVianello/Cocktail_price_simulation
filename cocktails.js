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
      for (let sp of GLOBAL_SPIRITS) {
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

function importCocktails(ct) {
  for (let c of ct) {
    let temp = new Cocktail(c.id, c.name, c.bases, c.other);
    //temp.importBases()
    GLOBAL_COCKTAILS.push(temp);
  }
}

// ##########################
let cocktails = [
  {
    // GIN TONIC
    id: "gintonic01",
    name: "Gin Mare con Tonica",
    bases: [
      {
        id: "gin",
        quantity: 5, //cl
      },
    ],
    other: [
      {
        name: "tonica",
        price: 4,
        quantity: 10, //cl
      },
    ],
  },
  {
    // VODKA LEMON
    id: "vodkalemon01",
    name: "Vodka con Limonata",
    bases: [
      {
        id: "vodka",
        quantity: 5, // cl
      },
    ],
    other: [
      {
        name: "limonata",
        price: 4,
        quantity: 10, //cl
      },
    ],
  },
  {
    // BEER
    id: "beer01",
    name: "Birra",
    bases: [
      {
        id: "birra",
        quantity: 1,
      },
    ],
    other: [],
  },
];
