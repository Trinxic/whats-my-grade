import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {
  exists,
  // mkdir,
  readDir,
  BaseDirectory,
  DirEntry,
} from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";

export interface FileNode {
  name: string;
  children?: FileNode[];
}

@Component({
  selector: "app-file-tree",
  templateUrl: "./file-tree.component.html",
  styleUrl: "./file-tree.component.css",
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileTreeComponent implements OnInit {
  // TODO:
  // - maybe change directory to AppData instead of Document
  // - change to "Semesters"
  semestersBaseDir: BaseDirectory = BaseDirectory.Document;
  semestersDir: string = "wmg-test";
  testText: string = "";

  childrenAccessor = (node: FileNode) => node.children ?? [];
  dataSource: FileNode[] = [];
  hasChild = (_: number, node: FileNode) =>
    !!node.children && node.children.length > 0;

  async ngOnInit(): Promise<void> {
    const tokenExists = exists(this.semestersDir, {
      baseDir: this.semestersBaseDir,
    });
    if (!tokenExists) {
      // mkdir(this.semestersDir, { baseDir: this.semestersBaseDir });
      this.testText = this.semestersDir + " Doesn't Exist";
    } else {
      // this.testText = "Loading Directories...";
      this.dataSource = await this.loadDirectories(this.semestersDir);
      this.testText = this.dataSource.toString();
    }
  }

  private async loadDirectories(dirPath: string): Promise<FileNode[]> {
    const entries: DirEntry[] = await readDir(dirPath, {
      baseDir: this.semestersBaseDir,
    });

    const nodes: FileNode[] = [];
    for (const entry of entries) {
      if (entry.name === ".DS_Store") {
        continue; // Skip .DS_Store files
      }

      const node: FileNode = {
        name: entry.name,
        children: [],
      };
      if (entry.isDirectory) {
        const entryPath = await join(dirPath, entry.name!);
        node.children = await this.loadDirectories(entryPath);
      }
      nodes.push(node);
    }
    return nodes;
  }

  async testDirList(): Promise<void> {
    const dirPath = this.semestersDir;
    const entries: DirEntry[] = await readDir(dirPath, {
      baseDir: this.semestersBaseDir,
    });
    for (const entry of entries) {
      console.log(entry.name);
    }
  }
}
