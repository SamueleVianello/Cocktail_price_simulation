class Engine {
    constructor(time,dt){
        this.cocktail_list =[];
        this.commodity_list=[];
        this.event_list = [];

        this.start_time = time;
        this.current_time = time;
        this.candles_dt = 60; //seconds
        this.dt = dt;

        //this.volatility_multiplier = 1.0;

        this.order_history = [];

        // sim is used only to simulate customers in a DEV and TEST setting
        this.sim=null;
    }

    evolve(){
        // 0. Get the current time =============================


        // 1. Check price requests and answer ==================
        //getRequests();
        let requests = ['gintonic01', 'vodkalemon01'];
        let prices = this.handlePriceRequests(requests);
        //console.log("Current prices for requests:", prices);


        // 2. Handle events and modifiers ======================
        print(this.event_list)
        for(let e of this.event_list){
            if ( e.isHappening(this.current_time)){
                // print("Event is Happening")
                if( !e.applied) e.applyEvent()
            }
            else{
                if(e.applied) e.unapplyEvent()
            }
        }


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
        

        if (this.sim != null) orders = this.sim.evolve();
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

        // update time
        this.current_time += this.dt;
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
                let comm = this.getCommodityById(reqs[i]);
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

    createEvent(label,comm_list=[],t=0, t_end=0, multipler=1){
        if (t==0) t=this.current_time;

        // TODO: modify list to use id instead of object
        let temp_list = [];
        for (let i = 0; i < comm_list.length; i++) {
            temp_list.push( this.getCommodityById(comm_list[i]));
            
        }

        comm_list = temp_list;

        if(label == "crash"){
            this.event_list.push(
                new CrashEvent(t,
                    t+60*30,
                    0.3,
                    comm_list
                )
            )
        }

        if(label == "fomo"){
            this.event_list.push(
                new FomoEvent(t,
                    t+60*30,
                    0.3,
                    comm_list
                )
            )
        }

        if(label == "happy_vola"){
            this.event_list.push(
                new HappyVolatilityEvent(t,
                    t_end,
                    multipler,
                    comm_list
                )
            )
        }
    }

    sendOrders(orders){
        if (orders.length == 0) return;

        console.log(toHHMMSS(this.current_time))
        
        // cycle through all orders
        for (let i =0; i< orders.length; i++){
            let c = this.getCocktailById(orders[i].id);   
            if(c != null){
                let qty = orders[i].qty;
                for (let b of c.bases){
                    for (let k of this.commodity_list) {
                        if (k.id == b.id) {
                          k.addOrder(qty* b.quantity / k.price_unit);
                          //console.log(qty, b.quantity, k.price_unit, "-->", qty* b.quantity / k.price_unit);
                        }
                      }
                }
                console.log("---> order of "+qty+" for "+orders[i].id )
                this.order_history.push({
                    id: orders[i].id,
                    qty: qty,
                    time: this.current_time
                });
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

    getCommodityById(id){
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
    addSimulation(sim){
        this.sim = sim;
    }

    importCommodities(comm) {
        // comm is an array of json objects
        for(let i=0;i<comm.length;i++  ){
            let c = comm[i];
            this.commodity_list.push(new Commodity(c.id, 
                                                    c.name, 
                                                    c.min_price, 
                                                    c.max_price, 
                                                    c.start_price, 
                                                    c.price_unit, 
                                                    c.cost,
                                                    this.candles_dt))

            
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

    logOrderStatistics() {
        let orders = this.order_history;
        let orders_by_id = {};
        let total_orders = 0;
        let time_span = (this.current_time - this.start_time) / 3600; // Convert to hours
        
        // Count orders by ID
        for(let i = 0; i < orders.length; i++) {
            let id = orders[i].id;
            if(orders_by_id[id] == undefined) orders_by_id[id] = 0;
            orders_by_id[id] += orders[i].qty;
            total_orders += orders[i].qty;
        }
        
        // Find most and least popular
        let most_popular = {id: null, qty: -1};
        let least_popular = {id: null, qty: Infinity};
        
        for(let id in orders_by_id) {
            if(orders_by_id[id] > most_popular.qty) {
                most_popular = {id: id, qty: orders_by_id[id]};
            }
            if(orders_by_id[id] < least_popular.qty) {
                least_popular = {id: id, qty: orders_by_id[id]};
            }
        }
        
        // Calculate average orders per hour
        let avg_orders_per_hour = total_orders / time_span;
        
        // Log statistics
        console.log("=== Order Statistics ===");
        console.log("Total orders: "+ total_orders);
        console.log("Average orders per hour: " + avg_orders_per_hour.toFixed(2));
        console.log("Most popular: "+ most_popular.id + " with " + most_popular.qty + " orders");
        console.log("Least popular: "+ least_popular.id + " with " + least_popular.qty + " orders");
        
        return orders_by_id;
    }


}