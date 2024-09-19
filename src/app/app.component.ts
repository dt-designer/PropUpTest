import { Component } from '@angular/core';
import { FileNode } from "./model/file-node.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  selectedItem?: FileNode;

  onSelectItem(item: FileNode) {
    this.selectedItem = item;
  }
}
