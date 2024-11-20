function importCocktails(ct) {
    for (let c of ct) {
      let temp = new Cocktail(c.id, c.name, c.bases, c.other);
      //temp.importBases()
      temp.importBases();
      GLOBAL_COCKTAILS.push(temp);
    }
}



function importCommodities(comm, s) {
  for(let i=0;i<comm.length;i++  ){
    let c = comm[i];
    GLOBAL_COMMODITIES.push(new Commodity(c.id, c.name, c.min_price, c.max_price, c.start_price, c.price_unit, c.cost))
    s.addCommodity(GLOBAL_COMMODITIES[i]);
    GLOBAL_COMMODITIES[i].price_process.setBox(0, i/comm.length*height * 0.8, 0.75*width, height * 0.8 /comm.length);
  }
}


function sampleElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}


function showMenu(x1,y1,x2,y2){
  push();
  rectMode(CORNER);
  fill(250,120,50);
  stroke(0)
  rect(x1,y1,x2,y2)
  let n_cocktails = GLOBAL_COCKTAILS.length;
  let tot_rows = 1.5*n_cocktails + 4;
  let dh = clamp((y2-y1)/tot_rows, 5, 20);

  textSize(dh);
  textAlign(LEFT)
  fill(0);
  noStroke();

  for(let i=0; i< n_cocktails; i++){
    text(GLOBAL_COCKTAILS[i].name +"\t\t"+ GLOBAL_COCKTAILS[i].getPrice().toFixed(2)
          +"\t\t"+ GLOBAL_COCKTAILS[i].getPrice(-15*60).toFixed(2),
        dh+x1, 2*dh+i*1.5*dh 
    )
  }

  pop();
}