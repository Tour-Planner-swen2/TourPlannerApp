import { Component, input, InputSignal } from '@angular/core';



@Component({
  selector: 'app-custom-button',
  imports: [],
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.css',
})
export class CustomButton {
  label: InputSignal<string> = input.required<string>();
}
