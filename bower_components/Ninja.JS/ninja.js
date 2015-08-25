/**
 * Ninja.JS
 * 
 * Ninja é uma forma simples de organizar seu codigo javascript em
 * modulos. Este modulo principal é responsavel pelo registros dos servicos,
 * injecao de dependencias destes servicos e disparo dos componentes
 * apos o evento de load do window
 *
 * @main Ninja
 * @author Cleber de Moraes Goncalves <cleber.programmer>
 * @example
 *        
 *        Ninja.module('$component', [], function () {
 *          return {
 *            // code here ...
 *          };
 *        });
 *        
 *        Ninja(['$component'], function ($component) {
 *        
 *          $component('cleber-programmer', {
 *            templateUrl: './template/cleber-programmer.html'
 *          });
 *        
 *        });
 *        
 */
(function ($modules, $components, $cache) {
  
  /**
   * Construtor de objeto que descreve as referencias das dependencias
   * e a funcao callback que recebe estas dependencias
   *
   * @private
   * @method build
   * @param {Array} dependencies Colecao de dependencias
   * @param {Function} callback Funcao que recebe as dependencias
   * @return {Object} Objeto que descreve as dependencias e funcao callback
   * @example
   *        
   *        build(['$component'], function ($component) { });
   *        
   */
  function build(dependencies, callback) {
    return { 'callback': callback, 'dependencies': dependencies };
  }
  
  /**
   * Retorna uma dependencia atraves do seu identificador, esta funcao é
   * utilizado para mapear as dependencias dos servico e modulos. Uma vez mapeado
   * esta dependencia sera armazenado em cache
   *
   * @private
   * @method inject
   * @param {String} name Identificador de um servico
   * @return {Object} Um servico
   * @example
   *        
   *        inject('$component');
   *        
   */
  function inject(name) {
    return $cache[name] || ($cache[name] = mapper($components[name] || referenceError(name)));
  }
  
  /**
   * Mapeia as dependencias de um componente e/ou servicos utilizando a funcao
   * inject retornando o resultado da funcao callback
   *
   * @private
   * @method mapper
   * @param {Object} item Objeto que descreve as dependencias e a funcao callback
   * @return {Function|Object} Funcao ou Objeto resultado da execucao da funcao callback
   * @example
   *        
   *        mapper({
   *          dependencies: ['$component'],
   *          callback: function ($component) { }
   *        });
   *        
   */
  function mapper(item) {
    return item.callback.apply(null, item.dependencies.map(inject));
  }
  
  /**
   * Monta um componente injetando suas respectivas dependencias, servindo como
   * um emcapsulador deste componente
   *
   * @public
   * @method ninja
   * @param {Array} dependencies Colecao de dependencias que sera injetado na funcao callback
   * @param {Function} callback Funcao que recebe como argumento dependencias
   * @example
   *        
   *        Ninja(['$component'], function ($component) {
   *        
   *          $component('cleber-programmer', {
   *            templateUrl: './template/cleber-programmer.html'
   *          });
   *        
   *        });
   *        
   */
  function ninja(dependencies, callback) {
    $modules.push(build(dependencies, callback));
  }
  
  /**
   * Registra um servico injetando suas respectivas dependencias, servindo
   * como um encapsulador deste servico
   *
   * @public
   * @static
   * @method module
   * @param {String} name Nome do servico
   * @param {Array} dependencies Colecao de dependencias que sera injetado na funcao callback
   * @param {Function} callback Funcao que recebe como argumento dependencias
   * @example
   *        
   *        Ninja.module('$component', [], function () {
   *          return {
   *            // code here ...
   *          };
   *        });
   *        
   */
  ninja.module = function (name, dependencies, callback) {
    Object.defineProperty($components, name, { value: build(dependencies, callback) });
  };
  
  /**
   * Dispara um ReferenceError quando nao encontrado um servico
   *
   * @private
   * @method referenceError
   * @param {String} name Nome do servico
   * @example
   *
   *        referenceError('$curry');
   *
   */
  function referenceError(name) {
    throw new ReferenceError('The ' + name + ' module is not defined');
  }
  
  /**
   * Aguarda o termino do evento load do window para iniciar a execucao
   * dos componentes, garantindo que todos os servicos e componentes sejam
   * carregados nao se precupado com a ordem de precedencia
   */
  window.addEventListener('load', function () {
    $modules.forEach(function (item) { setTimeout(mapper.bind(null, item), 0); });
  });
  
  /**
   * Revelacao do objeto Ninja, encapsulando a visibilidade das funcoes
   * privadas
   */
  Object.defineProperty(window, 'Ninja', { value: ninja });

})([], {}, {});
