L.Draw.Ellipse = L.Draw.SimpleShape.extend({
	statics: {
		TYPE: 'ellipse'
	},

	options: {
		shapeOptions: {
			stroke: true,
			color: '#f06eaa',
			weight: 4,
			opacity: 0.5,
			fill: true,
			fillColor: null, //same as color by default
			fillOpacity: 0.2,
			clickable: true
		},
		showRadius: true,
		metric: true // Whether to use the metric measurement system or imperial
	},

	initialize: function (map, options) {
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Ellipse.TYPE;

		this._initialLabelText = L.drawLocal.draw.handlers.ellipse.tooltip.start;

		L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
	},

	_drawShape: function (latlng) {
		if (!this._shape) {
			var radius = this._startLatLng.distanceTo(latlng);
			var radiusX = L.latLng(this._startLatLng.lat, this._startLatLng.lng).distanceTo(L.latLng(this._startLatLng.lat, latlng.lng));
			var radiusY = L.latLng(this._startLatLng.lat, this._startLatLng.lng).distanceTo(L.latLng(latlng.lat, this._startLatLng.lng));
			this._shape = new L.Ellipse(this._startLatLng, [radiusX, radiusY], 0, this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			var radius = this._startLatLng.distanceTo(latlng);
			var radiusX = L.latLng(this._startLatLng.lat, this._startLatLng.lng).distanceTo(L.latLng(this._startLatLng.lat, latlng.lng));
			var radiusY = L.latLng(this._startLatLng.lat, this._startLatLng.lng).distanceTo(L.latLng(latlng.lat, this._startLatLng.lng));
			this._shape.setRadius([radiusX, radiusY]);
		}
	},

	_fireCreatedEvent: function () {
		var ellipse = new L.Ellipse(this._startLatLng, [this._shape._mRadiusX, this._shape._mRadiusY], 0, this.options.shapeOptions);
		L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, ellipse);
	},

	_onMouseMove: function (e) {
		var latlng = e.latlng,
			showRadius = this.options.showRadius,
			useMetric = this.options.metric,
			radiusX,
			radiusY;

		this._tooltip.updatePosition(latlng);
		if (this._isDrawing) {
			this._drawShape(latlng);

			// get the new radii (rounded to 1 dp)
			radiusX = this._shape._mRadiusX.toFixed(1);
			radiusY = this._shape._mRadiusY.toFixed(1);

			this._tooltip.updateContent({
				text: this._endLabelText,
				subtext: showRadius ? L.drawLocal.draw.handlers.ellipse.radius + ' 1: ' + L.GeometryUtil.readableDistance(radiusX, useMetric) + " , " +
				L.drawLocal.draw.handlers.ellipse.radius + '2: ' + L.GeometryUtil.readableDistance(radiusY, useMetric): ''
			});
		}
	}
});
