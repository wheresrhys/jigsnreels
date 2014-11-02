module.exports = function($rootScope) {
    var dropdowns = {
        playback: [{
            value: 0,
            label: 'Novice'
        }, {
            value: 1,
            label: 'Hand-holding'
        }, {
            value: 2,
            label: 'Sloppy/Slow'
        }, {
            value: 3,
            label: 'Playalong'
        }, {
            value: 4,
            label: 'Starter'
        }, {
            value: 5,
            label: 'Solo'
        }],
        popularity: [{
            value: 0,
            label: 'Unknown'
        }, {
            value: 1,
            label: 'Rare'
        }, {
            value: 2,
            label: 'Common'
        }, {
            value: 3,
            label: 'Standard'
        }],
        rating: [{
            value: 1,
            label: 'Mediocre'
        }, {
            value: 2,
            label: 'Run of the mill'
        }, {
            value: 3,
            label: 'Pretty good'
        }, {
            value: 4,
            label: 'Really nice'
        }, {
            value: 5,
            label: 'Special'
        }],
        difficulty: [{
            value: 1,
            label: 'Easy-peasy'
        }, {
            value: 2,
            label: 'Straightforward'
        }, {
            value: 3,
            label: 'Tricky Bits'
        }, {
            value: 4,
            label: 'Really hard'
        }],
        rhythm: [
            'jig',
            'reel',
            'slip jig',
            'hornpipe',
            'polka',
            'slide',
            'waltz',
            'barndance',
            'strathspey',
            'three-two',
            'mazurka'
        ],
        root: [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'Bb',
            'Eb',
            'Ab',
            'Db',
            'F#',
            'C#',
            'G#'
        ],
        mode: [
            'maj',
            'min',
            'mix',
            'dor',
            'aeo'
        ]
    };

    $rootScope.dropdowns = dropdowns;

    return dropdowns;
};