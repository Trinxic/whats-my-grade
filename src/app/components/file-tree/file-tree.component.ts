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
  isDirectory: boolean;
  children?: FileNode[];
}

@Component({
  selector: "app-file-tree",
  templateUrl: "./file-tree.component.html",
  styleUrl: "./file-tree.component.css",
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileTreeComponent implements OnInit {
  // TODO:
  // - maybe change directory to AppData instead of Document
  // - change to "Semesters"
  semestersBaseDir: BaseDirectory = BaseDirectory.Document;
  semestersDir: string = "wmg-test";

  childrenAccessor = (node: FileNode) => node.children ?? [];
  dataSource: FileNode[] = [];
  hasChild = (_: number, node: FileNode) =>
    !!node.children && node.children.length > 0;

  async ngOnInit(): Promise<void> {
    const dirExists = await exists(this.semestersDir, {
      baseDir: this.semestersBaseDir,
    });
    if (!dirExists) {
      // mkdir(this.semestersDir, { baseDir: this.semestersBaseDir });
    }
    this.dataSource = await this.loadDirectories(this.semestersDir);
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
        isDirectory: entry.isDirectory,
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
}
