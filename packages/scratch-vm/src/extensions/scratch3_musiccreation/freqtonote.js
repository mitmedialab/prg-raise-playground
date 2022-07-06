class FreqToNote { 
    /**
     * Returns the string representation of @param note
     * @param {number} note 
     */
    static freqToNote(note) {
        symbols = ["c","cS","d","eF","e","f","fS","g","gS","a","bF","b"];
        let res = symbols[note % 12];
        let d =  Math.floor((note - 60) / 12);
        return res + `${note >= 12 ? 4 + d : '00'}`;
    }
}

module.exports = FreqToNote;
