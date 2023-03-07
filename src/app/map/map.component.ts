import { Component, AfterViewInit, OnInit, NgZone, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Deck, Layer, _GlobeView as GlobeView } from '@deck.gl/core/typed';
import { MapService } from './map.service';

const INITIAL_VIEW_STATE = {
  latitude: 18,
  longitude: -9,
  zoom: 1,
  maxZoom: 8,
  minZoom: 0,
  maxPitch: 89,
  bearing: 0,
};

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html'
 // styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('globe') private mapContainer!: ElementRef<HTMLCanvasElement>;
  deckgl?:Deck
  layers:Layer[]= []
  
  constructor(private ngZone:NgZone, private ms:MapService ){}

  ngOnInit(){
    this.layers.push(this.ms.createBitmapLayer("globe",[-180, -90, 180, 90]))
    this.layers.push(this.ms.createPathLayer("graticules",this.ms.getGraticules(30)))
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.deckgl = new Deck({
        initialViewState: INITIAL_VIEW_STATE,
        views: new GlobeView({id: 'globe', controller: true}), 
        canvas: this.mapContainer.nativeElement,
        style: {
          top:"10",
        },
        onClick: (e) => {
          console.log('Clicked on globe !', e);
        },
        parameters: {
          cull: true
        },
        // getTooltip: getTooltip,
        width: '100%',
        height: '100%',
        layers: this.layers
      });
    })
  }

  ngOnDestroy(): void {
    this.deckgl?.finalize()
  }

  getTooltip(tile:any) {
    return tile && `tile: x: ${tile.x}, y: ${tile.y}, z: ${tile.z}`;
  }
}
