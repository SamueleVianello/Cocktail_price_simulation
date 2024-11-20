let cocktails = [
    {
      // GIN TONIC ---------------------------------
      id: "gintonic01",
      name: "GinTonic",
      bases: [
        {
          id: "gin",
          quantity: 5, //cl
        },
      ],
      other: [
        {
          name: "tonica",
          price: 4,
          cost: 0.5,
          quantity: 10, //cl
        },
      ],
    },
    {
      // VODKA LEMON ---------------------------------
      id: "vodkalemon01",
      name: "VodkaLemon",
      bases: [
        {
          id: "vodka",
          quantity: 5, // cl
        },
      ],
      other: [
        {
          name: "limonata",
          price: 4,
          cost: 0.5,
          quantity: 10, //cl
        },
      ],
    },
    {
      // VODKA+GIN ---------------------------------
      id: "vodkagin01",
      name: "Vodka+Gin",
      bases: [
        {
          id: "vodka",
          quantity: 5, // cl
        },
        {
          id: "gin",
          quantity: 5, // cl
        },
      ],
      other: [
        {
          name: "soda",
          price: 4,
          cost: 0.5,
          quantity: 10, //cl
        },
      ],
    },
    {
      // BEER ---------------------------------
      id: "beer01",
      name: "Birra Chiara",
      bases: [
        {
          id: "birra",
          quantity: 50,
        },
      ],
      other: [],
    },
    
  ];
  