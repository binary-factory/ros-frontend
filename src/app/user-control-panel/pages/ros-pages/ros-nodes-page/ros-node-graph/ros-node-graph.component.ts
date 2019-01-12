import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, mergeMap, reduce } from 'rxjs/operators';
import * as vis from 'vis';
import { ROSNodeDetails } from '../../../../../ros/shared/models/node-details.model';
import { ROSNodeService } from '../../../../../ros/shared/services/ros-node.service';
import { CardHeaderButton } from '../../../../../shared/components/card/card.component';

@Component({
  selector: 'ngx-ros-node-graph',
  templateUrl: './ros-node-graph.component.html',
  styleUrls: ['./ros-node-graph.component.scss']
})
export class RosNodeGraphComponent implements OnInit, AfterViewInit {

  @ViewChild('container')
  container: ElementRef;

  enableZoomButton: CardHeaderButton = {
    name: 'enableZoom',
    icon: 'nb-search',
    isActive: false
  };

  cardHeaderButtons: Array<CardHeaderButton> = [this.enableZoomButton];

  isLoading = false;

  isZoomEnabled = false;

  err: Error;

  map: vis.Network;

  mapOptions: vis.Options;

  mapData: any;

  constructor(private rosNodeService: ROSNodeService, private router: Router) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => this.refresh(), 0);
  }

  refresh() {
    this.isLoading = true;
    this.err = null;

    if (this.map) {
      this.map.destroy();
      this.map = null;
    }

    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);

    this.rosNodeService
      .getNodes({ enqueue: true })
      .pipe(
        concatMap(x => x as string),
        mergeMap((nodeName) => this.rosNodeService.getNodeDetails(nodeName)),
        reduce((array, nodeDetails) => {
          array.push(nodeDetails);
          return array;
        }, [])
      )
      .subscribe((nodeDetails: ROSNodeDetails[]) => {
        nodeDetails.forEach((item) => {
          if (item.name === '/rosout') {
            return;
          }
          nodes.add({
            id: item.name,
            label: item.name
          });

          item.publications.forEach((publication) => {
            nodeDetails.forEach((item2) => {
              if (item2.subscriptions.indexOf(publication) >= 0) {
                edges.add({
                  from: item.name,
                  to: item2.name,
                  label: publication,
                  arrows: 'from',
                  length: 500
                });
              }
            });
          });
        });
      }, (err) => {
        this.err = err;
      })
      .add(() => {
        console.log(this.isLoading);
        this.isLoading = false;
      });

    this.mapData = {
      nodes: nodes,
      edges: edges
    };
    this.mapOptions = {
      interaction: {
        zoomView: false
      }
    };

    this.map = new vis.Network(this.container.nativeElement, this.mapData, this.mapOptions);
    this.map.on('doubleClick', this.onDoubleClick.bind(this));
  }

  onDoubleClick(params) {
    console.log(params);
    if (params.nodes && params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      this.router.navigate(['/pages/ros/node/', nodeId]);

    } else if (params.edges && params.edges.length > 0) {
      const edgeId = params.edges[0];
      const topic = this.mapData.edges.get(edgeId).label;
      this.router.navigate(['/pages/ros/topic/', topic]);
    }
  }

  toggleZoom() {
    this.isZoomEnabled = !this.isZoomEnabled;
    this.enableZoomButton.isActive = this.isZoomEnabled;
    this.mapOptions.interaction.zoomView = this.isZoomEnabled;
    this.map.setOptions(this.mapOptions);
  }
}
