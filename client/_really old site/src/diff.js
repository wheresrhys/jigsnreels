function percentageOverlap (firstString, secondString) {
	// We calculate the average of teh results in this rather odd way in order to avoid 
	// percentageOverlap(veryShortString, veryLongString) tending towards 50%
	return (longestSubstring(firstString, secondString) + longestSubstring(secondString, firstString)) / (secondString.length + firstString.length);
}

function longestSubstring (needle, haystack) {
	var charIndexes = [],
		result = [],
		usedCharacters = [],
		currentIndex,
		longestSubstring = '';

	// get the earliest occurence of each character in the string
	// TODO: when character appears more than once we need to take the second, third etc. occurence
	// TODO: allow for a 'character' to be one of a predefined list of strings
	for (var i = 0, il = needle.length; i<il; i++) {
		charIndexes.push(haystack.indexOf(needle.charAt(i)));
	}

	result = getIncreasingSequence(charIndexes);
	
	result = refineSequence(result.sequence, result.usedPositions, charIndexes);

	// finally retrieve and concatenate the matching characters
	for (var i = 0, il = result.length; i < il; i++) {
		longestSubstring += haystack.charAt(result.sequence[i]);
	}

	returnlongestSubstring;


}

function getIncreasingSequence(arr) {
	// Find the first character in the needle which matches one in the haystack
	var currentIndex = 0,
		result = [],
		usedPositions = [];

	while (arr[currentIndex] < 0) {
		currentIndex ++;
	}
	result.push(arr[currentIndex]);
	usedPositions.push(currentIndex);
	// Then create a provisional result by getting an increasing sequence 
	while (currentIndex < arr.length) {
		currentIndex++;
		if (arr[currentIndex] > result[result.length - 1]) {
			result.push(arr[currentIndex]);
			usedPositions.push(currentIndex);
		}
	}

	return {
		sequence: result,
		usedPositions: usedPositions
	};	
}

function refineSequence (sequence, positions, originalArray) {
	
	var start,
		finish,
		subsequence;

	for (var i = 0, il = positions.length; i < il; i++) {
		start = positions[i] + 1;
		finish = positions[i + 1];
		if (start === finish) {
			continue;
		}			
		subsequence = getIncreasingSequence(originalArray.slice(start, finish));
		if (subsequence.sequence.length > 1) {

			for (var j=0, jl = subsequence.sequence.length; j<jl; j++) {
				subsequence.usedPositions[j] = subsequence.usedPositions[j] + start;
			}

			sequence.splice.apply(sequence, [i, 1].concat(subsequence.sequence));
			positions.splice.apply(positions, [i, 1].concat(subsequence.usedPositions));
			return refineSequence(sequence, positions, originalArray); 
		}
	};

	return {
		sequence: sequence,
		usedPositions: positions
	};	
}




function findLongestIncreasingSequence(arr, strict) {

	if (strict) {
	    var index = 0,
	    	// start by putting a reference to the first entry of the array in the sequence
	    	increasingSequence = [index];

	    for (var i = 1, il = arr.length; i < il; i++) {
	    	// if the value in the array is smaller than the last value in the sequence...
	        if (arr[i] < arr[increasingSequence[index]]) {
	         	
	        	// .. put a refernce to that value instead of the first item in the sequence it's smaller than
	            for (var j = 0; j <= index; j++) {
	                if (arr[i] < arr[increasingSequence[j]]) {
	                    increasingSequence[j] = i;
	                    break;
	                }
	            }
	        } else if (arr[i] == arr[increasingSequence[index]]) {
	         	//increasingSequence[++index] = i;
	        } else {
	            increasingSequence[++index] = i;
	        }
	    }

	    var longestIncreasingSequence = new Array(index + 1);
	    longestIncreasingSequence[index] = arr[increasingSequence[index]];
	  	console.log((strict ? 'strict' : 'non-strict'), increasingSequence);
	    for ( i = index - 1; i >= 0; i--) {
	        if (increasingSequence[i] < increasingSequence[i + 1]) {
	            longestIncreasingSequence[i] = arr[increasingSequence[i]];
	        } else {
	            for ( j = increasingSequence[i + 1] - 1; j >= 0; j--) {
	                if (arr[j] > arr[increasingSequence[i]] && arr[j] < arr[increasingSequence[i + 1]])  {
	                    longestIncreasingSequence[i] = arr[j];
	                    increasingSequence[i] = j;
	                    break;
	                }
	            }
	        }
	    }
	} else {
	   	    var index = 0,
		    	// start by putting a reference to the first entry of the array in the sequence
		    	increasingSequence = [index];

		    for (var i = 1, il = arr.length; i < il; i++) {
		    	// if the value in the array is smaller than the last value in the sequence...
		        if (arr[i] < arr[increasingSequence[index]]){
		         	
		        	// .. put a refernce to that value instead of the first item in the sequence it's smaller than
		            for (var j = 0; j <= index; j++) {
		                if ( arr[i] <= arr[increasingSequence[j]]) {
		                    increasingSequence[j] = i;
		                    break;
		                }
		            }
		        // } else if (arr[i] == arr[increasingSequence[index]]) {
		        //  	increasingSequence[++index] = i;
		        } else {
		            increasingSequence[++index] = i;
		        }
		    }

		    var longestIncreasingSequence = new Array(index + 1);
		    longestIncreasingSequence[index] = arr[increasingSequence[index]];
		  console.log((strict ? 'strict' : 'non-strict'), increasingSequence);
		    for ( i = index - 1; i >= 0; i--) {
		        if (increasingSequence[i] < increasingSequence[i + 1]) {
		            longestIncreasingSequence[i] = arr[increasingSequence[i]];
		        } else {
		            for ( j = increasingSequence[i + 1] - 1; j >= 0; j--) {
		                if (!strict && arr[j] >= arr[increasingSequence[i]] && arr[j] <= arr[increasingSequence[i + 1]]) {
		                    longestIncreasingSequence[i] = arr[j];
		                    increasingSequence[i] = j;
		                    break;
		                }
		            }
		        }
    		}
    	}

	    return longestIncreasingSequence;
}

console.log('strict', findLongestIncreasingSequence([5,6,7,1,2,2,3,4,1,1,1,1,1,1], true));
console.log('non-strict', findLongestIncreasingSequence([5,6,7,1,2,2,3,4,1,1,1,1,1,1]));
//console.log(findLongestIncreasingSequence([5,6,7,1,2,2,3,4,1,1,1,1,1,1]))
//console.log(findLongestIncreasingSequence([5,6,7,1,2,2,3,4,1,1,1,1,1,1], true))
//console.log(findLongestIncreasingSequence([1,2,3, 3,4, 1,1,1]))
//console.log(findLongestIncreasingSequence([1,2,3, 3,4, 1,1,1], true))

