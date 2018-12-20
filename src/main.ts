// #region imports
import * as JQuery from "jquery";
import MapService from "./map/MapService";
const $ = JQuery.noConflict();
// #endregion

export class Main {
  // #region Variables
  private baseMapUrl: string;
  private mapInitialCenter: [number, number];
  private transformedPoint: [number, number];
  private mapInitialZoomLevel: number;
  private mapElement: string;
  // #endregion

  // #region Constructor
  constructor() {
    this.baseMapUrl = "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    this.mapInitialCenter = [33, 39];
    this.transformedPoint = MapService.TransformPoint(
      "EPSG:4326",
      "EPSG:3857",
      this.mapInitialCenter
    );
    this.mapInitialZoomLevel = 5;
    this.mapElement = "map";
  }
  // #endregion

  // #region Private Methods
  // #region Show Coordinate And ZoomLevel

  private displayCoordinate(lat?: string, lon?: string, zoom?: string): void {
    if (lat != undefined) $("#current-lat").text(lat);
    if (lon != undefined) $("#current-lon").text(lon);
    if (zoom != undefined) $("#current-zoom").text(zoom);
  }

  // #endregion
  // #endregion

  // #region Constructor
  public Init(): void {
    // #region Load Map
    var mapService = new MapService(
      this.mapElement,
      this.transformedPoint,
      this.mapInitialZoomLevel
    );
    mapService.AddTileLayer(this.baseMapUrl);
    // #endregion

    // #region Register Pointer Move Event
    mapService.GetPointerMoveObservable().subscribe((evt: any) => {
      
      let lonlat = MapService.TransformPoint(
        "EPSG:3857",
        "EPSG:4326",
        evt.coordinate
      );

      var currentZoomLevel = mapService.GetCurrentZoomLevel();
      let lon = lonlat[0].toFixed(4);
      let lat = lonlat[1].toFixed(4);
      this.displayCoordinate(lat, lon, Math.floor(currentZoomLevel).toString());
    });
    // #endregion

    // #region Register Pointer Move Event
    mapService.GetMoveEndObservable().subscribe((evt: any) => {
      var currentZoomLevel = mapService.GetCurrentZoomLevel();
      this.displayCoordinate(
        undefined,
        undefined,
        Math.floor(currentZoomLevel).toString()
      );
    });
    // #endregion
  }
  // #endregion
}

new Main().Init();