import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgReduxRouter } from 'ng2-redux-router';
import { NgRedux, select } from 'ng2-redux';
import { IState } from '../../reducers/root.reducer.shared';
import {
  verticalUiClass,
} from '../../styles';

@Component({
  selector: 'bd-angular',
  template: `
    <div class="${verticalUiClass}">
      <button *ngFor="let route of (routes$ | async)"
         [onClick]="changeScreen(route.path)"
         [value]="route.name"></button>
    </div>
    <router-outlet></router-outlet>
`,
})
export class App implements OnDestroy, OnInit {
  styles = { };
  @select((s) => s.app.routes) private routes$;
  private unsubscribe: Function;

  constructor(private ngRedux: NgRedux<IState>,
              private ngReduxRouter: NgReduxRouter,
              private router: Router) {
  }

  ngOnDestroy() {
    this.unsubscribe();
    this.ngReduxRouter.destroy();
  }

  ngOnInit() {
    this.unsubscribe = this.ngRedux.subscribe(() => {
      const game = this.ngRedux.getState().game;
      if (game.currentGameViewportDimensions.direction === 'row') {
        this.styles['flex-direction'] = 'row';
      } else {
        this.styles['flex-direction'] = 'column';
      }
    });
    this.ngReduxRouter.initialize(state => state.routing.angular);
  }

  changeScreen(path: string) {
    return () => this.router.navigate([`/${path}`]);
  }
}

/**
<!--<bd-game class="${flex} ${flexNoWrap}" -->
<!--[ngStyle]="styles" *ngSwitchCase="'game'"></bd-game>-->
  <!--<bd-config class="${flex} ${flexCol}" *ngSwitchCase="'config'">-->
  <!--</bd-config>-->
**/
