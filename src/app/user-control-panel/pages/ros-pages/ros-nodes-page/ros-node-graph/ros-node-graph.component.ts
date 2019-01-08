import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, mergeMap, reduce } from 'rxjs/operators';
import * as vis from 'vis';
import { ROSNodeDetails } from '../../../../../ros/shared/models/node-details.model';
import { ROSNodeService } from '../../../../../ros/shared/services/ros-node.service';

@Component({
  selector: 'ngx-ros-node-graph',
  templateUrl: './ros-node-graph.component.html',
  styleUrls: ['./ros-node-graph.component.scss']
})
export class RosNodeGraphComponent implements OnInit, AfterViewInit {

  @ViewChild('container', { read: ElementRef })
  container: ElementRef;

  isLoading = false;

  isZoomEnabled = false;

  map: vis.Network;

  mapOptions: vis.Options;

  mapData: any;

  constructor(private rosNodeService: ROSNodeService, private router: Router) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

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
                  length: 250
                });
              }
            });
          });
        });
      })
      .add(() => {
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
    this.map.on('doubleClick', this.handleDoubleClick.bind(this));
  }

  handleDoubleClick(params) {
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
    this.mapOptions.interaction.zoomView = this.isZoomEnabled;
    this.map.setOptions(this.mapOptions);
  }
}
