function importCocktails(ct) {
    for (let c of ct) {
      let temp = new Cocktail(c.id, c.name, c.bases, c.other);
      temp.importBases(GLOBAL_COMMODITIES);
      GLOBAL_COCKTAILS.push(temp);
    }
}



function importCommodities(comm, s) {
  for(let i=0;i<comm.length;i++  ){
    let c = comm[i];
    GLOBAL_COMMODITIES.push(new Commodity(c.id, c.name, c.min_price, c.max_price, c.start_price, c.price_unit, c.cost))
    s.addCommodity(GLOBAL_COMMODITIES[i]);

    //GLOBAL_COMMODITIES[i].price_process.setBox(20, i/comm.length*height * 0.8, 0.75*width, height * 0.8 /comm.length);

    let n_vert = (floor(comm.length/2+0.8));
    let w = width*0.55*0.5;
    let h = height*0.8 / n_vert;
    let x1 = (i<comm.length/2)? 0.2*width: w + 0.2*width;
    let y1 = h*((i)%n_vert);
    GLOBAL_COMMODITIES[i].price_process.setBox(x1,y1,w,h);

  }
}


function sampleElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}


function showMenu(x1,y1,x2,y2){
  push();
  rectMode(CORNERS);
  //fill(250,120,50);
  stroke(0)
  rect(x1,y1,x2,y2)
  let n_cocktails = GLOBAL_COCKTAILS.length;
  let tot_rows = 1.5*n_cocktails + 4;
  let dh = clamp((y2-y1)/tot_rows, 5, 20);

  textSize(dh);
  textAlign(LEFT)
  fill(0);
  noStroke();


  textAlign(LEFT);
  text('COCKTAIL', dh+x1, 2*dh )
  textAlign(CENTER);
  text('         CURRENT', 0.5*(x1+x2), 2*dh)
  textAlign(RIGHT);
  text('PAST', x2-dh,2*dh)

  for(let i=0; i< n_cocktails; i++){
    let curr_price = GLOBAL_COCKTAILS[i].getPrice().toFixed(2);
    let past_price = GLOBAL_COCKTAILS[i].getPrice(-15*60).toFixed(2);
    let arrow = curr_price>past_price ? "⇧" : "⇩";
    let perc = ((curr_price/past_price -1)*100).toFixed(2);

    perc = (past_price ==0)? "-": perc+'%';

    fill(0)
    textAlign(LEFT);
    text(GLOBAL_COCKTAILS[i].name, dh+x1, 4*dh+i*1.5*dh ) //name
    textAlign(CENTER);
    text('         '+curr_price, 0.5*(x1+x2), 4*dh+i*1.5*dh) //current price

    fill(curr_price<past_price ? '#0011bb':my_red);
    textAlign(RIGHT);
    text(arrow+perc, x2-dh,4*dh+i*1.5*dh) // past price
  }

  pop();
}