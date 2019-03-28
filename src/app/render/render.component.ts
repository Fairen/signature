import { Component, OnInit } from '@angular/core';
import Konva from 'konva'; // tslint:disable-line

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.scss']
})
export class RenderComponent implements OnInit {
  public layer: any;
  public stage: any;
  public topLeft: any;
  public topRight: any;
  public bottomLeft: any;
  public bottomRight: any;
  public signGroup: any;

  public width: any;
  public height: any;

  public docLoaded: boolean;
  public signatureLoaded: boolean;

  constructor() {
    this.docLoaded = false;
    this.signatureLoaded = false;
  }

  ngOnInit() {}

  update(activeAnchor: any) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var image = group.get('Image')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    // update anchor positions
    switch (activeAnchor.getName()) {
      case 'topLeft':
        topRight.y(anchorY);
        bottomLeft.x(anchorX);
        break;
      case 'topRight':
        topLeft.y(anchorY);
        bottomRight.x(anchorX);
        break;
      case 'bottomRight':
        bottomLeft.y(anchorY);
        topRight.x(anchorX);
        break;
      case 'bottomLeft':
        bottomRight.y(anchorY);
        topLeft.x(anchorX);
        break;
    }

    image.position(topLeft.position());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if (width && height) {
      image.width(width);
      image.height(height);
    }
  }

  addAnchor(group: any, x: any, y: any, name: any) {
    var layer = group.getLayer();

    var anchor = new Konva.Circle({
      // tslint:disable-line
      x: x,
      y: y,
      stroke: '#0069c0',
      fill: '#2196f3',
      strokeWidth: 2,
      radius: 4,
      name: name,
      draggable: true,
      dragOnTop: false
    });

    anchor.on('dragmove', () => {
      this.update(anchor);
      layer.draw();
    });
    anchor.on('mousedown touchstart', () => {
      group.draggable(false);
      anchor.moveToTop();
    });
    anchor.on('dragend', () => {
      group.draggable(true);
      layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
      var layer = anchor.getLayer();
      document.body.style.cursor = 'pointer';
      anchor.strokeWidth(4);
      layer.draw();
    });
    anchor.on('mouseout', () => {
      var layer = anchor.getLayer();
      document.body.style.cursor = 'default';
      anchor.strokeWidth(2);
      layer.draw();
    });

    group.add(anchor);
    return anchor;
  }

  uploadSignature(files: any) {
    // yoda
    let docFile = files[0];
    var yodaImg = new Konva.Image(<any>{
      width: 93,
      height: 104
    });

    this.signGroup = new Konva.Group({
      x: 20,
      y: 110,
      draggable: true
    });
    this.layer.add(this.signGroup);
    this.signGroup.add(yodaImg);
    this.topLeft = this.addAnchor(this.signGroup, 0, 0, 'topLeft');
    this.topRight = this.addAnchor(this.signGroup, 93, 0, 'topRight');
    this.bottomRight = this.addAnchor(this.signGroup, 93, 104, 'bottomRight');
    this.bottomLeft = this.addAnchor(this.signGroup, 0, 104, 'bottomLeft');

    var imageObj2 = new Image();
    imageObj2.onload = () => {
      yodaImg.image(imageObj2);
      this.layer.draw();
      this.signatureLoaded = true;
    };

    var reader = new FileReader();

    reader.onload = function(event: any) {
      imageObj2.src = event.target.result;
    };

    reader.readAsDataURL(docFile);
  }

  uploadDoc(files: any) {
    let docFile = files[0];

    var imageObj1 = new Image();
    imageObj1.onload = () => {
      this.width = imageObj1.naturalWidth;
      this.height = imageObj1.naturalHeight;
      console.log(this.width, this.height);

      let height = window.innerHeight;
      let width = (imageObj1.naturalWidth * height) / imageObj1.naturalHeight;
      if (width + 64 > window.innerWidth) {
        width = window.innerWidth - 64;
        height = (imageObj1.naturalHeight * width) / imageObj1.naturalWidth;
      }

      this.stage = new Konva.Stage({
        // tslint:disable-line
        container: 'container',
        width: width,
        height: height
      });

      this.layer = new Konva.Layer(); // tslint:disable-line
      this.stage.add(this.layer);

      // darth vader
      var darthVaderImg = new Konva.Image(<any>{
        // tslint:disable-line
        width: width,
        height: height
      });

      var darthVaderGroup = new Konva.Group({
        // tslint:disable-line
        x: 0,
        y: 0
      });
      this.layer.add(darthVaderGroup);
      darthVaderGroup.add(darthVaderImg);
      darthVaderImg.image(imageObj1);
      this.layer.draw();
      this.docLoaded = true;
    };

    var reader = new FileReader();
    reader.onload = (event: any) => {
      imageObj1.src = event.target.result; // tslint:disable-line
    };
    reader.readAsDataURL(docFile);
  }

  downloadURI(uri: any, name: any) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  sign() {
    this.topLeft.remove();
    this.topRight.remove();
    this.bottomLeft.remove();
    this.bottomRight.remove();

    var dataURL = this.stage.toDataURL({
      mimeType: 'image/png',
      quality: 1,
      pixelRatio: this.height / window.innerHeight
    });

    this.downloadURI(dataURL, 'signed-document.png');
    this.signGroup.add(this.topLeft);
    this.signGroup.add(this.topRight);
    this.signGroup.add(this.bottomLeft);
    this.signGroup.add(this.bottomRight);
  }
}
