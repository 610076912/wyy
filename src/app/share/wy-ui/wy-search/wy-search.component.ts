import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges, ViewContainerRef
} from '@angular/core';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, pluck} from 'rxjs/operators';
import {SearchResult} from '../../../service/data-types/common.types';
import {isEmptyObject} from '../../../utils/tools';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {WySearchPanelComponent} from './wy-search-panel/wy-search-panel.component';

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() customView: TemplateRef<any>;
  @Input() searchResult: SearchResult;
  @Input() connectedRef: ElementRef;
  @Output() search = new EventEmitter<string>();
  @ViewChild('nzInput', {static: false}) private nzInput: ElementRef;
  @ViewChild('search', {static: false}) private searchRef: ElementRef;

  private overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    fromEvent(this.nzInput.nativeElement, 'input')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        pluck('target', 'value')
      )
      .subscribe((res: string) => {
        this.search.emit(res);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes:', changes);
    if (changes.searchResult && !changes.searchResult.firstChange) {
      this.showOverlayPanel();
    }
  }

  onFocus(): void {
    if (this.searchResult && !isEmptyObject(this.searchResult)) {
      this.showOverlayPanel();
    }
  }

  onBlur(): void {
    this.hideOverlayPanel();
  }

  showOverlayPanel(): void {
    this.hideOverlayPanel();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.connectedRef || this.searchRef)
      .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      }]).withLockedPosition(true);
    this.overlayRef = this.overlay.create({
      // hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
    const panelPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef);
    const panelRef = this.overlayRef.attach(panelPortal);
    panelRef.instance.searchResult = this.searchResult;
    this.overlayRef.backdropClick().subscribe(() => {
      this.hideOverlayPanel();
    });
  }

  hideOverlayPanel(): void {
    if (this.overlayRef && this.overlayRef.hasAttached) {
      this.overlayRef.dispose();
    }
  }

}
