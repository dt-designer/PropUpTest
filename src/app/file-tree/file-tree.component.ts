import {Component, OnInit, HostListener, Output, EventEmitter} from '@angular/core';
import { FileSystemService } from '../services/file-system.service';
import {FileNode} from "../model/file-node.model";

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent implements OnInit {
  fileSystem: FileNode[] = [];
  isCopyMode: boolean = false;
  selectedItem?: FileNode | null;

  private movedItem?: FileNode | null;
  private isDragging: boolean = false;

  @Output() itemSelected = new EventEmitter<FileNode>();

  constructor(private fileSystemService: FileSystemService) {}

  ngOnInit() {
    this.fileSystem = this.fileSystemService.getFileSystem();
  }

  @HostListener('window:keydown.shift', ['$event'])
  @HostListener('window:keyup.shift', ['$event'])
  handleShiftKey(event: KeyboardEvent) {
    event.preventDefault();
    this.isCopyMode = event.type === 'keydown';
  }

  onDragStart(event: DragEvent, item: FileNode) {
    if (event.dataTransfer && item && !this.isDragging) {
      this.isDragging = true;
      this.movedItem = !item.isRoot ? item : null;
      event.dataTransfer.effectAllowed = 'copyMove';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = event.shiftKey ? 'copy' : 'move';
    }
  }

  onDrop(event: DragEvent, targetItem: FileNode) {
    event.preventDefault();
    if (this.movedItem !== null && targetItem.isFolder && this.movedItem?.id !== targetItem.id) {
      const isCopy = event.shiftKey;
      const id = this.movedItem?.id!;
      this.fileSystemService.moveOrCopyItem(id, targetItem.id, isCopy);
      this.fileSystem = this.fileSystemService.getFileSystem();
    }
    this.movedItem = null;
    this.isDragging = false;
  }

  createItems(isFolder: boolean, count?: number) {
    count = count ? count : Number(prompt('Number of elements', String(50)));
    const parentId = this.selectedItem && this.selectedItem.isFolder ? this.selectedItem.id : 'root';
    this.fileSystemService.createItems(count, isFolder, parentId);
    this.fileSystem = this.fileSystemService.getFileSystem();
    if (this.selectedItem && !this.selectedItem.expanded) {
      this.toggleFolder(this.selectedItem);
    }
  }

  toggleFolder(item: FileNode) {
    if (item.isFolder) {
      item.expanded = !item.expanded;
    }
  }

  selectItem(item: FileNode, event: MouseEvent) {
    this.selectedItem = item;
    this.itemSelected.emit(item);
    event.stopPropagation();
  }

  getItemIcon(item: FileNode): string {
    if (item.isFolder && !item.icon) {
      return item.expanded ? 'folder-open' : 'folder';
    }
    return item.icon || 'file';
  }

  getFolderStateIcon(item: FileNode): string {
    if (item.isFolder) {
      return item.expanded ? 'minus' : 'plus';
    }
    return '';
  }
}
