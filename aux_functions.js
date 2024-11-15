function importCocktails(ct) {
    for (let c of ct) {
      let temp = new Cocktail(c.id, c.name, c.bases, c.other);
      //temp.importBases()
      GLOBAL_COCKTAILS.push(temp);
    }
}



function importCommodities(comm, s) {
  for(let i=0;i<comm.length;i++  ){
    let c = comm[i];
    GLOBAL_COMMODITIES.push(new Commodity(c.id, c.name, c.min_price, c.max_price, c.start_price, c.cost))
    s.addCommodity(GLOBAL_COMMODITIES[i]);
    GLOBAL_COMMODITIES[i].price_process.setBox(0, i/comm.length*height * 0.8, width, height * 0.8 /comm.length);
  }
}


function sampleElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}