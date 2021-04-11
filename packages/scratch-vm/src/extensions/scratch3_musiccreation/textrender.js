const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const RenderedTarget = require('../../sprites/rendered-target');
const uid = require('../../util/uid');
const StageLayering = require('../../engine/stage-layering');
const MathUtil = require('../../util/math-util');
const log = require('../../util/log');
const letters = require('./letters');


class TextRender {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this.letters = {
            'a': letters.a,
            'b': letters.b,
            'c': letters.c,
            'd': letters.d,
            'e': letters.e,
            'f': letters.f,
            'g': letters.g,
            'h': letters.h,
            'i': letters.i,
            'j': letters.j,
            'h': letters.h,
            'i': letters.i,
            'j': letters.j,
            'k': letters.k,
            'l': letters.l,
            'm': letters.m,
            'n': letters.n,
            'o': letters.o,
            'p': letters.p,
            'q': letters.q,
            'r': letters.r,
            's': letters.s,
            't': letters.t,
            'u': letters.u,
            'v': letters.v,
            'w': letters.w,
            'x': letters.x,
            'y': letters.y,
            'z': letters.z
        }

        this.spacing = {
            'a': 59.03383897316219,
            'b': 35.666277712952166,
            'c': 55.59820426487096,
            'd': 51.65460910151694,
            'e': 33.821470245040814,
            'f': 35.05134189031503,
            'g': 62.10851808634772,
            'h': 51.65460910151691,
            'i': 0.0,
            'j': 27.057176196032685,
            'k': 44.275379229871646,
            'l': 33.20653442240376,
            'm': 76.86697782963824,
            'n': 57.803967327887975,
            'o': 62.108518086347715,
            'p': 35.05134189031503,
            'q': 62.72345390898482,
            'r': 34.305274971941685,
            's': 39.62850729517402,
            't': 51.03967327887982,
            'u': 50.42473745624271,
            'v': 52.88448074679113,
            'w': 88.55075845974329,
            'x': 45.50525087514586,
            'y': 47.350058343057185,
            'z': 55.959159859976694
        }

    }

    drawString (str, xstart, ystart, args, util) {
        var xstart = -200;
        var ystart = -150;
        for (var i in str) {
            log.log(i);
            xstart += 5;
            if (i >= 1) {
                xstart += this.spacing[str[i-1]]/5;
            }
            this.drawLetter(str[i], xstart, ystart, args, util);
        }

    }

    drawLetter(letter, xstart, ystart, args, util) {
        letter = letters[letter];
        this.penUp(args, util);
        for (var i in letter) {
            coord = letter[i];
            x = coord[0]/5 + xstart;
            y = -coord[1]/5 + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);     
        }
        this.penUp(args, util);
        for (var i in letter) {
            coord = letter[i];
            x = coord[0]/5 + xstart+1;
            y = -coord[1]/5 + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);     
        }
        this.penUp(args, util);
    }




}

module.exports = TextRender;