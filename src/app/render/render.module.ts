import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenderComponent } from './render.component';
import { RenderRoutingModule } from './render-routing.module';
import { MaterialModule } from '@app/material.module';

@NgModule({
  declarations: [RenderComponent],
  imports: [RenderRoutingModule, MaterialModule, CommonModule]
})
export class RenderModule {}
