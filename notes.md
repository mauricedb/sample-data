[https://www.json-generator.com/](https://www.json-generator.com/)

```
[
  '{{repeat(10)}}',
  {
    id: '{{index()}}',
    firstname: '{{firstName()}}',
    surname: '{{surname()}}',
    email: '{{email()}}',
    balance: '{{floating(1000, 4000, 2, "$0,0.00")}}',
    picture: 'https://randomuser.me/api/portraits/lego/{{index()}}.jpg',
    address: '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
    phone: '{{phone()}}',
    transactions: [
      '{{repeat(1, 10)}}',
      {
        amount: '{{floating(10, 100, 2, "$0,0.00")}}',
        date: '{{date(new Date(1970, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss Z")}}',
        type: '{{random("invoice", "payment","deposit","withdrawal")}}',
        name: '{{company()}}'
      }
    ]
  }
]
```
