import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getAppModule } from './app.module';
import { partial } from '../../util';
import { EngineStore } from '../store/store';
import { Resizer } from '../aspect-resizer';
import '../../license';
// Global styles
import '../styles/index.css';


// Production mode
declare const __PRODUCTION__: boolean;

if (__PRODUCTION__) {
  enableProdMode();
} 

const UNMOUNT_RETRY = 50;
let appRef = null;
let isStarting = false;
let timeOut = null;

export function mount(store: EngineStore, resizer: Resizer) {
  if (appRef || isStarting) {
    return;
  }
  isStarting = true;

  const AppModule = getAppModule(store, resizer);

  return platformBrowserDynamic().bootstrapModule(AppModule)
    .then((ref) => {
      isStarting = false;
      appRef = ref;
    }).catch((err) => {
      /* tslint:disable no-console */
      console.log(`failed to bootstrap angular 2: ${err.message}`);
      console.log(err.stack);
    });
}

export function unmount(element: HTMLElement) {
  if (appRef) {
    appRef.destroy();
    appRef = null;
    const el = document.createElement('bd-angular');
    element.appendChild(el);
    if (timeOut) {
      clearTimeout(timeOut);
      timeOut = null;
    }
  } else if (isStarting) {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    timeOut = setTimeout(partial(unmount, element), UNMOUNT_RETRY);
  }
}
