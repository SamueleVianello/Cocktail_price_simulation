let cocktails = [
  /*
    {
      // GIN TONIC ---------------------------------
      id: gintonic01,
      name: GinTonic,
      bases: [
        {
          id: gin,
          quantity: 5, //cl
        },
      ],
      other: [
        {
          name: tonica,
          price: 4,
          cost: 0.5,
          quantity: 10, //cl
        },
      ],
    },
    {
      // VODKA LEMON ---------------------------------
      id: vodkalemon01,
      name: VodkaLemon,
      bases: [
        {
          id: vodka,
          quantity: 5, // cl
        },
      ],
      other: [
        {
          name: limonata,
          price: 4,
          cost: 0.25,
          quantity: 10, //cl
        },
      ],
    },
    {
      // VODKA REDBULL ---------------------------------
      id: vodkaredbull01,
      name: VodkaRedbull,
      bases: [
        {
          id: vodka,
          quantity: 5, // cl
        },
      ],
      other: [
        {
          name: redbull,
          price: 6,
          cost: 1,
          quantity: 10, //cl
        },
      ],
    },
    {
      // VODKA+GIN ---------------------------------
      id: vodkagin01,
      name: Vodka+Gin,
      bases: [
        {
          id: vodka,
          quantity: 5, // cl
        },
        {
          id: gin,
          quantity: 5, // cl
        },
      ],
      other: [
      ],
    },
    {
      // RUM COLA ---------------------------------
      id: rumcola01,
      name: Rum&Cola,
      bases: [
        {
          id: rumbianco,
          quantity: 5, // cl
        },
      ],
      other: [
        {
          name: cola,
          price: 3,
          cost: 0.25,
          quantity: 10, //cl
        },
      ],
    },
    {
      // QUATTRO BIANCHI ---------------------------------
      id: quattrobianchi,
      name: Quattro Bianchi,
      bases: [
        {
          id: rumbianco,
          quantity: 2.5, // cl
        },
        {
          id: gin,
          quantity: 2.5, // cl
        },
        {
          id: vodka,
          quantity: 2.5, // cl
        },
        {
          id: tequila,
          quantity: 2.5, // cl
        },
      ],
      other: [
      ],
    },
    {
      // TEQUILA SUNRISE ---------------------------------
      id: tequilasunrise,
      name: Tequila Sunrise,
      bases: [
        {
          id: tequila,
          quantity: 5, // cl
        },
      ],
      other: [
        {
          name: succo arancia,
          price: 3.5,
          cost: 0.25,
          quantity: 10, //cl
        },
      ],
    },
    {
      // BEER ---------------------------------
      id: beer01,
      name: Birra Chiara,
      bases: [
        {
          id: birrachiara,
          quantity: 50,
        },
      ],
      other: [],
    },
    {
      // BEER ---------------------------------
      id: beer02,
      name: Birra Scura,
      bases: [
        {
          id: birrascura,
          quantity: 50,
        },
      ],
      other: [],
    },
*/

    {
  id: 'gintonic01',
  name: 'Gin Tonic Base',
  ticker: 'GNTNC',
  bases: [
    {
      id: 'gin',
      quantity: 5
    },
  ],
  other: [
    {
      name: 'tonic',
      price: 3,
      cost: 1.17,
      quantity: 15
    }
  ]
},
{
  id: 'vodkalemon01',
  name: 'Vodka Lemon Base',
  ticker: 'VDKLMN',
  bases: [
    {
      id: 'vodka',
      quantity: 5
    },
  ],
  other: [
    {
      name: 'lemonsoda',
      price: 3,
      cost: 0.5,
      quantity: 15
    }
  ]
},
{
  id: 'vodkaredbull01',
  name: 'Vodka Redbul Base',
  ticker: 'VDKRDBL',
  bases: [
    {
      id: 'vodka',
      quantity: 5
    },
  ],
  other: [
    {
      name: 'redbull',
      price: 3,
      cost: 1.5,
      quantity: 15
    }
  ]
},
{
  id: 'rumcola01',
  name: 'Rum Cola Cubalibre',
  ticker: 'RMCL',
  bases: [
    {
      id: 'rumscuro',
      quantity: 5
    },
  ],
  other: [
    {
      name: 'cola',
      price: 3,
      cost: 0.98,
      quantity: 15
    }
  ]
},
{
  id: 'quattrobianchi',
  name: 'Quattrobianchi',
  ticker: '4BIANKI',
  bases: [
    {
      id: 'gin',
      quantity: 2.5
    },
    {
      id: 'vodka',
      quantity: 2.5
    },
    {
      id: 'rumbianco',
      quantity: 2.5
    },
    {
      id: 'tequila',
      quantity: 2.5
    },
  ],
  other: [
  ]
},
{
  id: 'margarita',
  name: 'Margarita',
  ticker: 'MRGRT',
  bases: [
    {
      id: 'tequila',
      quantity: 5
    },
  ],
  other: [
    {
      name: 'lemonsoda',
      price: 3,
      cost: 0.5,
      quantity: 15
    }
  ]
},
{
  id: 'tequilasunrise',
  name: 'TequilaSunrise',
  ticker: 'TQLSNRS',
  bases: [
    {
      id: 'tequila',
      quantity: 5
    },
  ],
  other: [
    {
      name: 'succoarancia',
      price: 3,
      cost: 1.459,
      quantity: 15
    }
  ]
},
{
  id: 'beer01',
  name: 'Birra Chiara',
  ticker: 'KZLBLND',
  bases: [
    {
      id: 'birrachiara',
      quantity: 33
    },
  ],
  other: [
  ]
},
{
  id: 'beer02',
  name: 'Birra IPA',
  ticker: 'BRKLNG-IPA',
  bases: [
    {
      id: 'birraipa',
      quantity: 33
    },
  ],
  other: [
  ]
},
{
  id: 'beer03',
  name: 'Birra rossa',
  ticker: 'KZLRED',
  bases: [
    {
      id: 'birrascura',
      quantity: 33
    },
  ],
  other: [
  ]
}
    
  ];
  