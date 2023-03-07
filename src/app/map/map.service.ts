import { Injectable } from '@angular/core';
import {
  BitmapLayer,
  PathLayer,
  GeoJsonLayer,
  ArcLayer,
  ScatterplotLayer,
  SolidPolygonLayer
} from '@deck.gl/layers/typed';

const WORLD_MAP = '../../assets/mercator.jpg';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  createScatterPlotLayer(id:string, layerdata:any) {
    return new ScatterplotLayer({
        id: id,
        data: layerdata,
        radiusScale: 200,
        stroked: true,
        getPosition: d => d.coordinates,
        getLineColor: d => [0, 188, 212],
      })
  }

  createPathLayer(id:string, layerdata:any) {
    return new PathLayer({
      id: id,
      data: layerdata,
      getPath: d => d,
      widthMinPixels: 1,
      getColor: [128, 128, 128]
    })
  }

  createSolidPolygonLayer(id:string, layerdata:any) {
    return new SolidPolygonLayer({
      id: id,
      data: [
        [[-180, 90], [0, 90], [180, 90], [180, -90], [0, -90], [-180, -90]]
      ],
      getPolygon: d => d,
      stroked: true,
      filled: true,
      getFillColor: [140, 140, 140]
    })
  }

  createBitmapLayer(id:string, layerdata:any) {
    return new BitmapLayer({
      id: id,
      bounds: layerdata,
      image: WORLD_MAP
    })
  }

  generateRandomPoints(){
    const points = [];
    /**
     * Generate 1 milion point
     */
    function rangeRandom(min:number, max:number) {
      return Math.random() * (max - min) + min;
    }

    for (let i = 0; i < 10; i++) {
      points.push({
        type: 'Point',
        coordinates: [
          rangeRandom(102.22939, 107.63940123),
          rangeRandom(10.22939, 27.9123981)
        ]
      });
    }
    return points
  }

  getGraticules(resolution:number):number[][][] {
    let graticules: number[][][] = [];
    for (let lat = 0; lat < 90; lat += resolution) {
      const path1 = [];
      const path2 = [];
      for (let lon = -180; lon <= 180; lon += 90) {
        path1.push([lon, lat]);
        path2.push([lon, -lat]);
      }
      graticules.push(path1);
      graticules.push(path2);
    }
    for (let lon = -180; lon < 180; lon += resolution) {
      const path = [];
      for (let lat = -90; lat <= 90; lat += 90) {
        path.push([lon, lat]);
      }
      graticules.push(path);
    }
    return graticules;
  }
}
