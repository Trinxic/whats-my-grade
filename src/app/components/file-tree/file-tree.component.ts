import { MatTreeNestedDataSource, MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  exists,
  mkdir,
  readDir,
  BaseDirectory,
  DirEntry,
} from "@tauri-apps/plugin-fs";
import * as path from "@tauri-apps/api/path";

export interface FileNode {
  name: string;
  children?: FileNode[];
}

@Component({
    selector: "app-file-tree",
    imports: [CommonModule, MatTreeModule, MatButtonModule, MatIconModule],
    templateUrl: "./file-tree.component.html",
    styleUrls: ["./file-tree.component.css"]
})
export class FileTreeComponent {
  // TODO:
  // - change to "Semesters"
  // - maybe change directory to AppData instead of Document
  semestersBaseDir: BaseDirectory = BaseDirectory.Document; // Not sure if this should be `:number`
  semestersDir: string = "wmg-test";
  fileTree: FileNode[] = [];

  treeControl = new NestedTreeControl<FileNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();

  constructor() {
    const tokenExists = exists(this.semestersDir, {
      baseDir: this.semestersBaseDir,
    });
    if (!tokenExists) {
      mkdir(this.semestersDir, { baseDir: this.semestersBaseDir });
    }
    this.dataSource.data = this.loadDirectories(this.semestersDir);
  }

  /** Load just one level of entries under `path` */
  private async loadDirectories(dirPath: string): Promise<FileNode[]> {
    const entries: DirEntry[] = await readDir(dirPath, {
      baseDir: this.semestersBaseDir,
    });

    const childNodes: FileNode[] = [];
    for (const entry of entries) {
      if (entry.isDirectory) {
        // If the entry has children, we can load them recursively
        const childNodes = await this.loadDirectories(
          await path.join(dirPath, entry.name),
        );
      }
    }

    return entries.map((ftNode) => ({
      name: ftNode.name ?? "UNKNOWN-FILE",
      children: childNodes ?? [],
    }));
  }
}
