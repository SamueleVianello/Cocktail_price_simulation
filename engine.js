class Engine {
    constructor(time){
        this.cocktail_list =[];
        this.commodity_list=[];
        this.customer_list =[];

        this.start_time = time;
        this.current_time = time;

        this.volatility_multiplier = 1.0;
    }

    evolve(){
        // 0. Get the current time =============================


        // 1. Check price requests and answer ==================
        //getRequests();
        let requests = ['gintonic01', 'vodkalemon01'];
        let prices = this.handlePriceRequests(requests);
        console.log("Current prices for requests:", prices);


        // 2. Handle events and modifiers ======================


        // 4. Receive orders and update prices =================
        let orders = [{
                id: 'vodkalemon01',
                qty: (random(0,1) < 0.1)? 1 : 0 //how many orders of that cocktail
            }, 
            {
                id: 'quattrobianchi',
                qty: (random(0,1) < 0.1)? 1 : 0 //how many orders of that cocktail
            },
        ]
        console.log("Processing orders:", orders);
        this.sendOrders(orders);
        
        // Log commodity states before price update
        // console.log("Commodity states before price update:");
        // for (let k of this.commodity_list) {
        //     console.log(`${k.id}: current_order.vol=${k.current_order.vol}, current_price=${k.current_order.price}`);
        // }
        
        this.updatePrices();
        this.drawGraphs();
        
        // Log commodity states after price update
        // console.log("Commodity states after price update:");
        // for (let k of this.commodity_list) {
        //     console.log(`${k.id}: current_order.vol=${k.current_order.vol}, current_price=${k.current_order.price}`);
        // }

        // update time and show it onscreen
        this.current_time += 1;
        // show clock
        this.showClock(width * 0.5, 0.88 * height);
    }

    handlePriceRequests(reqs){
        let prices = [];
        for (let i =0; i< reqs.length; i++){
            let c = this.getCocktailById(reqs[i]);           
            if(c != null){
                let price = c.getPrice();
                prices.push(price);
            }
            else{ //if not found among cocktails search among commodities **TBC**
                let comm = this.getCommoditylById(reqs[i]);
                if(comm != null){
                    let price = comm.getPrice();
                    prices.push(price);
                }
                else{
                    console.log("Commodity not found");
                }
            }
        }
        return prices;
    }

    sendOrders(orders){
        // TODO .......................

        // cycle through all orders
        for (let i =0; i< orders.length; i++){
            let c = this.getCocktailById(orders[i].id);   
            if(c != null){
                let qty = orders[i].qty;
                for (let b of c.bases){
                    for (let k of this.commodity_list) {
                        if (k.id == b.id) {
                          k.addOrder(qty* b.quantity / k.price_unit);
                        }
                      }
                }
                console.log("order of "+qty+" for "+orders[i].id )
            }
        }
    }

    updatePrices(){
        for (let k of this.commodity_list) {
            //console.log(""+k.id+" "+k.current_order.vol)
            k.updatePrice();
            k.saveHistory(this.current_time);
            // Save price history at regular intervals
            if (this.current_time % k.dt === 0) {
                k.price_process.savePrice(this.current_time);
            }
        }
    }

    getCocktailById(id){
        for(let i=0; i<this.cocktail_list.length; i++){
            if(this.cocktail_list[i].id == id){
                return this.cocktail_list[i];
            }
        }
        return null;
    }

    getCommoditylById(id){
        for(let i=0; i<this.commodity_list.length; i++){
            if(this.commodity_list[i].id == id){
                return this.commodity_list[i];
            }
        }
        return null;
    }

    showClock(x,y){
        let time_str = toHHMMSS(this.current_time);
        push();
        textSize(height * 0.08);
        text(time_str, x,y);
        pop();
    }

    drawGraphs(){
        for(let k of this.commodity_list){
            k.price_process.drawFullGraph();
        }
    }

    showMenu(x1,y1,x2,y2){
        push();
        rectMode(CORNERS);
        //fill(250,120,50);
        stroke(0)
        rect(x1,y1,x2,y2)
        let n_cocktails = this.cocktail_list.length;
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
          let curr_price = this.cocktail_list[i].getPrice().toFixed(2);
          let past_price = this.cocktail_list[i].getPrice(-15*60).toFixed(2);
          let arrow = curr_price>past_price ? "⇧" : "⇩";
          let perc = ((curr_price/past_price -1)*100).toFixed(2);
      
          perc = (past_price ==0)? "-": perc+'%';
      
          fill(0)
          textAlign(LEFT);
          text(this.cocktail_list[i].name, dh+x1, 4*dh+i*1.5*dh ) //name
          textAlign(CENTER);
          text('         '+curr_price, 0.5*(x1+x2), 4*dh+i*1.5*dh) //current price
      
          fill(curr_price<past_price ? '#0011bb':my_red);
          textAlign(RIGHT);
          text(arrow+perc, x2-dh,4*dh+i*1.5*dh) // past price
        }
      
        pop();
    }

    //=================== IMPORT FUNCTIONS ==================================
    importCommodities(comm) {
        // comm is an array of json objects
        for(let i=0;i<comm.length;i++  ){
            let c = comm[i];
            this.commodity_list.push(new Commodity(c.id, c.name, c.min_price, c.max_price, c.start_price, c.price_unit, c.cost))

            
            let n_vert = (floor(comm.length/2+0.8));
            let w = width*0.55*0.5;
            let h = height*0.8 / n_vert;
            let x1 = (i<comm.length/2)? 0.2*width: w + 0.2*width;
            let y1 = h*((i)%n_vert);
            this.commodity_list[i].price_process.setBox(x1,y1,w,h);
            
        }
    }

    importCocktails(cocktails) {
        // cocktails is an array of json objects
        for(let i=0;i<cocktails.length;i++  ){
            let c = cocktails[i];
            this.cocktail_list.push(new Cocktail(c.id, c.name, c.bases, c.other));
            this.cocktail_list[i].importBases(this.commodity_list);
            //this.cocktail_list[i].logDetails();
        }
        
    }

    //=================== LOG FUNCTIONS =================================
    logCommodityList(){
        for(let i=0; i<this.commodity_list.length; i++){
            //console.log(this.commodity_list[i].id, this.commodity_list[i].name)
            this.commodity_list[i].logDetails();
        }
    }

    logCocktails(){
        for(let i=0; i<this.cocktail_list.length; i++){
            //console.log(this.commodity_list[i].id, this.commodity_list[i].name)
            this.cocktail_list[i].logDetails();
        }
    }


}