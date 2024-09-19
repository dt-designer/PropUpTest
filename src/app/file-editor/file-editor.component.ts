import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FileSystemService } from '../services/file-system.service';
import { FileNode } from "../model/file-node.model";

@Component({
  selector: 'app-file-editor',
  templateUrl: './file-editor.component.html',
  styleUrls: ['./file-editor.component.scss']
})
export class FileEditorComponent implements OnChanges {
  @Input() selectedItem?: FileNode;

  editedName: string = '';
  editedIcon: string = '';

  icons: string[] = ['file', 'file-text', 'file-word', 'file-pdf', 'file-image', 'folder'];

  constructor(private fileSystemService: FileSystemService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedItem'] && this.selectedItem) {
      this.editedName = this.selectedItem.name;
      this.editedIcon = this.selectedItem.icon || (this.selectedItem.isFolder ? 'folder' : 'file');
    }
  }

  updateItem() {
    if (!this.editedName) {
      alert('The "Name" field is required and cannot be empty.');
      return;
    }
    if (this.selectedItem) {
      this.fileSystemService.updateItem(this.selectedItem.id, {
        name: this.editedName,
        icon: this.editedIcon
      });
    }
  }
}
