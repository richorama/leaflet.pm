import Draw from './L.PM.Draw';

Draw.Route = Draw.Line.extend({
    initialize(map) {
        this._map = map;
        this._shape = 'Route';
        this.toolbarButtonName = 'drawRoute';
    },

});