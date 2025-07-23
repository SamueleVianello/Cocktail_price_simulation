# Cocktail_price_simulation

Building a simulation framework where we test how a _dynamic price_ for a beverage in a bar can be implemented. 

I'm modelling the customer's thirst for drinks with a **Poisson process** $N_t (\lambda)$ with $\lambda$ indicating the drinks-per-hour.

Lots still TODO but looks interesting...


## Class Interdependence Diagram

```mermaid
classDiagram
    class Register {
        -engine
        -entries : RegisterEntry[]
        -cocktailsTab
        -eventsTab
        -crashButton
        -fomoButton
        -volatilityButton
        -ipoButton
    }
    class RegisterEntry {
        -order_amount
        -id
        -container
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
    }
    class PoissonProcess {
        -lambda
        -dt
    }

    Register --> RegisterEntry : contains
    Register --> Cocktail : uses via engine.cocktail_list
    Register --> Commodity : uses via engine.commodity_list
    Cocktail --> Commodity : bases[] contains Commodity 
    Commodity --> PriceProcess : has
    PriceProcess --> PoissonProcess : (not direct, but both are process classes)
``` 
