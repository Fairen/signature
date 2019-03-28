import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isLoading: boolean;
  public finalImg: any;
  public tolerance: number;
  public capture: any;
  public width: any;
  public height: any;

  constructor(private quoteService: QuoteService) {
    this.tolerance = 75;
    this.capture = null;
  }

  ngOnInit() {
    this.isLoading = false;
  }

  public draw() {
    this.isLoading = true;
    let canvas: any = document.getElementById('canvas2');
    let ctx: any = canvas.getContext('2d');
    let image: any = document.getElementById('testImage');
    let tolerance = this.tolerance;
    this.width = image.naturalWidth;
    this.height = image.naturalHeight;

    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(image, 0, 0);

    var imgd = ctx.getImageData(0, 0, this.width, this.height),
      pix = imgd.data,
      newColor = { r: 0, g: 0, b: 0, a: 0 };

    for (var y = 0; y < imgd.height; y++) {
      for (var x = 0; x < imgd.width; x++) {
        var i = y * 4 * imgd.width + x * 4;
        var avg = (imgd.data[i] + imgd.data[i + 1] + imgd.data[i + 2]) / 3;
        imgd.data[i] = avg;
        imgd.data[i + 1] = avg;
        imgd.data[i + 2] = avg;
      }
    }

    for (var i = 0, n = pix.length; i < n; i += 4) {
      var r = pix[i],
        g = pix[i + 1],
        b = pix[i + 2];

      if (
        r <= 255 &&
        r >= 255 - tolerance &&
        (g <= 255 && g >= 255 - tolerance) &&
        (b <= 255 && b >= 255 - tolerance)
      ) {
        // Change the white to the new color.
        pix[i] = newColor.r;
        pix[i + 1] = newColor.g;
        pix[i + 2] = newColor.b;
        pix[i + 3] = newColor.a;
      } else {
        pix[i] = 0;
        pix[i + 1] = 0;
        pix[i + 2] = 0;
        pix[i + 3] = 100;
      }
    }

    ctx.putImageData(imgd, 0, 0);

    var img = new Image();
    img.onload = () => {
      this.finalImg = canvas.toDataURL('image/png');
      this.isLoading = false;
    };
    img.src = canvas.toDataURL('image/png');
  }

  onChange(files: any) {
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = () => {
        this.capture = fr.result;
      };
      fr.readAsDataURL(files[0]);
    }
  }
}
