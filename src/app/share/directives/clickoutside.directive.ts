import {
  Directive,
  ElementRef,
  Inject,
  Output,
  Renderer2,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Directive({
  selector: '[appClickoutside]'
})
export class ClickoutsideDirective implements OnChanges {
  private handleClick: () => void;
  @Input() bindFlag = false;
  @Output() clickOutSide = new EventEmitter<void>();

  constructor(
    private el: ElementRef,
    private rd: Renderer2,
    @Inject(DOCUMENT) private doc: Document
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bindFlag && !changes.bindFlag.firstChange) {
      if (this.bindFlag) {
        this.handleClick = this.rd.listen(this.doc, 'click', evt => {
          const isContains = this.el.nativeElement.contains(evt.target);
          if (!isContains) {
            this.clickOutSide.emit();
          }
        });
      } else {
        this.handleClick();
      }
    }
  }

}
