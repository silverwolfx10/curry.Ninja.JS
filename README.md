### $curry

Quebra uma funcao construtora dentro de uma funcao curry que pode ser chamado com os mesmos argumentos retornanto o mesmo tipo. Essas combinacoes utiliza um undefined para espedificar gaps dentro da funcao curry, permitindo a aplicacao parcial de qualquer combinacao de argumentos independentes de suas posicoes

```javascript
Ninja.service('$add', ['$curry'], function ($curry) {
  return $curry(function (a, b) {
    return a + b;
  });
});

Ninja(['$add'], function ($add, _) {
  ['bom dia', 'boa tarde', 'boa noite'].map($add(_, ' cleber.programmer'));
});
```
