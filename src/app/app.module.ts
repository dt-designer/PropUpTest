import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { FileEditorComponent } from './file-editor/file-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    FileTreeComponent,
    FileEditorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
