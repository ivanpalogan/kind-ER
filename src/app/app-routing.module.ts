import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // If your TabsPage is also Standalone, change this to loadComponent as well
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    // FIXED: Changed loadChildren to loadComponent and m.LoginPageModule to m.LoginPage
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}