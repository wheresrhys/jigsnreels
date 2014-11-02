var scale = 'cdefgab',
    roots = [
        'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
    ], 
    equivalentRoots = {
        'A#': 'Bb',
        'G#': 'Ab',
        'C#': 'Db',
        'D#': 'Eb',
        'Gb': 'F#',
        'Fb': 'E',
        'Cb': 'B',
        'B#': 'C',
        'E#': 'F'
    },
    modes = [
        'maj',
        undefined,
        'dor',
        undefined,
        'phr',
        'lyd',
        undefined,
        'mix',
        undefined,
        'min',
        undefined,
        'loc'
    ],
    majorKeySignatures = {
        Db: -5,
        Ab: -4,
        Eb: -3,
        Bb: -2,
        F: -1,
        C: 0,
        G: 1,
        D: 2,
        A: 3,
        E: 4,
        B: 5,
        'F#': 6
    },

    fullNoteRX = /(?:\=|_|\^)?[a-g](?:,|\')*/gi,
    accidentalsRX = /\=|_|\^/,
    lowNoteRX = /[A-G]/,
    
    extractedNotesCache = {},

    _getHighestOrLowestOfPair = function (note1, note2, highest) {
        
        //Start by identifying the lowest note
        
                    // compare octaves
        var result = note1[1] < note2[1]                                ? note1 :
                    note1[1] > note2[1]                                 ? note2 :
                    //compare position in scale
                    scale.indexOf(note1[0]) < scale.indexOf(note2[0])   ? note1 :
                    scale.indexOf(note1[0]) > scale.indexOf(note2[0])   ? note2 :
                    //compare flatness
                    note1[2] === '_' ? note1 : 
                    note2[2] === '_' ? note2 :
                    //compare naturalness
                    note1[2] === '=' ? note1 :
                    note2[2] === '=' ? note2 :
                    //compare not being sharp
                    !note1[2]        ? note1 :
                    !note2[2]        ? note2 :
                    // if we get here both notes are the same note sharpened in the same octve so doesn't matter which we return 
                                        note1;
        
        // if looking for highest return the one we didn't identify above    
        if (highest === true) {
            result = result === note1 ? note2 : note1;
        }
        return result;
    },

    _extractNotes = function (abc) {

        if (extractedNotesCache[abc]) {
            return extractedNotesCache[abc];
        }

        var notes = [];

        abc.replace(fullNoteRX, function ($0) {
            notes.push(_getNoteCoords($0));                
        });

        return extractedNotesCache[abc] = notes;
    },

    _getHighestOrLowestInAbc = function (abc, highest) {
        var notes = _extractNotes(abc),
            currentExtreme = notes[0];

        for (var n = 1, nl = notes.length; n<nl; n++) {
            currentExtreme = _getHighestOrLowestOfPair(currentExtreme, notes[n], highest);
        }

        return _getNoteFromCoords(currentExtreme);
    },
    
    // _getDuration = function (abcFragment) {
        
    //     var duration = 0;
    // },

    _getDirectionOfTransposition = function (direction, interval) {
        if (direction) {
            return direction > 0 ? 1 : -1;    
        } else {
            return interval < 5 ? 1: -1;
        }
    },

    _getNoteCoords = function (note) {
        var accidental;
        if (accidentalsRX.test(note.charAt(0))) {
            accidental = note.charAt(0);
            note = note.substr(1);
        }
        if (lowNoteRX.test(note.charAt(0))) {
            return [note.charAt(0).toLowerCase(), 1 - note.length, accidental];
        } else {
            return [note.charAt(0), note.length, accidental];
        }
    },

    _getNoteFromCoords = function (note) {
        var noteString;

        if (note[1] < 1) {
            noteString =  note[0].toUpperCase() + Array(1 - note[1]).join(',');
        } else {
            noteString =  note[0] + Array(note[1]).join('\'');
        }

        if (note[2]) {
            noteString = note[2] + noteString;
        }
        return noteString;
    },

    _keepInLimits = function (note, lowerBound, upperBound) {
        
        if (lowerBound) {
            lowerBound = _getNoteCoords(lowerBound);
            if (lowerBound[1] >= note[1]) {
                note[1] = lowerBound[1];
                if (scale.indexOf(note[0]) < scale.indexOf(lowerBound[0])) {
                    note[1]++;
                }
            }
        }

        if (upperBound) {
            upperBound = _getNoteCoords(upperBound);
            if (upperBound[1] <= note[1]) {
                note[1] = upperBound[1];
                if (scale.indexOf(note[0]) > scale.indexOf(upperBound[0])) {
                    note[1]--;
                }
            }
        }

        return note;
    },

    transpose = function (abcDef, opts) {
        var interval = scale.indexOf(opts.newRoot.substr(0, 1).toLowerCase()) - scale.indexOf(abcDef.root.substr(0, 1).toLowerCase()),
            direction = _getDirectionOfTransposition(opts.direction, interval),
            extraOctaves = opts.direction ? ((opts.direction / direction) - 1) : 0;
        
        if (direction < 0) {
            interval = -interval;
        }
        
        if (interval <= 0) {
            interval += 7;  
        }
         
        interval += extraOctaves * 7;
        
        return abcDef.abc.replace(fullNoteRX, function (note) {
            note = _getNoteCoords(note);

            var intervalWithinOctave = (interval * direction) % 7,
                newNoteIndex = scale.indexOf(note[0]) + intervalWithinOctave;

            note[0] = scale[(newNoteIndex + 7) % 7];

            note[1] += direction * Math.floor(interval / 7);

            if (newNoteIndex < 0 || newNoteIndex > 6) {
                note[1] += direction;  
            }

            note = _keepInLimits(note, opts.lowerLimit, opts.upperLimit);
            return _getNoteFromCoords(note);
            
        });

    },

    // getProps = function (abcDef) {

    //     return {
    //         lowest: getLowestNote(abcDef.abc, getSharpsAndFlats(abcDef.root, abcDef.mode)),
    //         highest: getHighestNote(abcDef.abc, getSharpsAndFlats(abcDef.root, abcDef.mode)),
    //         // first
    //         // last
    //         // leadInLength
    //         // leadIn
    //         keySignature: getSharpsAndFlats(abcDef.root, abcDef.mode)
    //     };
    // },

    getSharpsAndFlats = function (root, mode) {

        var equivalentMajorIndex = (roots.length + roots.indexOf(root) - modes.indexOf(mode)) % roots.length,
            equivalentMajor = roots[equivalentMajorIndex];

        equivalentMajor = equivalentRoots[equivalentMajor] || equivalentMajor;

        return majorKeySignatures[equivalentMajor];
    },

    getLowestNote = function (abc) {
        return _getHighestOrLowestInAbc(abc, false);
    },
    
    getHighestNote = function (abc) {
        return _getHighestOrLowestInAbc(abc, true);
    },
    clearExtractedNotes = function () {
        extractedNotesCache = {};
    };

module.exports = {
    transpose: transpose,
    extractNotes: _extractNotes,
    // getProps: getProps,
    getSharpsAndFlats: getSharpsAndFlats,
    getLowestNote: getLowestNote,
    getHighestNote: getHighestNote,
    clearExtractedNotes: clearExtractedNotes
};
