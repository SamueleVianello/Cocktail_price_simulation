let events = [
    {
        type: "price",
        id : "dazipatate",
        name: "Dazi sulle patate",
        news: "Trump annuncia dazi sull'import di patate. Il prezzo della vodka sale del 30%",
        start: "21:28",
        end: "21:38", //for "price" events, end shows when to remove the gif 
        value:  0.3,
        commodities: ["vodka"],
        gif: "gifs/potatoes.gif"
    },
    {
        type: "volatility",
        id : "volatilityhappyhour",
        name: "Volatility Happy Hour",
        start: "21:40",
        end: "22:40",
        value:  5,
        commodities: ["birrachiara","birraipa", "birrascura"],
        gif:"gifs/bit_vola.gif"
    },
]