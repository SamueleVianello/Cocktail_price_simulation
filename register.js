class Register {
    constructor(x1, y1, w, h, engine) {
      this.x = x1;
      this.y = y1;
      this.w = w;
      this.h = h;
      this.entries = [];
      this.entryHeight = 40;
      this.spacing = 10;
      this.engine = engine;  // Store the engine reference
      
      // Main container
      this.container = createDiv('');
      this.container.position(x1, y1);
      this.container.size(w, h);
      this.container.id('register-container');
      
      // Create tabs container
      this.tabsContainer = createDiv('');
      this.tabsContainer.parent(this.container);
      this.tabsContainer.class('tabs-container');
      
      // Create Cocktails tab
      this.cocktailsTab = createDiv('Cocktails');
      this.cocktailsTab.parent(this.tabsContainer);
      this.cocktailsTab.class('tab active');
      this.cocktailsTab.mousePressed(() => this.showTab('cocktails'));
      
      // Create Events tab
      this.eventsTab = createDiv('Events');
      this.eventsTab.parent(this.tabsContainer);
      this.eventsTab.class('tab');
      this.eventsTab.mousePressed(() => this.showTab('events'));
      
      // Entries container
      this.entriesContainer = createDiv('');
      this.entriesContainer.parent(this.container);
      this.entriesContainer.class('entries-container');

      // Create event buttons
      this.crashButton = createButton('Crash');
      this.fomoButton = createButton('FOMO');
      //this.volatilityButton = createButton('Volatility Hour');
      //this.ipoButton = createButton('IPO');

      // Parent the buttons to the entries container
      this.crashButton.parent(this.entriesContainer);
      this.fomoButton.parent(this.entriesContainer);
      //this.volatilityButton.parent(this.entriesContainer);
      //this.ipoButton.parent(this.entriesContainer);

      // Add click handlers for each button
      this.crashButton.mousePressed(() => this.activateEvent('crash'));
      this.fomoButton.mousePressed(() => this.activateEvent('fomo'));
      //this.volatilityButton.mousePressed(() => this.activateEvent('happy_vola'));
      //this.ipoButton.mousePressed(() => this.activateEvent('ipo'));
      
      // Buttons container
      this.buttonsContainer = createDiv('');
      this.buttonsContainer.parent(this.container);
      this.buttonsContainer.class('buttons-container');
      
      this.applyStyles();
    }
  
    applyStyles() {
      this.container.style('background-color', '#ffffff');
      this.container.style('padding', '10px');
      this.container.style('border-radius', '4px');
      this.container.style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)');
      this.container.style('display', 'flex');
      this.container.style('flex-direction', 'column');
      
      // Style tabs container
      this.tabsContainer.style('display', 'flex');
      this.tabsContainer.style('margin-bottom', '10px');
      this.tabsContainer.style('border-bottom', '1px solid #eee');
      
      // Style tab
      const tabStyle = `
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 4px 4px 0 0;
        margin-right: 5px;
        background-color: #f0f0f0;
        transition: background-color 0.2s;
      `;
      
      // Apply base style to both tabs
      this.cocktailsTab.style(tabStyle);
      this.eventsTab.style(tabStyle);
      
      // Set initial active state
      this.cocktailsTab.style('background-color', '#4CAF50');
      this.cocktailsTab.style('color', 'white');
      this.eventsTab.style('background-color', '#f0f0f0');
      this.eventsTab.style('color', '#333');
      
      this.entriesContainer.style('flex-grow', '1');
      this.entriesContainer.style('overflow-y', 'auto');
      this.entriesContainer.style('margin-bottom', '10px');
      
      // Style event buttons
      const eventButtonStyle = `
        padding: 10px 20px;
        margin: 5px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        background-color: #2196F3;
        color: white;
        transition: background-color 0.2s;
      `;
      
      this.crashButton.style(eventButtonStyle);
      this.fomoButton.style(eventButtonStyle);
      //this.volatilityButton.style(eventButtonStyle);
      //this.ipoButton.style(eventButtonStyle);
      
      this.buttonsContainer.style('display', 'flex');
      this.buttonsContainer.style('gap', '10px');
      this.buttonsContainer.style('padding', '10px 0');
      this.buttonsContainer.style('border-top', '1px solid #eee');
    }
  
    showTab(tabName) {
      // Reset all tabs to inactive state
      this.cocktailsTab.style('background-color', '#f0f0f0');
      this.cocktailsTab.style('color', '#333');
      this.eventsTab.style('background-color', '#f0f0f0');
      this.eventsTab.style('color', '#333');
      
      // Hide all entries and buttons first
      this.entries.forEach(entry => {
        entry.container.style('display', 'none');
      });
      this.crashButton.style('display', 'none');
      this.fomoButton.style('display', 'none');
      //this.volatilityButton.style('display', 'none');
      //this.ipoButton.style('display', 'none');
      
      // Set active tab and show appropriate content
      if (tabName === 'cocktails') {
        this.cocktailsTab.style('background-color', '#4CAF50');
        this.cocktailsTab.style('color', 'white');
        // Show cocktail entries
        this.entries.forEach(entry => {
          entry.container.style('display', 'flex');
        });
      } else if (tabName === 'events') {
        this.eventsTab.style('background-color', '#4CAF50');
        this.eventsTab.style('color', 'white');
        // Show event buttons
        this.crashButton.style('display', 'block');
        this.fomoButton.style('display', 'block');
        //this.volatilityButton.style('display', 'block');
        //this.ipoButton.style('display', 'block');
      }
    }
  
    create() {
      // Create entries for each cocktail in the engine
      let n = this.engine.cocktail_list.length;
      
      for (let i = 0; i < n; i++) {
        let entry = new RegisterEntry(
          this.engine.cocktail_list[i].name,
          this.engine.cocktail_list[i].id,
          this.w - this.spacing * 2,
          this.entryHeight,
          this.entriesContainer
        );
        this.entries.push(entry);
      }
      
      // Style for buttons
      const buttonStyle = `
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        transition: background-color 0.2s;
      `;
      
      // Create reset button
      this.reset_button = createButton('Reset');
      this.reset_button.parent(this.buttonsContainer);
      this.reset_button.style(buttonStyle);
      this.reset_button.style('background-color', '#ff4444');
      this.reset_button.style('color', 'white');
      this.reset_button.mousePressed(() => this.resetAll());
      
      // Create send order button
      this.send_button = createButton('Send Order');
      this.send_button.parent(this.buttonsContainer);
      this.send_button.style(buttonStyle);
      this.send_button.style('background-color', '#4CAF50');
      this.send_button.style('color', 'white');
      this.send_button.mousePressed(() => this.sendOrder());
    }
  
    resetAll() {
      this.entries.forEach(entry => {
        entry.order_amount = 0;
        entry.updateInputValue();
      });
    }
  
    sendOrder() {
      let order = {
        timestamp: new Date().toISOString(),
        items: this.getOrder()
      };
      console.log('Order placed:', order);
      this.parseOrder(order);
      this.resetAll();
    }

    getOrder() {
        return this.entries
          .map((entry, index) => ({
            name: this.engine.cocktail_list[index].name,
            id: this.engine.cocktail_list[index].id,
            quantity: entry.getAmount(),
            unit_price: this.engine.cocktail_list[index].getPrice(),
            total_price: entry.getAmount() * this.engine.cocktail_list[index].getPrice(),
          }))
          .filter(item => item.quantity > 0);
    }
  
    /* //Add export to json or csv
    getOrderSummary() {
      return this.entries
        .map((entry, index) => ({
          name: GLOBAL_COCKTAILS[index].name,
          id: GLOBAL_COCKTAILS[index].id,
          quantity: entry.getAmount()
        }))
        .filter(item => item.quantity > 0);
    }
        */


    parseOrder(ord){
        let n_ord = ord.items.length;
        for( let i=0; i<n_ord; i++){
            let single_ord;
            let qty_ord = ord.items[i].quantity;

            // find associated cocktail
            for (let ckt of this.engine.cocktail_list){
                if(ckt.id == ord.items[i].id){
                    single_ord = ckt;
                }
            }

            // add relevant amount order to each of the bases of the cocktail
            for(let b of single_ord.bases){
                for (let c of this.engine.commodity_list) {
                  if (c.id == b.id) {
                    c.addOrder(qty_ord * b.quantity / c.price_unit);
                  }
                }
            }
        }
    }

    printOrder(ord){


    }
  }


class RegisterEntry {
    constructor(label, id, w, h, parentElement) {
      this.order_amount = 0;
      this.id = id;
  
      // Create container div and add it to the parent
      this.container = createDiv('');
      this.container.parent(parentElement);
      this.container.size(w, h);
      this.container.style('display', 'flex');
      this.container.style('align-items', 'center');
  
      // Create label
      this.label = createP(label);
      this.label.parent(this.container);
      this.label.style('margin', '0');
      this.label.style('width', w * 0.5 + 'px');
      
      // Create remove button
      this.remove_button = createButton('-');
      this.remove_button.parent(this.container);
      this.remove_button.size(w * 0.1, h);
      this.remove_button.mousePressed(() => this.removeOrder());
      
      // Create input field
      this.order_input = createInput(this.order_amount.toString());
      this.order_input.parent(this.container);
      this.order_input.size(w * 0.15, h);
      this.order_input.style('text-align', 'center');
      this.order_input.input(() => this.handleManualInput());
      
      // Create add button
      this.add_button = createButton('+');
      this.add_button.parent(this.container);
      this.add_button.size(w * 0.1, h);
      this.add_button.mousePressed(() => this.addOrder());
  
      this.applyStyles();
    }
  
    applyStyles() {
      // Style the buttons
      const buttonStyle = `
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        margin: 0 2px;
      `;
      this.remove_button.style(buttonStyle);
      this.add_button.style(buttonStyle);
      
      // Style the input
      this.order_input.style('border', '1px solid #ccc');
      this.order_input.style('border-radius', '4px');
      this.order_input.style('margin', '0 2px');
      
      // Container styling
      this.container.style('background-color', '#f8f8f8');
      this.container.style('border-radius', '4px');
      this.container.style('padding', '5px');
      this.container.style('margin-bottom', '5px');
    }
  
    addOrder() {
      this.order_amount += 1;
      this.updateInputValue();
    }
  
    removeOrder() {
      this.order_amount = max(0, this.order_amount - 1);
      this.updateInputValue();
    }
  
    handleManualInput() {
      const value = parseInt(this.order_input.value());
      if (!isNaN(value)) {
        this.order_amount = max(0, value);
      }
      this.updateInputValue();
    }
  
    updateInputValue() {
      this.order_input.value(this.order_amount.toString());
    }
  
    getAmount() {
      return this.order_amount;
    }
}

