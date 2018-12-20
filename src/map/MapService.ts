import * as ol from "openlayers";
import { fromEvent, Observable } from "rxjs";

class MapService {
    
  // #region Private Variable
  private _map: ol.Map;
  private _mapView: ol.View;
  // #endregion

  // #region Constructor
  constructor(
    elementId: string,
    mapCenter: [number, number],
    zoomLevel: number
  ) {
    this._mapView = new ol.View({
      center: mapCenter,
      zoom: zoomLevel
    });
    this._map = new ol.Map({
      target: elementId,
      view: this._mapView
    });

    this._map.addControl(new ol.control.FullScreen());
  }
  // #endregion

  // #region Observable Source
  public GetMoveEndObservable(): Observable<Event> {
    return fromEvent(this._map as any, "moveend");
  }

  public GetPointerMoveObservable(): Observable<Event> {
    return fromEvent(this._map as any, "pointermove");
  }

  // #endregion

  // #region Public Methods

  public AddTileLayer(url: string): void {
    var layer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: url
      })
    });
    this._map.addLayer(layer);
  }

  public static TransformPoint(
    from: string,
    to: string,
    coordinate: [number, number]
  ): [number, number] {
    return ol.proj.transform(coordinate, from, to);
  }

  public GetCurrentZoomLevel(): number {
    return this._map.getView().getZoom();
  }
  // #endregion
}

export default MapService;
