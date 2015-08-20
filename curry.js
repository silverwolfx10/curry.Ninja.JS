/**
 * $curry
 * 
 * Quebra uma funcao construtora dentro de uma funcao curry que pode ser chamado
 * com os mesmos argumentos retornanto o mesmo tipo
 * Essas combinacoes utiliza um undefined para espedificar gaps dentro da funcao curry,
 * permitindo a aplicacao parcial de qualquer combinacao de argumentos
 * independentes de suas posicoes
 * 
 * @module $curry
 * @author Cleber de Moraes Gonaçves <cleber.programmer>
 * @exaple
 * 
 *        var add = $curry(function (a, b) {
 *          return a + b;
 *        });
 * 
 *        ['bom dia', 'boa tarde', 'boa noite'].map(add(undefined, ' cleber.programmer'));
 * 
 */
Ninja.service('$curry', [], function (_) {
  
  /**
   * Cria uma funcao que ao ser executadao retorna o proximo item de uma array
   * 
   * @private
   * @method iterator
   * @param {Array} args Argumentos que foram passados na funcao
   * @return {function} Funcao que retorna o proximo item
   * @example
   * 
   *        iterator([1, 2]);
   * 
   */
  function iterator(args) {
    return function () { return args.shift(); };
  }
  
  /**
   * Mapeia os gaps com os argumentos passado na execucao da funcao
   * 
   * @private
   * @method mapper
   * @param {Array} template Array com os gaps que seram substituido
   * @param {Function} next Funcao que retorna o proximo argumento
   * @return {Array} Array com os argumentos mapeado
   * @example
   * 
   *        mapper([undefined, undefined], iterator([undefined, ' cleber.programmer']));
   * 
   */
  function mapper(template, next) {
    return template.map(function (a) { return a || next(); });
  }
  
  /**
   * Valida se algum dos argumnetos é um gap
   * 
   * @private
   * @method validate
   * @param {Array] parameters Array de agumentos
   * @return {Boolean} Verdadeiro se nenhum argumento for um gap
   * @example
   * 
   *        validate([undefined, ' cleber.programmer']);
   * 
   */
  function validate(parameters) {
    return parameters.every(function (a) { return a != _; });
  }
  
  /**
   * Revelacao do servico $curry, encapsulando a visibilidade das funcoes
   * privadas
   */
  return function (f) {
  
    /**
     * Quebra uma funcao construtora dentro de uma funcao curry que pode ser chamado
     * com os mesmos argumentos retornanto o mesmo tipo
     * 
     * @public
     * @method
     * @param {Function} f Funcao construtora
     * @return {Function} Funcao curry
     * @example
     * 
     *        $curry(function (a, b) {
     *          return a + b;
     *        });
     * 
     */
    function curry(template) {
      return solve(mapper(template, iterator([].slice.call(arguments, 1))));
    }
    
    /**
     * Resolve se deve retornar novamento a funcao curry ou executar a
     * funcao construtora
     * 
     * @private
     * @method solve
     * @param {Array} parameters Array de argumentos da funcao construtora
     * @returm {Array|Boolean|Date|Funcation|Null|Object|String|Undefined} Retorna a funcao curry ou o resultado da funcao construtora
     * @example
     * 
     *        solve(mapper(template, iterator([].slice.call(arguments, 1))));
     * 
     */
    function solve(parameters) {
      return validate(parameters) ? f.apply(f, parameters) : curry.bind(curry, parameters);
    }
    
    /**
     * Na primeira chamado retorna a funcao curry passando um array sparse
     */
    return curry.bind(curry, Array(f.length).join('.').split('.').map(function () { return _; }));
    
  };
  
});
