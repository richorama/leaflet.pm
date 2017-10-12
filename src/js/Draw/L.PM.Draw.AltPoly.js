import Draw from './L.PM.Draw';

Draw.AltPoly = Draw.Poly.extend({
    initialize(map) {
        this._map = map;
        this._shape = 'AltPoly';
        this.toolbarButtonName = 'drawAltPolygon';
    },

});
