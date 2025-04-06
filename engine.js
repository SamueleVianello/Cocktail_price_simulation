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
        console.log(prices);


        // 2. Handle events and modifiers ======================


        // 4. Receive orders and update prices =================
        let orders = [{
                id: 'vodkalemon01',
                qty: 2 //how many orders of that cocktail
            }, 
            {
                id: 'quattrobianchi',
                qty: 3 //how many orders of that cocktail
            },
        ]
        this.sendOrders(orders)

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
    logCommodityList(){
        for(let i=0; i<this.commodity_list.length; i++){
            //console.log(this.commodity_list[i].id, this.commodity_list[i].name)
            this.commodity_list[i].logDetails();
        }
    }

    importCocktails(cocktails) {
        // cocktails is an array of json objects
        for(let i=0;i<cocktails.length;i++  ){
            let c = cocktails[i];
            this.cocktail_list.push(new Cocktail(c.id, c.name, c.bases, c.other));
            this.cocktail_list[i].importBases();
        }
        
    }
    logCocktails(){
        for(let i=0; i<this.cocktail_list.length; i++){
            //console.log(this.commodity_list[i].id, this.commodity_list[i].name)
            this.cocktail_list[i].logDetails();
        }
    }
}