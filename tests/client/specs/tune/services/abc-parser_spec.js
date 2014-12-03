describe('fhgc', function () {

	var abc = require('src/tune/services/abc-parser'),
		getPairsWithOrder = function (arr) {
			var pairArray = [];
			for (var i = 0, il = arr.length; i<il; i++) {
				for (var j = i + 1; j <il; j++) {
					pairArray.push([arr[i], arr[j]]);
				}
			}
			return pairArray;
		},
		getPairsWithoutOrder = function (arr) {
			var pairArray = getPairsWithOrder(arr);

			return pairArray.concat(getPairsWithOrder(arr.reverse()));
		},
		shiftString = function (str, n) {
			n = (n + 7) % 7;
			return str.substr(n) + str.substr(0, n);
		};

	describe('caching results', function () {
		it('should cache any notes retrieved from an abc string', function () {
			var testString = '.hasjhfgkajbc^5s7av%rz`hgvcs',
				cached = abc.extractNotes(testString);

			expect(abc.extractNotes(testString)).toBe(cached);

		});

		it('should be possible to clear the cache of notes retrieved from an abc string', function () {
			var testString = '.hasjhfgkajbc^5s7av%rz`hgvcs',
				cached = abc.extractNotes(testString);

			abc.clearExtractedNotes();
			expect(abc.extractNotes(testString)).not.toBe(cached);

		});
	});

	describe('high and low notes', function () {

		var testPairs = function (notes, method, message) {
				getPairsWithOrder(notes).map(function (pair) {
					testPair(pair, method, message);

				});
			},

			testPair = function (pair, method, message) {
				var inverse = [pair[1], pair[0]];

				message = message.replace(/\{1\}/g, pair[1]).replace(/\{0\}/g, pair[0]);

				it(message, function () {
					expect(abc[method](pair.join(''), 0)).toBe(pair[0]);
					expect(abc[method](inverse.join(''), 0)).toBe(inverse[1]);
				});
			};

		afterEach(abc.clearExtractedNotes);

		describe('getLowestNote', function () {
			describe('get lowest by octave', function () {
				testPairs('G,;G;g;g\''.split(';'), 'getLowestNote', 'should find that {0} is the lowest note of {0} and {1}');
			});
			describe('get lowest within octave', function () {
				testPairs('cdefgab'.split(''), 'getLowestNote', 'should find that {0} is the lowest note of {0} and {1}');
			});
			describe('get lowest across octave boundary', function () {
				testPairs(['B','c'], 'getLowestNote', 'should find that {0} is the lowest note of {0} and {1}');
				testPairs(['B,', 'C'], 'getLowestNote', 'should find that {0} is the lowest note of {0} and {1}');
				testPairs(['b', 'c\''], 'getLowestNote', 'should find that {0} is the lowest note of {0} and {1}');
			});
			describe('get lowest chromatically', function () {
				testPairs([
					'_d',
					'=d',
					'd',
					'^d',
					'_e',
					'e'//,  '_f',
					// '^e'
				], 'getLowestNote', 'should find that {0} is the lowest note of {0} and {1}');

			});

			it('should find that ^e is the lowest note of ^e and ^e', function () {
				expect(abc.getLowestNote('^e^e')).toBe('^e');
			});

			it('should be able to handle much longer strings', function () {
				expect(abc.getLowestNote('aAB^G~-_G,Cdeb\'cD')).toBe('_G,');
			});

		});

		describe('getHighestNote', function () {
			describe('get highest by octave', function () {
				testPairs('g\';g;G;G,'.split(';'), 'getHighestNote', 'should find that {0} is the highest note of {0} and {1}');
			});
			describe('get highest within octave', function () {
				testPairs(''.split(''), 'getHighestNote', 'should find that {0} is the highest note of {0} and {1}');
			});
			describe('get highest across octave boundary', function () {
				testPairs(['c', 'B'], 'getHighestNote', 'should find that {0} is the highest note of {0} and {1}');
				testPairs(['C', 'B,'], 'getHighestNote', 'should find that {0} is the highest note of {0} and {1}');
				testPairs(['c\'', 'b'], 'getHighestNote', 'should find that {0} is the highest note of {0} and {1}');
			});
			describe('get highest chromatically', function () {
				testPairs([
					// '^e',
					// '_f',
					'e',
					'_e',
					'^d',
					'd',
					'=d',
					'_d'
				], 'getHighestNote', 'should find that {0} is the highest note of {0} and {1}');

			});

			it('should be able to handle much longer strings', function () {
				expect(abc.getHighestNote('aAB^G~-_G,Cdeb\'cD')).toBe('b\'');
			});
		});

	});



	describe('getSharpsAndFlats', function () {
		it('should get correct sharps and flats for major keys', function () {

			expect(abc.getSharpsAndFlats('Cb', 'maj')).toBe(5);
			expect(abc.getSharpsAndFlats('Gb', 'maj')).toBe(6);
			expect(abc.getSharpsAndFlats('Db', 'maj')).toBe(-5);
			expect(abc.getSharpsAndFlats('Ab', 'maj')).toBe(-4);
			expect(abc.getSharpsAndFlats('Eb', 'maj')).toBe(-3);
			expect(abc.getSharpsAndFlats('Bb', 'maj')).toBe(-2);
			expect(abc.getSharpsAndFlats('F', 'maj')).toBe(-1);
			expect(abc.getSharpsAndFlats('C', 'maj')).toBe(0);
			expect(abc.getSharpsAndFlats('G', 'maj')).toBe(1);
			expect(abc.getSharpsAndFlats('D', 'maj')).toBe(2);
			expect(abc.getSharpsAndFlats('A', 'maj')).toBe(3);
			expect(abc.getSharpsAndFlats('E', 'maj')).toBe(4);
			expect(abc.getSharpsAndFlats('B', 'maj')).toBe(5);
			expect(abc.getSharpsAndFlats('F#', 'maj')).toBe(6);
			expect(abc.getSharpsAndFlats('C#', 'maj')).toBe(-5);
			expect(abc.getSharpsAndFlats('G#', 'maj')).toBe(-4);
		});

		it('should get correct sharps and flats for modes', function () {
			expect(abc.getSharpsAndFlats('D', 'maj')).toBe(2);
			expect(abc.getSharpsAndFlats('D', 'dor')).toBe(0);
			expect(abc.getSharpsAndFlats('D', 'phr')).toBe(-2);
			expect(abc.getSharpsAndFlats('D', 'lyd')).toBe(3);
			expect(abc.getSharpsAndFlats('D', 'mix')).toBe(1);
			expect(abc.getSharpsAndFlats('D', 'min')).toBe(-1);
			expect(abc.getSharpsAndFlats('D', 'loc')).toBe(-3);
		});

		it('should get correct sharps and flats for flat and sharp modes', function () {
			expect(abc.getSharpsAndFlats('F#', 'phr')).toBe(2);
			expect(abc.getSharpsAndFlats('Gb', 'phr')).toBe(2);
			expect(abc.getSharpsAndFlats('Bb', 'mix')).toBe(-3);
			expect(abc.getSharpsAndFlats('A#', 'mix')).toBe(-3);
		});

	});

	describe('transpose', function () {
		var chromaticScaleOfRoots = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],

			scale = 'cdefgab';

		describe('moving notes to the right position in the scale', function () {
			var roots = ['C', 'Db', 'E', 'F#'];
			getPairsWithoutOrder(roots).map(function (roots) {
				it('should be able to transpose from ' + roots[0] + ' to ' + roots[1], function () {
					var interval = scale.indexOf(roots[1].substr(0, 1).toLowerCase()) - scale.indexOf(roots[0].substr(0, 1).toLowerCase());
					expect(abc.transpose({
						abc: scale,
						root: roots[0],
						mode: 'maj'
					}, {
						direction: 1,
						newRoot: roots[1]
					}).replace(/\'|,/g, '')).toBe(shiftString(scale, interval));
				});
			});

			it('should be able to transpose notes in the bottom or top octaves', function () {
				var interval = scale.indexOf(roots[1].substr(0, 1).toLowerCase()) - scale.indexOf(roots[0].substr(0, 1).toLowerCase());
				expect(abc.transpose({
					abc: 'A,d\'',
					root: 'C',
					mode: 'maj'
				}, {
					direction: 1,
					newRoot: 'E'
				}).replace(/\'|,/g, '')).toBe('Cf');
			});

		});

		describe('moving notes to the correct octave', function () {
			var sameDirectionConfigs = [
					{
						direction: -2,
						expectation: 'B,,,A,,B,,A,B,ABa',
						newRoot: 'F'
					},
					{
						direction: -1,
						expectation: 'B,,A,B,ABaba\'',
						newRoot: 'F'
					},
					{
						direction: 1,
						expectation: 'D,CDcdc\'d\'c\'\'',
						newRoot: 'A'
					},
					{
						direction: 2,
						expectation: 'Dcdc\'d\'c\'\'d\'\'c\'\'\'',
						newRoot: 'A'
					}
				],
				opposingDirectionConfigs = [
					{
						direction: -1,
						expectation: 'D,CDcdc\'d\'c\'\'',
						newRoot: 'A'
					},
					{
						direction: 1,
						expectation: 'B,ABaba\'b\'a\'\'',
						newRoot: 'F'
					}
				];

			sameDirectionConfigs.map(function (conf) {
				it('should be able to transpose notes within ' + conf.direction + ' octaves when root moves in same direction as pitch', function () {

					expect(abc.transpose({
						abc: 'C,B,CBcbc\'b\'',
						root: 'G',
						mode: 'maj'
					}, {
						direction: conf.direction,
						newRoot: conf.newRoot
					})).toBe(conf.expectation);
				});
			});

			opposingDirectionConfigs.map(function (conf) {
				it('should be able to transpose notes when root moves in opposite direction to pitch', function () {

					expect(abc.transpose({
						abc: 'C,B,CBcbc\'b\'',
						root: 'G',
						mode: 'maj'
					}, {
						direction: 1,
						newRoot: conf.newRoot
					})).toBe(conf.expectation);
				});
			});

			it('should be able to transpose notes up by an octave exactly', function () {

				expect(abc.transpose({
					abc: 'C,B,CBcbc\'b\'',
					root: 'G',
					mode: 'maj'
				}, {
					direction: 1,
					newRoot: 'G'
				})).toBe('CBcbc\'b\'c\'\'b\'\'');
			});

			it('should be able to transpose notes down by an octave exactly', function () {

				expect(abc.transpose({
					abc: 'C,B,CBcbc\'b\'',
					root: 'G',
					mode: 'maj'
				}, {
					direction: -1,
					newRoot: 'G'
				})).toBe('C,,B,,C,B,CBcb');
			});


		});

		describe('picking a direction when direction not specified', function () {
			it('should transpose up when closer to move up to new root', function () {
				expect(abc.transpose({
					abc: 'b',
					root: 'D',
					mode: 'maj'
				}, {
					newRoot: 'F'
				})).toBe('d\'');
			});
			it('should transpose up when equal distance to new root', function () {
				expect(abc.transpose({
					abc: 'b',
					root: 'D',
					mode: 'maj'
				}, {
					newRoot: 'G#'
				})).toBe('e\'');
			});
			it('should transpose down when closer to move down to new root', function () {
				expect(abc.transpose({
					abc: 'b',
					root: 'D',
					mode: 'maj'
				}, {
					newRoot: 'B'
				})).toBe('g');
			});
		});


		describe('handling notes that go off the allowed scale', function () {
			it('should invent notes when they go off the scale', function () {
				expect(abc.transpose({
					abc: 'A,Aaa\'',
					root: 'A',
					mode: 'maj'
				}, {
					direction: 1,
					newRoot: 'G'
				})).toBe('Ggg\'g\'\'');
			});

			describe('upper limits', function () {
				it('should keep high notes within a range when told to', function () {
					expect(abc.transpose({
						abc: 'G,,G,Ggg\'A,Aaa\'B,Bbb\'b\'\'',
						root: 'A',
						mode: 'maj'
					}, {
						direction: 1,
						newRoot: 'A',
						upperLimit: 'a'
					})).toBe('G,GgggAaaaBBBBB');
				});
				it('should keep high notes within a lowish range when told to', function () {
					expect(abc.transpose({
						abc: 'G,,G,Ggg\'A,Aaa\'B,Bbb\'b\'\'',
						root: 'A',
						mode: 'maj'
					}, {
						direction: 1,
						newRoot: 'A',
						upperLimit: 'A'
					})).toBe('G,GGGGAAAAB,B,B,B,B,');
				});
				it('should keep high notes within a really low range when told to', function () {
					expect(abc.transpose({
						abc: 'G,,G,Ggg\'A,Aaa\'B,Bbb\'b\'\'',
						root: 'A',
						mode: 'maj'
					}, {
						direction: -1,
						newRoot: 'A',
						upperLimit: 'A,'
					})).toBe('G,,,G,,G,G,G,A,,A,A,A,B,,B,,B,,B,,B,,');
				});
				it('should keep high notes within a really high range when told to', function () {
					expect(abc.transpose({
						abc: 'G,,G,Ggg\'A,Aaa\'B,Bbb\'b\'\'',
						root: 'A',
						mode: 'maj'
					}, {
						direction: 1,
						newRoot: 'A',
						upperLimit: 'a\''
					})).toBe('G,Ggg\'g\'Aaa\'a\'Bbbbb');
				});
			});

			describe('lower limits', function () {
				it('should keep low notes within a range when told to', function () {
					expect(abc.transpose({
						abc: 'G,,G,Ggg\'A,Aaa\'B,Bbb\'b\'\'',
						root: 'A',
						mode: 'maj'
					}, {
						direction: -1,
						newRoot: 'A',
						lowerLimit: 'A'
					})).toBe('gggggAAAaBBBbb\'');
				});
				it('should keep low notes within a highish range when told to', function () {
					expect(abc.transpose({
						abc: 'G,,G,Ggg\'A,Aaa\'B,Bbb\'b\'\'',
						root: 'A',
						mode: 'maj'
					}, {
						direction: -1,
						newRoot: 'A',
						lowerLimit: 'a'
					})).toBe('g\'g\'g\'g\'g\'aaaabbbbb\'');
				});
				it('should keep low notes within a really high range when told to', function () {
					expect(abc.transpose({
						abc: 'G,,G,Ggg\'A,Aaa\'B,Bbb\'b\'\'',
						root: 'A',
						mode: 'maj'
					}, {
						direction: 1,
						newRoot: 'A',
						lowerLimit: 'a\''
					})).toBe('g\'\'g\'\'g\'\'g\'\'g\'\'a\'a\'a\'a\'\'b\'b\'b\'b\'\'b\'\'\'');
				});

				it('should keep low notes within a really low range when told to', function () {
					expect(abc.transpose({
						abc: 'G,,G,Ggg\'A,Aaa\'B,Bbb\'b\'\'',
						root: 'A',
						mode: 'maj'
					}, {
						direction: -1,
						newRoot: 'A',
						lowerLimit: 'A,'
					})).toBe('GGGGgA,A,AaB,B,Bbb\'');
				});
			});

			xit('shoudl work well with accidentals', function () {

			});
		});


	});

});