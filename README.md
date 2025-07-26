# Cocktail_price_simulation

Building a simulation framework where we test how a _dynamic price_ for a beverage in a bar can be implemented. 

I'm modelling the customer's thirst for drinks with a **Poisson process** $N_t (\lambda)$ with $\lambda$ indicating the drinks-per-hour.

Lots still TODO but looks interesting...


## Class Interdependence Diagram

```mermaid
classDiagram
    class Engine {
        cocktail_list : Cocktail[]
        commodity_list : Commodity[]
        event_list : Event[]
    }
    class Cocktail {
        -id
        -name
        -bases
        -other
    }
    class Commodity {
        -id
        -name
        -price_process : PriceProcess
    }
    class PriceProcess {
        -asset_id
        -asset_name
        -drawFullGraph()
    }
    class Register {
        -engine_reference : Engine
        -entries : RegisterEntry[]
        -cocktailsTab
    }
    class RegisterEntry {
        -order_amount
        -id
    }
    
    Cocktail --> Commodity : bases[] contains
    Commodity --> PriceProcess : its price is modelled by
    Register --> RegisterEntry : contains
    Register --> Cocktail : uses via engine.cocktail_list
    
``` 
