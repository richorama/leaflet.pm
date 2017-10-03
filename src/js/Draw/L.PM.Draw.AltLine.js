import Draw from './L.PM.Draw';

Draw.AltLine = Draw.Line.extend({
    initialize(map) {
        this._map = map;
        this._shape = 'AltLine';
        this.toolbarButtonName = 'drawAltLine';
    },

});