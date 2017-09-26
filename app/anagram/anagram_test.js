'use strict';

describe('myApp.anagram module', function() {

  beforeEach(module('myApp.anagram'));

  describe('anagram controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var anagramCtrl = $controller('AnagramCtrl');
      expect(anagramCtrl).toBeDefined();
    }));

  });
});