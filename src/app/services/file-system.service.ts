import { Injectable } from '@angular/core';
import {FileNode} from "../model/file-node.model";

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {
  private readonly fileSystem: FileNode[] = [];

  private adjectives = ['Red', 'Blue', 'Green', 'Yellow', 'Big', 'Small', 'Fast', 'Slow', 'Smart', 'Quiet'];
  private nouns = ['Cat', 'Dog', 'Bird', 'Fish', 'Tree', 'Flower', 'Stone', 'River', 'Mountain', 'Cloud'];
  private fileExtensions = ['txt', 'doc', 'pdf', 'jpg', 'png'];

  constructor() {
    this.fileSystem = [
      { id: 'root', name: 'Root', isFolder: true, children: [], expanded: true, isRoot: true }
    ];
  }

  getFileSystem() {
    return this.fileSystem;
  }

  createItems(count: number, isFolder: boolean, parentId: string) {
    const parent = this.findItemById(parentId);
    if (!parent || !parent.isFolder) {
      console.error('Invalid parent folder');
      return;
    }

    for (let i = 0; i < count; i++) {
      const newItem = {
        id: this.generateUniqueId(),
        name: this.generateRandomName(isFolder),
        isFolder: isFolder,
        children: [],
        expanded: false,
        isRoot: false,
        icon: isFolder ? 'folder' : this.getIconForFile(this.generateRandomName(false))
      };
      parent.children.push(newItem);
    }
  }

  moveOrCopyItem(sourceItemId: string, targetItemId: string, isCopy: boolean) {
    const sourceItem = this.findItemById(sourceItemId);
    const targetItem = this.findItemById(targetItemId);

    if (!sourceItem || !targetItem) {
      console.error('Source or target item not found');
      return;
    }

    const sourceParent = this.findParent(sourceItemId);
    if (!sourceParent) {
      console.error('Source parent not found');
      return;
    }

    const itemToMove = isCopy ? this.deepCopy(sourceItem) : sourceItem;

    if (targetItem.isFolder) {
      targetItem.children.push(itemToMove);
      targetItem.expanded = true;
    } else {
      const targetParent = this.findParent(targetItemId);
      if (!targetParent) {
        console.error('Target parent not found');
        return;
      }
      const targetIndex = targetParent.children.indexOf(targetItem);
      targetParent.children.splice(targetIndex + 1, 0, itemToMove);
    }

    if (!isCopy) {
      const sourceIndex = sourceParent.children.indexOf(sourceItem);
      sourceParent.children.splice(sourceIndex, 1);
    }
  }

  private findItemById(id: string): FileNode | null {
    const findItem = (items: FileNode[]): FileNode | null => {
      for (const item of items) {
        if (item.id === id) {
          return item;
        }
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findItem(this.fileSystem);
  }

  private findParent(id: string): FileNode | null {
    const findParentItem = (items: FileNode[]): FileNode | null => {
      for (const item of items) {
        if (item.children) {
          if (item.children.some((child: FileNode) => child.id === id)) {
            return item;
          }
          const found = findParentItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findParentItem(this.fileSystem);
  }

  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateRandomName(isFolder: boolean): string {
    const adjective = this.getRandomElement(this.adjectives);
    const noun = this.getRandomElement(this.nouns);

    if (isFolder) {
      return `${adjective} ${noun}`;
    } else {
      const extension = this.getRandomElement(this.fileExtensions);
      return `${adjective}_${noun}.${extension}`;
    }
  }

  private getRandomElement(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  private deepCopy(item: FileNode): FileNode {
    return JSON.parse(JSON.stringify(item));
  }

  updateItem(itemId: string, updates: { name?: string, icon?: string }) {
    const item = this.findItemById(itemId);
    if (item) {
      Object.assign(item, updates);
    } else {
      console.error('Item not found:', itemId);
    }
  }

  private getIconForFile(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'txt':
        return 'file-text';
      case 'doc':
      case 'docx':
        return 'file-word';
      case 'pdf':
        return 'file-pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'file-image';
      default:
        return 'file';
    }
  }
}
