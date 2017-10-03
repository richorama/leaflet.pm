import Draw from './L.PM.Draw';

Draw.DoubleArrow = Draw.Line.extend({
    initialize(map) {
        this._map = map;
        this._shape = 'DoubleArrow';
        this.toolbarButtonName = 'drawDoubleArrow';
    },
    enable(options) {
        // TODO: Think about if these options could be passed globally for all
        // instances of L.PM.Draw. So a dev could set drawing style one time as some kind of config
        L.Util.setOptions(this, options);
        console.log("arrows")
        // enable draw mode
        this._enabled = true;

        // create a new layergroup
        this._layerGroup = new L.LayerGroup();
        this._layerGroup._pmTempLayer = true;
        this._layerGroup.addTo(this._map);

        // this is the polyLine that'll make up the polygon
        this._layer = L.polyline([], this.options.templineStyle);
        this._layer._pmTempLayer = true;
        this._layerGroup.addLayer(this._layer);

        // this is the hintline from the mouse cursor to the last marker
        this._hintline = L.polyline([], this.options.hintlineStyle);
        this._hintline._pmTempLayer = true;
        this._layerGroup.addLayer(this._hintline);

        var arrowHintOptions = {stroke: true, color:this.options.hintlineStyle.color};
        var arrowSymbol1 = L.Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: arrowHintOptions});
        this._hintArrow1 = L.polylineDecorator(this._hintline, {
            patterns: [{offset: '100%', repeat: 0, symbol: arrowSymbol1}]
        });
        this._layerGroup.addLayer(this._hintArrow1);

        var arrowSymbol2 = L.Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: arrowHintOptions});
        this._hintArrow2 = L.polylineDecorator(this._hintline, {
            patterns: [{offset: '100%', repeat: 0, symbol: arrowSymbol2}]
        });
        this._layerGroup.addLayer(this._hintArrow2);


        // this is the hintmarker on the mouse cursor
        this._hintMarker = L.marker([0, 0], {
            icon: L.divIcon({ className: 'marker-icon cursor-marker' }),
        });
        this._hintMarker._pmTempLayer = true;
        this._layerGroup.addLayer(this._hintMarker);

        // show the hintmarker if the option is set
        if(this.options.cursorMarker) {
            L.DomUtil.addClass(this._hintMarker._icon, 'visible');
        }

        // change map cursor
        this._map._container.style.cursor = 'crosshair';

        // create a polygon-point on click
        this._map.on('click', this._createVertex, this);

        // finish on double click
        if(this.options.finishOnDoubleClick) {
            this._map.on('dblclick', this._finishShape, this);
        }

        // sync hint marker with mouse cursor
        this._map.on('mousemove', this._syncHintMarker, this);

        // sync the hintline with hint marker
        this._hintMarker.on('move', this._syncHintLine, this);

        // fire drawstart event
        this._map.fire('pm:drawstart', { shape: this._shape });

        // toggle the draw button of the Toolbar in case drawing mode got enabled without the button
        this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, true);

        // an array used in the snapping mixin.
        // TODO: think about moving this somewhere else?
        this._otherSnapLayers = [];
    },    

    _syncHintLine() {
        const polyPoints = this._layer.getLatLngs();

        if(polyPoints.length > 0) {
            const lastPolygonPoint = polyPoints[polyPoints.length - 1];

            // set coords for hintline from marker to last vertex of drawin polyline
            this._hintline.setLatLngs([lastPolygonPoint, this._hintMarker.getLatLng()]);
            this._hintArrow1.setPaths([lastPolygonPoint, this._hintMarker.getLatLng()]);
            this._hintArrow2.setPaths([this._hintMarker.getLatLng(), lastPolygonPoint]);
        }
    }
});