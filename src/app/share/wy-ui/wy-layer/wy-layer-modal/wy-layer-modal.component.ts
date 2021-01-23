import {Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef} from '@angular/core';
import {AppStoreModule} from '../../../../store';
import {select, Store} from '@ngrx/store';
import {getModalType, getModalVisible} from '../../../../store/selectors/member.selectors';
import {ModalTypes} from '../../../../store/reducers/member.reducer';
import {Overlay, OverlayRef, OverlayKeyboardDispatcher} from '@angular/cdk/overlay';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModalComponent implements OnInit {
  showModal = false;
  private visible: boolean;
  private currentModalType: ModalTypes;
  private overlayRef: OverlayRef;

  constructor(
    private store$: Store<{ member: AppStoreModule }>,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef
  ) {
    const appStore$ = this.store$.pipe(select('member'));
    appStore$.pipe(select(getModalVisible)).subscribe(visible => this.watchModalVisible(visible));
    appStore$.pipe(select(getModalType)).subscribe(type => this.watchModalType(type));
  }

  ngOnInit(): void {
    this.createOverlay();
  }

  private createOverlay(): void {
    this.overlayRef = this.overlay.create();
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe(e => this.keydownListener(e));
  }

  private keydownListener(e): void {
    console.log('e:', e);
  }

  private watchModalVisible(visible): void {
    debugger;
    if (this.visible !== visible) {
      this.visible = visible;
      this.handleVisibleChange(visible);
    }
  }

  private watchModalType(type): void {
    if (this.currentModalType !== type) {
      this.currentModalType = type;
    }
  }

  private handleVisibleChange(vis): void {
    this.showModal = vis;
    if (vis) {
      this.overlayKeyboardDispatcher.add(this.overlayRef);
    } else {
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.dismissOverlay();
    }
    this.cdr.markForCheck();
  }

  private dismissOverlay(): void {
  }

}
