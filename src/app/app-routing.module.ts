import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ClipComponent } from './clip/clip.component';
import { ErrorComponent } from './error/error.component';
import { ClipService } from './services/clip.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'clip/:id', component: ClipComponent, resolve: { clip: ClipService } },
  { path: '', loadChildren: async () => (await import('./video/video.module')).VideoModule },
  { path: '**', component: ErrorComponent }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
