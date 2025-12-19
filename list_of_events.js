let events = [
    {
        type: "volatility",
        id : "volatilityhappyhour",
        name: "Volatility Happy Hour",
        start: "00:40",
        end: "22:40",
        value:  5,
        commodities: ['gin','vodka','rumbianco','tequila','birrachiara','birraipa','birrascura','rumscuro'],
        gif:"gifs/old_man_dance.gif"
    },
    {
        type: "price",
        id : "crash",
        name: "Crash di Mercato",
        news: "Giorno nero per le borse mondiali. Peggiori risultati dal 2007.",
        start: "00:40:20",
        end: "00:41:30", //for "price" events, end shows when to remove the gif 
        value:  -0.2,
        commodities: ['gin','vodka','rumbianco','tequila','birrachiara','birraipa','birrascura','rumscuro'],
        gif: "gifs/the_office_no.gif"
    },
    {
        type: "price",
        id : "dazipatate",
        name: "Dazi sulle patate",
        news: "Trump annuncia dazi sull'import di patate. Il prezzo della vodka sale del 30%",
        start: "01:00:20",
        end: "01:59:20", //for "price" events, end shows when to remove the gif 
        value:  0.3,
        commodities: ["vodka"],
        gif: "gifs/trump_dance.gif"
    },
    {
        type: "price",
        id : "dazicereali",
        name: "Dazi sui cereali",
        news: "L'UE annuncia dazi sull'import di cereali. Il prezzo del gin sale del 20%",
        start: "21:48",
        end: "21:58", //for "price" events, end shows when to remove the gif 
        value:  0.2,
        commodities: ["gin"],
        gif: "gifs/draghi_lo_escludo.gif"
    },
    {
        type: "price",
        id : "narcotraffico",
        name: "Spaccio di rum",
        news: "Narcotrafficanti venezuelani vendono rum clandestinamente. Il prezzo del rum scende del 20%",
        start: "21:58",
        end: "22:08", //for "price" events, end shows when to remove the gif 
        value:  -0.2,
        commodities: ["rumbianco", "rumscuro"],
        gif: "gifs/plata_o_plomo.gif"
    },
    {
        type: "price",
        id : "FOMO",
        name: "Rush di acquisto",
        news: "Narcotrafficanti venezuelani vendono rum clandestinamente. Il prezzo del rum scende del 20%",
        start: "22:08",
        end: "22:18", //for "price" events, end shows when to remove the gif 
        value:  0.3,
        commodities: ['gin','vodka','rumbianco','tequila','birrachiara','birraipa','birrascura','rumscuro'],
        gif: "gifs/dicaprio_dance.gif"
    },
]