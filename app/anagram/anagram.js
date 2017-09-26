'use strict';

angular.module('myApp.anagram', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'anagram/anagram.html',
    controller: 'AnagramCtrl'
  });
}])

.controller('AnagramCtrl', ['$scope', 'orderByFilter', function($scope, orderBy) {
    $scope.inputString = "";
    $scope.randomAnagrams = [];
    $scope.anagramObjects = [];
    $scope.firstAnagram = "";
    $scope.selectedAnagrams = [];
    $scope.selectedIndexes = [];
    $scope.isSorted;

    /**
     * This method sort the anagrams when the sort button clicked.
     *
     * @param {Array} randomAnagrams the array of random anagrams.
     */
    $scope.sortTable = function(randomAnagrams) {
        if($scope.isSorted) {
            $scope.anagramObjects = orderBy(randomAnagrams, "anagram",  true); // revers sort
            $scope.isSorted = false;
        } else {
            $scope.anagramObjects = orderBy(randomAnagrams, "anagram",  false);
            $scope.isSorted = true;
        }
    }
    /**
     * This method return the anagram of the input text.
     *
     * @param {String} iString the input text.
     * @param {Boolean} isReroll the flag that indicate a reroll.
     */

    $scope.findAnagram = function(iString, isReroll) {
        var permArr = [],
            usedChars = [],
            result = [],
            lng = 0;

        result = permute(iString, permArr, usedChars);
        $scope.randomAnagrams = _.slice(_.shuffle(result), 0, 10);
        $scope.firstAnagram = $scope.randomAnagrams[0];

        lng = $scope.randomAnagrams.length;
        $scope.anagramObjects = [];
        for(var i = 0; i < lng; i++) {
            // Create anagram object to save each anagram's selected state.
            var obj = _.zipObject(['anagram', 'selected'], [$scope.randomAnagrams[i], false]);
            $scope.anagramObjects.push(obj)
        }

        if(isReroll) {
            var j = 0;
            $scope.anagramObjects.forEach(function(anagramObj, i) {
                // check this anagram if it is selected.
                if ($scope.selectedIndexes.indexOf(i) > -1) {
                    anagramObj.selected = true;
                    anagramObj.anagram = $scope.selectedAnagrams[j];
                    j++;
                } else if ($scope.selectedAnagrams.indexOf(anagramObj.anagram) > -1) {
                    anagramObj.anagram = _.shuffle(anagramObj.anagram.split('')).join('');
                    j++;
                }
            }, this);
        } else {
            $scope.selectedAnagrams = [];
            $scope.selectedIndexes = [];
        }
    }
    /**
     * This method cache the selected anagram.
     *
     * @param {Number} index the selected index.
     */
    $scope.selectAnagram = function(index) {
        if($scope.anagramObjects[index].selected) {
            $scope.selectedAnagrams.push($scope.anagramObjects[index].anagram);
            $scope.selectedIndexes.push(index);
        } else {
            $scope.selectedAnagrams.pop($scope.anagramObjects[index].anagram);
            $scope.selectedIndexes.pop(index);
        }
    }
    /**
     * This method return the permutation of the give input text.
     *
     * @param {String} input the input text.
     * @param {Array} permArr the permutation array.
     * @param {Array} usedChars the characters used.
     */
    function permute(input, permArr, usedChars) {
        // Check if our max limit has been reached
        if (permArr.length >= 1000) return;

        var i, // i - current index
            ch, // ch - current character
            chars = input.split(""); // chars - input text characters
        // Loop through every letter
        for (i = 0; i < chars.length; i++) {
            // Splice the character at the index we need
            ch = chars.splice(i, 1);
            // Push the character into the used category
            usedChars.push(ch);
            // We've run out of characters, push this combination (usedChars) into permArr
            if (chars.length == 0) {
                permArr[permArr.length] = usedChars.join("");
            }
            // Recursively run the input without the characters we've removed
            permute(chars.join(""), permArr, usedChars);
            // Inject and shift our stored letter at the appropriate index, this is how arrange for all possible combinations
            chars.splice(i, 0, ch);
            // Remove the last used character as we've exhausted its potential
            usedChars.pop();
        }
        return permArr;
    };
}]);