import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: 'textarea[autoResize]',
})
export class AutoResizeDirective {
  @Input() maxHeight: number = 200; // Default max height is 200px

  constructor(private elementRef: ElementRef) {}

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  @HostListener('change', ['$event.target'])
  onChange(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.adjust());
  }

  adjust(): void {
    const textArea = this.elementRef.nativeElement;
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height =
      Math.min(textArea.scrollHeight, this.maxHeight) + 'px';
  }
}
